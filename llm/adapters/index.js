// ============================================================
// Adapter barrel export
// ============================================================

module.exports = {
  BaseLLMAdapter: require("./base"),
  OpenAIAdapter: require("./openai"),
  GoogleGenAIAdapter: require("./google"),
  AnthropicAdapter: require("./anthropic"),
};
