"""
core/llm_bridge.py  –  LLM & Embedding Bridge (ADT Gateway Pattern)
====================================================================
This is the **single source of truth** for all LLM and embedding calls in
UnifiedRAG.  It uses the ADT (Aviator Development Toolkit) gateway pattern:

    adt_core.llms.initialize_gateway()   →  registers provider adapters
    llm_gateway.get_client(provider, model_name)  →  returns a LangChain BaseChatModel

This makes the system provider-agnostic: Google GenAI, OpenAI, and Anthropic
are all supported transparently.  The active provider is chosen by the
MODEL_PROVIDER environment variable.

For **embeddings**, the ADT gateway does not expose an embedding endpoint,
so we use LangChain embedding classes directly (GoogleGenerativeAIEmbeddings
or OpenAIEmbeddings), selected based on the same env-var configuration.

Exports
-------
- adt_complete(prompt, ...)          → async LLM completion
- embed_texts_async(texts)           → async embeddings  (np.ndarray)
- embed_texts(texts, batch_size)     → sync embeddings   (np.ndarray)
- get_embedding_dim()                → int (768 for Google, 1536 for OpenAI)
"""

from __future__ import annotations

import asyncio
import hashlib
import logging
import os
import time
from typing import List, Optional

import numpy as np

logger = logging.getLogger("UnifiedRAG")

# ── Load .env early so adt_core reads the right env vars ─────────────────────
_PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
_ENV_PATH = os.path.join(_PROJECT_ROOT, ".env")
if os.path.exists(_ENV_PATH):
    from dotenv import load_dotenv
    load_dotenv(_ENV_PATH, override=True)


# ═══════════════════════════════════════════════════════════════════════════════
#  Internal: lazy config & gateway helpers
# ═══════════════════════════════════════════════════════════════════════════════

def _config():
    """Return the adt_core Config singleton (reads from env vars)."""
    from adt_core.configs.config import get_config
    return get_config()


_gateway_ready = False


def _ensure_gateway():
    """Initialize the ADT LLM gateway exactly once."""
    global _gateway_ready
    if not _gateway_ready:
        from adt_core.llms import initialize_gateway
        initialize_gateway()
        _gateway_ready = True


# ═══════════════════════════════════════════════════════════════════════════════
#  Embedding provider detection
# ═══════════════════════════════════════════════════════════════════════════════

def _get_embedding_provider() -> str:
    """Determine which embedding provider to use based on env-var credentials."""
    cfg = _config()
    provider = (cfg.model_provider or "google_genai").strip().strip('"').lower()
    google_key = (cfg.google_api_key or "").strip().strip('"')
    project_id = (cfg.model_project_id or "").strip().strip('"')
    openai_key = (cfg.openai_api_key or "").strip().strip('"')

    if provider == "openai" and openai_key:
        return "openai"
    if provider == "anthropic":
        return "openai" if openai_key else ("google" if (google_key or project_id) else "fallback")
    if google_key or project_id:
        return "google"
    if openai_key:
        return "openai"
    return "fallback"


def get_embedding_dim() -> int:
    """Return embedding dimensionality for the configured provider."""
    return 1536 if _get_embedding_provider() == "openai" else 768


# ═══════════════════════════════════════════════════════════════════════════════
#  Async embedding function
# ═══════════════════════════════════════════════════════════════════════════════

async def embed_texts_async(texts: List[str]) -> np.ndarray:
    """
    Generate embeddings for a list of strings.

    Provider cascade:
      1. Google GenAI (text-embedding-004, dim=768)
      2. OpenAI (text-embedding-3-small, dim=1536)
      3. Fallback: deterministic SHA-512 hash (testing only)

    Returns
    -------
    np.ndarray of shape (len(texts), embedding_dim)
    """
    cfg = _config()
    google_key = (cfg.google_api_key or "").strip().strip('"')
    project_id = (cfg.model_project_id or "").strip().strip('"')
    openai_key = (cfg.openai_api_key or "").strip().strip('"')
    embed_provider = _get_embedding_provider()

    # ── 1. Google GenAI ──────────────────────────────────────────────
    if embed_provider == "google" and (google_key or project_id):
        try:
            from langchain_google_genai import GoogleGenerativeAIEmbeddings
            params = {"model": "models/text-embedding-004"}
            if google_key:
                params["google_api_key"] = google_key
            elif project_id:
                params["project"] = project_id
            model = GoogleGenerativeAIEmbeddings(**params)
            result = await model.aembed_documents(texts)
            return np.array(result)
        except Exception as exc:
            logger.warning(f"Google embeddings failed: {exc}")

    # ── 2. OpenAI ────────────────────────────────────────────────────
    if openai_key:
        try:
            from langchain_openai import OpenAIEmbeddings
            model = OpenAIEmbeddings(model="text-embedding-3-small", api_key=openai_key)
            result = await model.aembed_documents(texts)
            return np.array(result)
        except Exception as exc:
            logger.warning(f"OpenAI embeddings failed: {exc}")

    # ── 3. Fallback: hash-based pseudo-embeddings ────────────────────
    logger.warning("Using fallback hash-based embeddings – NOT for production!")
    dim = get_embedding_dim()
    vecs: list[np.ndarray] = []
    for text in texts:
        h = hashlib.sha512(text.encode()).digest()
        raw = h
        while len(raw) < dim * 4:
            h = hashlib.sha512(h).digest()
            raw += h
        vec = np.frombuffer(raw[: dim * 4], dtype=np.float32).copy()
        vec /= np.linalg.norm(vec) + 1e-10
        vecs.append(vec)
    return np.array(vecs)


