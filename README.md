# 🎭 Reverse Akinator

A reverse Akinator game where **the AI knows the character** and **you** ask yes/no questions to figure out who it is!

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| **Node.js** | 18 or later | `node -v` |
| **npm** | 9 or later (ships with Node) | `npm -v` |
| **Git** | any recent | `git --version` |
| **LLM API key** | At least one of: OpenAI, Google Gemini, or Anthropic | — |

---

## Quick Start (new machine)

```bash
# 1. Clone the repository
git clone https://github.com/vasu-2004/Reverse-Akinator-Game.git
cd Reverse-Akinator-Game

# 2. Install dependencies
npm install

# 3. Create your .env from the template
#    Linux / macOS:
cp .env.example .env
#    Windows (cmd):
#    copy .env.example .env
#    Windows (PowerShell):
#    Copy-Item .env.example .env

# 4. Open .env and fill in your API key (at minimum OPENAI_API_KEY)

# 5. Start the server
npm start

# 6. Open http://localhost:3000 in your browser
```

### Development mode (auto-reload on changes)

```bash
npm run dev
```

---

## Environment Variables

All configuration lives in a single `.env` file.  
See [`.env.example`](.env.example) for the full template.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Server port |
| `DEFAULT_LLM_PROVIDER` | No | `openai` | `openai` \| `google_genai` \| `anthropic` |
| `MODEL_NAME` | No | `gpt-4o-mini` | Model to use for the chosen provider |
| `OPENAI_API_KEY` | If provider = openai | — | Your OpenAI API key |
| `OPENAI_BASE_URL` | No | `https://api.openai.com/v1` | Custom OpenAI-compatible endpoint |
| `GOOGLE_API_KEY` | If provider = google_genai | — | Google Gemini API key |
| `MODEL_PROJECT_ID` | If using Vertex AI | — | GCP project ID |
| `MODEL_LOCATION` | No | `us-central1` | GCP region |
| `MODEL_SERVICE_ACCOUNT_JSON` | If using Vertex AI | — | Service account JSON string |
| `ANTHROPIC_API_KEY` | If provider = anthropic | — | Your Anthropic API key |
| `LOG_LEVEL` | No | `INFO` | `INFO` or `DEBUG` |

---

## How to Play

1. 🎯 Click any mystery tab — each one hides a different character.
2. ❓ Ask yes/no questions to narrow down who it is.
3. 🧠 The AI answers: **Yes**, **No**, **Sometimes**, or **Partially**.
4. 💡 When you think you know, type the name and click **Guess**.
5. ⏳ You have a limited number of questions — use them wisely!

---

## Configuration

| Setting | Where | Options |
|---------|-------|---------|
| Difficulty | In-game UI | Easy (20), Medium (15), Hard (10) |
| LLM Model | `.env` → `MODEL_NAME` | Any chat model supported by your provider |
| API Provider | `.env` → `DEFAULT_LLM_PROVIDER` | `openai`, `google_genai`, `anthropic` |
| Server Port | `.env` → `PORT` | Default: 3000 |

The primary difficulty constant `N` is defined at the top of `public/app.js` and is also surfaced as an in-UI difficulty selector.

---

## Project Structure

```
Reverse-Akinator-Game/
├── server.js          # Express server & API routes
├── config.js          # Centralized env-var config
├── characters.js      # Character data (names, bios, aliases)
├── package.json       # Dependencies & scripts
├── .env.example       # Template for environment variables
├── .gitignore
├── llm/
│   ├── index.js       # Gateway initializer
│   ├── gateway.js     # LLMGateway facade
│   └── adapters/      # Provider-specific adapters
│       ├── openai.js
│       ├── google.js
│       └── anthropic.js
└── public/
    ├── index.html     # Game UI
    ├── app.js         # Client-side logic
    └── styles.css     # Styles
```

---

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** Vanilla HTML / CSS / JavaScript
- **LLM:** OpenAI / Google Gemini / Anthropic (multi-provider via Gateway pattern)
