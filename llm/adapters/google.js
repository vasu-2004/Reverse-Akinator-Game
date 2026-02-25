// ============================================================
// Google Generative AI (Gemini) Adapter
// ============================================================
// Mirrors ADT's GoogleGenAIAdapter — supports two auth modes:
//
//   1. API key   → uses @google/generative-ai  (simple)
//   2. Service Account JSON + Project ID → uses @google-cloud/vertexai
//
// The llm_bridge.py reference does the same cascade via
// LangChain's ChatGoogleGenerativeAI, which internally picks
// the right auth path.  We replicate that logic here.
// ============================================================

const BaseLLMAdapter = require("./base");

class GoogleGenAIAdapter extends BaseLLMAdapter {
  /**
   * @param {Object} adapterConfig
   * @param {string} [adapterConfig.apiKey]               — GOOGLE_API_KEY
   * @param {string} [adapterConfig.serviceAccountJson]    — MODEL_SERVICE_ACCOUNT_JSON
   * @param {string} [adapterConfig.projectId]             — MODEL_PROJECT_ID
   * @param {string} [adapterConfig.location]              — MODEL_LOCATION
   * @param {string} [adapterConfig.modelName]
   */
  constructor({ apiKey, serviceAccountJson, projectId, location, modelName }) {
    super("google_genai");
    this.defaultModel = modelName || "gemini-2.0-flash";
    this._apiKey = (apiKey || "").trim();
    this._serviceAccountJson = (serviceAccountJson || "").trim();
    this._projectId = (projectId || "").trim();
    this._location = (location || "us-central1").trim();

    // Determine auth mode — mirrors ADT's GoogleGenAIAdapter:
    //   1. API key           → @google/generative-ai
    //   2. SA JSON + Project  → @google-cloud/vertexai with explicit creds
    //   3. Project ID only    → @google-cloud/vertexai with ADC (no keys needed on GCP)
    if (this._apiKey) {
      this._mode = "apikey";
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      this._genAI = new GoogleGenerativeAI(this._apiKey);
      console.log("     → Google GenAI adapter using API key auth");
    } else if (this._serviceAccountJson && this._projectId) {
      this._mode = "vertexai";
      const { VertexAI } = require("@google-cloud/vertexai");
      let credentials;
      try {
        credentials = typeof this._serviceAccountJson === "string"
          ? JSON.parse(this._serviceAccountJson)
          : this._serviceAccountJson;
      } catch (e) {
        throw new Error(`Failed to parse MODEL_SERVICE_ACCOUNT_JSON: ${e.message}`);
      }
      this._vertexAI = new VertexAI({
        project: this._projectId,
        location: this._location,
        googleAuthOptions: { credentials },
      });
      console.log(`     → Google GenAI adapter using Vertex AI + service account (project=${this._projectId}, location=${this._location})`);
    } else if (this._projectId) {
      // ADC mode — Application Default Credentials (no keys needed on GCP)
      // Mirrors ADT's google_genai.py: when only project_id is provided,
      // the SDK uses ADC from the environment (GCE metadata, Workload Identity,
      // or local `gcloud auth application-default login`).
      this._mode = "vertexai";
      const { VertexAI } = require("@google-cloud/vertexai");
      this._vertexAI = new VertexAI({
        project: this._projectId,
        location: this._location,
      });
      console.log(`     → Google GenAI adapter using Vertex AI + ADC (project=${this._projectId}, location=${this._location})`);
    } else {
      throw new Error(
        "GoogleGenAIAdapter requires GOOGLE_API_KEY, or MODEL_PROJECT_ID " +
        "(+ optional MODEL_SERVICE_ACCOUNT_JSON). On GCP, only MODEL_PROJECT_ID is needed."
      );
    }
  }

  // ==============================================================
  //  API Key mode — uses @google/generative-ai
  // ==============================================================

