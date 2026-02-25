// ============================================================
// LLM module — barrel export
// ============================================================

const { LLMGateway, initializeGateway } = require("./gateway");
const adapters = require("./adapters");

module.exports = {
  LLMGateway,
  initializeGateway,
  ...adapters,
};
