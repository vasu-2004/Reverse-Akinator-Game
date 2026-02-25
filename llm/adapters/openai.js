// ============================================================
// OpenAI Adapter
// ============================================================
// Mirrors ADT's OpenAIAdapter — wraps the official openai SDK.
// Supports any OpenAI-compatible endpoint via baseURL.
// ============================================================

const BaseLLMAdapter = require("./base");

class OpenAIAdapter extends BaseLLMAdapter {
  /**
   * @param {Object} adapterConfig
   * @param {string} adapterConfig.apiKey
   * @param {string} [adapterConfig.baseUrl]
   * @param {string} [adapterConfig.modelName]
   */
  constructor({ apiKey, baseUrl, modelName }) {
    super("openai");
    // Lazy-load the SDK so missing dependency throws a clear error
    const { OpenAI } = require("openai");
    this.client = new OpenAI({
      apiKey,
      baseURL: baseUrl || "https://api.openai.com/v1",
    });
    this.defaultModel = modelName || "gpt-4o-mini";
  }

  /** @override */
  async invoke(messages, options = {}) {
    const model = options.model || this.defaultModel;
    const completion = await this.client.chat.completions.create({
      model,
      messages,
      max_tokens: options.maxTokens ?? 60,
      temperature: options.temperature ?? 0.1,
    });

    const choice = completion.choices[0];
    return {
      content: (choice.message.content || "").trim(),
      provider: this.provider,
      model,
      metadata: {
        usage: completion.usage || {},
        finishReason: choice.finish_reason,
      },
    };
  }

  /** @override */
  async *stream(messages, options = {}) {
    const model = options.model || this.defaultModel;
    const stream = await this.client.chat.completions.create({
      model,
      messages,
      max_tokens: options.maxTokens ?? 256,
      temperature: options.temperature ?? 0.1,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) yield delta;
    }
  }
}

module.exports = OpenAIAdapter;
