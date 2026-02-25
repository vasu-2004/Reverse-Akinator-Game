# 🎭 Reverse Akinator

A reverse Akinator game where **the AI knows the character** and **you** ask yes/no questions to figure out who it is!

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create your `.env` file** (copy from the example):
   ```bash
   cp .env.example .env
   ```

3. **Add your OpenAI API key** to `.env`:
   ```
   OPENAI_API_KEY=sk-...
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

## How to Play

1. 🎯 Click any mystery tab — each one hides a different character.
2. ❓ Ask yes/no questions to narrow down who it is.
3. 🧠 The AI answers: **Yes**, **No**, **Sometimes**, or **Partially**.
4. 💡 When you think you know, type the name and click **Guess**.
5. ⏳ You have a limited number of questions — use them wisely!

## Configuration

| Setting | Where | Options |
|---------|-------|---------|
| Difficulty | In-game UI | Easy (20), Medium (15), Hard (10) |
| LLM Model | `.env` → `OPENAI_MODEL` | Any OpenAI-compatible chat model |
| API Provider | `.env` → `OPENAI_BASE_URL` | Any OpenAI-compatible endpoint |
| Server Port | `.env` → `PORT` | Default: 3000 |

The primary difficulty constant `N` is defined at the top of `public/app.js` and is also surfaced as an in-UI difficulty selector.

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** Vanilla HTML / CSS / JavaScript
- **LLM:** OpenAI-compatible chat completions API
