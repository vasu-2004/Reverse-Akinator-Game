// ============================================================
// REVERSE AKINATOR — Centralized Configuration
// ============================================================
// Mirrors the ADT-templates pattern: a single config module
// that reads from .env and exposes validated, typed settings.
// Equivalent to adt_core's Pydantic BaseSettings Config class.
// ============================================================

require("dotenv").config();

/**
 * Supported LLM provider identifiers.
 * Mirrors ADT's LLMProvider enum.
 */
const LLMProvider = Object.freeze({
  OPENAI: "openai",
  GOOGLE_GENAI: "google_genai",
  ANTHROPIC: "anthropic",
});

/**
 * Read a JSON array from an env var (with fallback).
 */
function parseJsonArray(envValue, fallback) {
  if (!envValue) return fallback;
  try {
    const parsed = JSON.parse(envValue);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Centralized app config — loaded once at startup.
 * All LLM-related env vars funnel through here.
 */
const config = Object.freeze({
  // ---- Server ----
  port: parseInt(process.env.PORT, 10) || 3000,

  // ---- Default LLM provider & model ----
  defaultLlmProvider: process.env.DEFAULT_LLM_PROVIDER || process.env.MODEL_PROVIDER || LLMProvider.OPENAI,
  modelName: process.env.MODEL_NAME || process.env.OPENAI_MODEL || "gpt-4o-mini",

  // ---- Supported providers (JSON array) ----
  supportedLlmProviders: parseJsonArray(
    process.env.SUPPORTED_LLM_PROVIDERS,
    [LLMProvider.OPENAI] // default: only OpenAI
  ),

  // ---- Provider-specific keys ----
  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiBaseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",

  // Google Generative AI (Gemini) — supports both API key and Vertex AI SA
  googleApiKey: process.env.GOOGLE_API_KEY || "",
  modelProjectId: process.env.MODEL_PROJECT_ID || "",
  modelLocation: process.env.MODEL_LOCATION || "us-central1",
  modelServiceAccountJson: process.env.MODEL_SERVICE_ACCOUNT_JSON || "",

  // Anthropic
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",

  // ---- Logging ----
  logLevel: process.env.LOG_LEVEL || "INFO",
});

/**
 * Validate that the active provider has a configured API key.
 * Returns { valid: boolean, error?: string }.
 */
function validateConfig() {
  const provider = config.defaultLlmProvider;
  const placeholder = (v) => !v || v === "your-api-key-here" || v === "not-set";

  switch (provider) {
    case LLMProvider.OPENAI:
      if (placeholder(config.openaiApiKey))
        return { valid: false, error: "OPENAI_API_KEY is not configured. Add it to your .env file." };
      break;
    case LLMProvider.GOOGLE_GENAI: {
      const hasApiKey = !placeholder(config.googleApiKey);
      const hasProjectId = !!config.modelProjectId;
      const hasServiceAccount = !!config.modelServiceAccountJson && hasProjectId;
      // ADC mode: only MODEL_PROJECT_ID is needed (on GCP or with gcloud auth)
      if (!hasApiKey && !hasProjectId)
        return { valid: false, error: "Google GenAI requires GOOGLE_API_KEY or MODEL_PROJECT_ID (+ optional MODEL_SERVICE_ACCOUNT_JSON). On GCP, only MODEL_PROJECT_ID is needed." };
      break;
    }
    case LLMProvider.ANTHROPIC:
      if (placeholder(config.anthropicApiKey))
        return { valid: false, error: "ANTHROPIC_API_KEY is not configured. Add it to your .env file." };
      break;
    default:
      return { valid: false, error: `Unknown LLM provider: "${provider}". Supported: ${Object.values(LLMProvider).join(", ")}` };
  }

  return { valid: true };
}

module.exports = { config, validateConfig, LLMProvider };
