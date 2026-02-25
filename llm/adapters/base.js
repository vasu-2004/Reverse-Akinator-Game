// ============================================================
// Base LLM Adapter — Abstract interface
// ============================================================
// Mirrors ADT's BaseLLMAdapter.  Every provider adapter must
// implement invoke() and (optionally) stream().
// ============================================================

/**
 * @typedef {Object} LLMMessage
 * @property {"system"|"user"|"assistant"} role
 * @property {string} content
 */

/**
 * @typedef {Object} LLMResponse
 * @property {string}  content   — The text response from the model
 * @property {string}  provider  — Provider identifier (e.g. "openai")
 * @property {string}  model     — Model name used
 * @property {Object}  metadata  — Token usage and other info
 */

class BaseLLMAdapter {
  /**
   * @param {string} provider — e.g. "openai"
   */
  constructor(provider) {
    if (new.target === BaseLLMAdapter) {
      throw new Error("BaseLLMAdapter is abstract — use a provider-specific subclass.");
    }
    this.provider = provider;
  }

  /**
   * Send a chat-completion request.
   * @param {LLMMessage[]} messages
   * @param {Object} [options] — { model, maxTokens, temperature, ... }
   * @returns {Promise<LLMResponse>}
   */
  async invoke(_messages, _options = {}) {
    throw new Error("invoke() must be implemented by subclass.");
  }

  /**
   * (Optional) Streaming variant — yields content chunks.
   * @param {LLMMessage[]} messages
   * @param {Object} [options]
   * @returns {AsyncGenerator<string>}
   */
  async *stream(_messages, _options = {}) {
    throw new Error("stream() is not implemented for this adapter.");
  }
}

module.exports = BaseLLMAdapter;