  /** Convert OpenAI-style messages to Gemini format (API key mode). */
  _convertMessagesApiKey(messages) {
    let systemInstruction = "";
    const history = [];

    for (const msg of messages) {
      if (msg.role === "system") {
        systemInstruction += (systemInstruction ? "\n" : "") + msg.content;
      } else {
        history.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }
    }
    return { systemInstruction, history };
  }

  async _invokeApiKey(messages, options) {
    const modelName = options.model || this.defaultModel;
    const { systemInstruction, history } = this._convertMessagesApiKey(messages);

    const model = this._genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction || undefined,
      generationConfig: {
        maxOutputTokens: options.maxTokens ?? 60,
        temperature: options.temperature ?? 0.1,
      },
    });

    const lastMsg = history.pop();
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMsg?.parts?.[0]?.text || "");
    const text = result.response.text();

    return {
      content: text.trim(),
      provider: this.provider,
      model: modelName,
      metadata: { usage: result.response.usageMetadata || {} },
    };
  }

  async *_streamApiKey(messages, options) {
    const modelName = options.model || this.defaultModel;
    const { systemInstruction, history } = this._convertMessagesApiKey(messages);

    const model = this._genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction || undefined,
      generationConfig: {
        maxOutputTokens: options.maxTokens ?? 256,
        temperature: options.temperature ?? 0.1,
      },
    });

    const lastMsg = history.pop();
    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMsg?.parts?.[0]?.text || "");
    for await (const chunk of result.stream) {
      const t = chunk.text();
      if (t) yield t;
    }
  }

  // ==============================================================
  //  Vertex AI mode — uses @google-cloud/vertexai + service account
  // ==============================================================

  /** Convert OpenAI-style messages to Vertex AI format. */
  _convertMessagesVertex(messages) {
    let systemInstruction = "";
    const history = [];

    for (const msg of messages) {
      if (msg.role === "system") {
        systemInstruction += (systemInstruction ? "\n" : "") + msg.content;
      } else {
        history.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }
    }
    return { systemInstruction, history };
  }

  async _invokeVertex(messages, options) {
    const modelName = options.model || this.defaultModel;
    const { systemInstruction, history } = this._convertMessagesVertex(messages);

    const model = this._vertexAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction
        ? { role: "system", parts: [{ text: systemInstruction }] }
        : undefined,
      generationConfig: {
        maxOutputTokens: options.maxTokens ?? 60,
        temperature: options.temperature ?? 0.1,
      },
    });

    const lastMsg = history.pop();
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMsg?.parts?.[0]?.text || "");

    // Vertex AI response structure
    const text =
      result.response?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("") || "";

    return {
      content: text.trim(),
      provider: this.provider,
      model: modelName,
      metadata: { usage: result.response?.usageMetadata || {} },
    };
  }

  async *_streamVertex(messages, options) {
    const modelName = options.model || this.defaultModel;
    const { systemInstruction, history } = this._convertMessagesVertex(messages);

    const model = this._vertexAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction
        ? { role: "system", parts: [{ text: systemInstruction }] }
        : undefined,
      generationConfig: {
        maxOutputTokens: options.maxTokens ?? 256,
        temperature: options.temperature ?? 0.1,
      },
    });

    const lastMsg = history.pop();
    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMsg?.parts?.[0]?.text || "");
    for await (const chunk of result.stream) {
      const t = chunk.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
      if (t) yield t;
    }
  }

  // ==============================================================
  //  Public interface — delegate based on auth mode
  // ==============================================================

  /** @override */
  async invoke(messages, options = {}) {
    return this._mode === "vertexai"
      ? this._invokeVertex(messages, options)
      : this._invokeApiKey(messages, options);
  }

  /** @override */
  async *stream(messages, options = {}) {
    yield* this._mode === "vertexai"
      ? this._streamVertex(messages, options)
      : this._streamApiKey(messages, options);
  }
}

module.exports = GoogleGenAIAdapter;
