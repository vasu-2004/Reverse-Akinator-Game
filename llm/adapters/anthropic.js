// ============================================================
// Anthropic Adapter
// ============================================================
// Mirrors ADT's AnthropicAdapter — wraps the official
// @anthropic-ai/sdk for Claude models.
// ============================================================

const BaseLLMAdapter = require("./base");

class AnthropicAdapter extends BaseLLMAdapter {
  /**
   * @param {Object} adapterConfig
   * @param {string} adapterConfig.apiKey
   * @param {string} [adapterConfig.modelName]
   */
  constructor({ apiKey, modelName }) {
    super("anthropic");
    const Anthropic = require("@anthropic-ai/sdk");
    this.client = new Anthropic({ apiKey });
    this.defaultModel = modelName || "claude-sonnet-4-20250514";
  }

  /**
   * Anthropic uses a separate `system` parameter — extract it
   * from the messages array.
   */
  _convertMessages(messages) {
    let system = "";
    const converted = [];

    for (const msg of messages) {
      if (msg.role === "system") {
        system += (system ? "\n" : "") + msg.content;
      } else {
        converted.push({ role: msg.role, content: msg.content });
      }
    }

    return { system, messages: converted };
  }

  /** @override */
  async invoke(messages, options = {}) {
    const model = options.model || this.defaultModel;
    const { system, messages: apiMessages } = this._convertMessages(messages);

    const response = await this.client.messages.create({
      model,
      max_tokens: options.maxTokens ?? 60,
      temperature: options.temperature ?? 0.1,
      system: system || undefined,
      messages: apiMessages,
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    return {
      content: text.trim(),
      provider: this.provider,
      model,
      metadata: {
        usage: response.usage || {},
        stopReason: response.stop_reason,
      },
    };
  }

  /** @override */
  async *stream(messages, options = {}) {
    const model = options.model || this.defaultModel;
    const { system, messages: apiMessages } = this._convertMessages(messages);

    const stream = this.client.messages.stream({
      model,
      max_tokens: options.maxTokens ?? 256,
      temperature: options.temperature ?? 0.1,
      system: system || undefined,
      messages: apiMessages,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta?.type === "text_delta"
      ) {
        yield event.delta.text;
      }
    }
  }
}

module.exports = AnthropicAdapter;
