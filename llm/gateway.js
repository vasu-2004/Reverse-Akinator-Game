// ============================================================
// LLM Gateway — Unified multi-provider facade
// ============================================================
// Mirrors ADT's LLMGateway class.  Registers provider adapters
// at startup, then exposes invoke() / stream() / getClient()
// that delegate to the correct adapter based on provider name.
//
// Usage:
//   const gateway = initializeGateway(config);
//   const response = await gateway.invoke(messages);
//   // or: const response = await gateway.invoke(messages, { provider: "anthropic" });
// ============================================================

const { LLMProvider } = require("../config");
const { OpenAIAdapter, GoogleGenAIAdapter, AnthropicAdapter } = require("./adapters");

class LLMGateway {
  /**
   * @param {string} defaultProvider — e.g. "openai"
   */
  constructor(defaultProvider) {
    this.defaultProvider = defaultProvider;
    /** @type {Map<string, import("./adapters/base")>} */
    this._adapters = new Map();
  }

  // ----------------------------------------------------------
  //  Adapter registration
  // ----------------------------------------------------------

  /**
   * Register a provider adapter.
   * @param {string} provider
   * @param {import("./adapters/base")} adapter
   */
  registerAdapter(provider, adapter) {
    this._adapters.set(provider, adapter);
    console.log(`  ✔  Registered LLM adapter: ${provider}`);
  }

  /**
   * List registered provider names.
   * @returns {string[]}
   */
  get registeredProviders() {
    return [...this._adapters.keys()];
  }

  // ----------------------------------------------------------
  //  Client / adapter access
  // ----------------------------------------------------------

  /**
   * Get the adapter for a given provider (or default).
   * Equivalent to ADT's gateway.get_client().
   * @param {string} [provider]
   * @returns {import("./adapters/base")}
   */
  getClient(provider) {
    const key = provider || this.defaultProvider;
    const adapter = this._adapters.get(key);
    if (!adapter) {
      throw new Error(
        `No adapter registered for provider "${key}". ` +
        `Registered: [${this.registeredProviders.join(", ")}]`
      );
    }
    return adapter;
  }

  // ----------------------------------------------------------
  //  invoke / stream — delegate to the active adapter
  // ----------------------------------------------------------

  /**
   * Chat completion.
   * @param {import("./adapters/base").LLMMessage[]} messages
   * @param {Object} [options] — { provider, model, maxTokens, temperature }
   * @returns {Promise<import("./adapters/base").LLMResponse>}
   */
  async invoke(messages, options = {}) {
    const adapter = this.getClient(options.provider);
    return adapter.invoke(messages, options);
  }

  /**
   * Streaming chat completion — yields content chunks.
   * @param {import("./adapters/base").LLMMessage[]} messages
   * @param {Object} [options]
   * @returns {AsyncGenerator<string>}
   */
  async *stream(messages, options = {}) {
    const adapter = this.getClient(options.provider);
    yield* adapter.stream(messages, options);
  }
}

// ============================================================
//  Factory — mirrors ADT's initialize_gateway()
// ============================================================

/**
 * Create and register adapters for all supported providers.
 * @param {import("../config").config} appConfig
 * @returns {LLMGateway}
 */
function initializeGateway(appConfig) {
  const gateway = new LLMGateway(appConfig.defaultLlmProvider);

  console.log("\n🔌 Initializing LLM Gateway…");
  console.log(`   Default provider : ${appConfig.defaultLlmProvider}`);
  console.log(`   Default model    : ${appConfig.modelName}`);
  console.log(`   Supported        : [${appConfig.supportedLlmProviders.join(", ")}]\n`);

  for (const provider of appConfig.supportedLlmProviders) {
    try {
      switch (provider) {
        case LLMProvider.OPENAI:
          gateway.registerAdapter(
            LLMProvider.OPENAI,
            new OpenAIAdapter({
              apiKey: appConfig.openaiApiKey,
              baseUrl: appConfig.openaiBaseUrl,
              modelName: appConfig.modelName,
            })
          );
          break;

        case LLMProvider.GOOGLE_GENAI:
          gateway.registerAdapter(
            LLMProvider.GOOGLE_GENAI,
            new GoogleGenAIAdapter({
              apiKey: appConfig.googleApiKey,
              serviceAccountJson: appConfig.modelServiceAccountJson,
              projectId: appConfig.modelProjectId,
              location: appConfig.modelLocation,
              modelName: appConfig.modelName,
            })
          );
          break;

        case LLMProvider.ANTHROPIC:
          gateway.registerAdapter(
            LLMProvider.ANTHROPIC,
            new AnthropicAdapter({
              apiKey: appConfig.anthropicApiKey,
              modelName: appConfig.modelName,
            })
          );
          break;

        default:
          console.warn(`  ⚠  Unknown provider "${provider}" — skipping.`);
      }
    } catch (err) {
      console.error(`  ✘  Failed to register adapter for "${provider}":`, err.message);
    }
  }

  console.log(`\n   Registered adapters: [${gateway.registeredProviders.join(", ")}]\n`);
  return gateway;
}

module.exports = { LLMGateway, initializeGateway };