# ═══════════════════════════════════════════════════════════════════════════════
#  Sync embedding helper
# ═══════════════════════════════════════════════════════════════════════════════

def embed_texts(texts: List[str], batch_size: int = 50) -> np.ndarray:
    """
    Synchronous wrapper around embed_texts_async.

    Splits texts into batches, retries on failure, and concatenates results.
    """
    all_embeddings: list[np.ndarray] = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        for retry in range(3):
            try:
                loop = _get_or_create_event_loop()
                vecs = loop.run_until_complete(embed_texts_async(batch))
                all_embeddings.append(vecs)
                break
            except Exception as exc:
                logger.warning(f"Embedding batch {i} retry {retry + 1}: {exc}")
                time.sleep(2 * (retry + 1))
        else:
            dim = get_embedding_dim()
            all_embeddings.append(np.zeros((len(batch), dim), dtype="float32"))
    if not all_embeddings:
        return np.empty((0, get_embedding_dim()))
    return np.concatenate(all_embeddings, axis=0)


def _get_or_create_event_loop():
    """Get or create an asyncio event loop safe for non-async callers."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            raise RuntimeError
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop


# ═══════════════════════════════════════════════════════════════════════════════
#  LLM chat completion  (via ADT gateway)
# ═══════════════════════════════════════════════════════════════════════════════

_llm_client = None


def _get_llm_client():
    """
    Lazily build a LangChain BaseChatModel via the ADT LLM gateway.

    This is the canonical ADT pattern:
        initialize_gateway()  →  llm_gateway.get_client(provider, model_name)
    """
    global _llm_client
    if _llm_client is not None:
        return _llm_client

    _ensure_gateway()

    cfg = _config()
    from adt_core.llms import llm_gateway

    provider = (cfg.model_provider or cfg.default_llm_provider or "google_genai").strip().strip('"').lower()
    model_name = cfg.model_name

    logger.info(f"Constructing LLM via ADT gateway: provider={provider}, model={model_name}")
    _llm_client = llm_gateway.get_client(provider, model_name)
    logger.info(f"LLM client ready ({provider} / {model_name})")
    return _llm_client


async def adt_complete(
    prompt: str,
    system_prompt: Optional[str] = None,
    history_messages: Optional[list] = None,
    keyword_extraction: bool = False,
    **kwargs,
) -> str:
    """
    LLM completion via the ADT gateway (async).

    Parameters
    ----------
    prompt : str
        The user message to send.
    system_prompt : str, optional
        An optional system instruction prepended to the conversation.
    history_messages : list[dict], optional
        Previous turns as [{"role": "user"|"assistant"|"system", "content": "..."}].
    keyword_extraction : bool
        If True, attempt to extract raw JSON from the response.

    Returns
    -------
    str – the model's text response.
    """
    from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

    client = _get_llm_client()
    messages = []

    if system_prompt:
        messages.append(SystemMessage(content=system_prompt))
    for msg in (history_messages or []):
        role = msg.get("role", "user")
        content = msg.get("content", "")
        if role == "user":
            messages.append(HumanMessage(content=content))
        elif role == "assistant":
            messages.append(AIMessage(content=content))
        elif role == "system":
            messages.append(SystemMessage(content=content))
    messages.append(HumanMessage(content=prompt))

    try:
        response = await client.ainvoke(messages)
        result = response.content
    except Exception as exc:
        logger.error(f"LLM call failed: {exc}")
        raise RuntimeError(
            f"LLM call failed ({type(exc).__name__}): {exc}. "
            "Check your API keys and provider configuration in .env"
        ) from exc

    # For keyword extraction, try to return raw JSON body
    if keyword_extraction:
        from .utils import locate_json_string_body_from_string
        json_body = locate_json_string_body_from_string(result)
        if json_body is not None:
            return json_body

    return result
