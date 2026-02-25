// ============================================================
// REVERSE AKINATOR — Frontend Game Logic
// ============================================================

// ---- PRIMARY DIFFICULTY DIAL ----
// Change N to adjust the maximum number of valid yes/no
// questions allowed per game.  Lower = harder.
//
//   Easy   = 20
//   Medium = 15   ← default
//   Hard   = 10
//
const DIFFICULTIES = { easy: 20, medium: 15, hard: 10 };

// ---- SECONDARY HYPERPARAMETER ----
// Questions deducted for each wrong guess (0 = no penalty).
const WRONG_GUESS_PENALTY = 1;

// ============================================================
//  STATE
// ============================================================
let characters = [];      // metadata from server (no names / bios)
let activeTab = -1;       // currently open tab (-1 = none)
let difficulty = "medium";
let N = DIFFICULTIES[difficulty];

// Per-tab game state — keyed by tab index
// { messages[], llmMessages[], questionCount, guessCount, gameOver, won, revealed }
const tabStates = {};

// ============================================================
//  DOM REFERENCES
// ============================================================
const $tabBar        = document.getElementById("tabBar");
const $welcomeScreen = document.getElementById("welcomeScreen");
const $chatInterface = document.getElementById("chatInterface");
const $chatMessages  = document.getElementById("chatMessages");
const $questionCount = document.getElementById("questionCount");
const $questionMax   = document.getElementById("questionMax");
const $progressBar   = document.getElementById("progressBar");
const $userInput     = document.getElementById("userInput");
const $btnAsk        = document.getElementById("btnAsk");
const $btnGuess      = document.getElementById("btnGuess");
const $gameOverOvl   = document.getElementById("gameOverOverlay");
const $gameOverCard  = document.getElementById("gameOverCard");
const $inputArea     = document.getElementById("inputArea");
const $confetti      = document.getElementById("confettiCanvas");

// ============================================================
//  INIT
// ============================================================
document.addEventListener("DOMContentLoaded", init);

async function init() {
  await loadCharacters();
  renderTabs();
  setupEventListeners();
  updateDifficultyUI();
}

// ============================================================
//  API HELPERS
// ============================================================
async function loadCharacters() {
  try {
    const res = await fetch("/api/characters");
    characters = await res.json();
  } catch {
    characters = [];
    console.error("Failed to load characters.");
  }
}

async function apiChat(tabIndex, messages) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tabIndex, messages }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "API error");
  }
  return res.json();
}

async function apiGuess(tabIndex, guess) {
  const res = await fetch("/api/guess", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tabIndex, guess }),
  });
  if (!res.ok) throw new Error("Guess API error");
  return res.json();
}

// ============================================================
//  TABS — render & switch
// ============================================================
function renderTabs() {
  $tabBar.innerHTML = "";
  characters.forEach((ch, i) => {
    const tab = document.createElement("button");
    tab.className = "tab";
    tab.style.setProperty("--tab-color", ch.color);
    // Extract RGB for box-shadow (approximation via hex→rgb)
    tab.style.setProperty("--tab-color-rgb", hexToRgb(ch.color));
    tab.dataset.index = i;
    tab.innerHTML = `
      <span class="tab-icon">${ch.icon}</span>
      <span class="tab-label">${ch.label}</span>
      <span class="tab-number">${i + 1}</span>
    `;
    tab.addEventListener("click", () => switchTab(i));
    $tabBar.appendChild(tab);
  });
}

function switchTab(index) {
  if (index === activeTab) return;
  activeTab = index;

  // Highlight active tab
  document.querySelectorAll(".tab").forEach((t, i) => {
    t.classList.toggle("active", i === index);
  });

  // Ensure a state object exists for this tab
  if (!tabStates[index]) {
    tabStates[index] = {
      messages: [],      // display messages [{role, text, cls}]
      llmMessages: [],   // messages sent to the LLM [{role, content}]
      questionCount: 0,
      guessCount: 0,
      gameOver: false,
      won: false,
      revealed: null,    // character name once revealed
    };
    // Welcome system message
    addSystemMessage(index, `🎭 A new mystery awaits! You have ${N} questions. Good luck!`);
  }

  // Show chat UI
  $welcomeScreen.classList.add("hidden");
  $chatInterface.classList.remove("hidden");

  render();
}

// ============================================================
//  RENDER
// ============================================================
function render() {
  const state = getState();
  if (!state) return;

  // Messages
  $chatMessages.innerHTML = "";
  state.messages.forEach((m) => {
    const div = document.createElement("div");
    div.className = `message ${m.cls}`;
    div.textContent = m.text;
    $chatMessages.appendChild(div);
  });
  scrollToBottom();

  // Counter
  $questionCount.textContent = state.questionCount;
  $questionMax.textContent = N;

  // Progress bar
  const pct = Math.max(0, ((N - state.questionCount) / N) * 100);
  $progressBar.style.width = pct + "%";
  $progressBar.classList.remove("low", "critical");
  if (pct <= 20) $progressBar.classList.add("critical");
  else if (pct <= 40) $progressBar.classList.add("low");

  // Game-over overlay
  if (state.gameOver) {
    showGameOver(state);
    setInputEnabled(false);
  } else {
    $gameOverOvl.classList.add("hidden");
    setInputEnabled(true);
  }

  // Update tab badge (won / lost)
  document.querySelectorAll(".tab").forEach((t, i) => {
    const s = tabStates[i];
    t.classList.remove("tab-won", "tab-lost");
    if (s && s.gameOver && s.won)  t.classList.add("tab-won");
    if (s && s.gameOver && !s.won) t.classList.add("tab-lost");
  });
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    $chatMessages.scrollTop = $chatMessages.scrollHeight;
  });
}

// ============================================================
//  MESSAGES — helpers to push into state
// ============================================================
function addUserMsg(index, text) {
  tabStates[index].messages.push({ role: "user", text, cls: "user" });
}
function addGuessMsg(index, text) {
  tabStates[index].messages.push({ role: "user", text: `🎯 Guess: ${text}`, cls: "guess" });
}
function addAIMsg(index, text, answerClass = "") {
  tabStates[index].messages.push({ role: "ai", text, cls: `ai ${answerClass}`.trim() });
}
function addGuessResult(index, text, correct) {
  tabStates[index].messages.push({
    role: "ai",
    text,
    cls: `guess-result ${correct ? "correct" : "wrong"}`,
  });
}
function addSystemMessage(index, text) {
  tabStates[index].messages.push({ role: "system", text, cls: "system" });
}

// Show a temporary loading indicator
function showLoading(index) {
  tabStates[index].messages.push({
    role: "ai",
    text: "",
    cls: "ai loading",
  });
  render();
}
function removeLoading(index) {
  const msgs = tabStates[index].messages;
  const lastIdx = msgs.findLastIndex((m) => m.cls.includes("loading"));
  if (lastIdx !== -1) msgs.splice(lastIdx, 1);
}

// ============================================================
//  GAME ACTIONS
// ============================================================
async function handleAsk() {
  const state = getState();
  if (!state || state.gameOver) return;

  const text = $userInput.value.trim();
  if (!text) return;
  $userInput.value = "";

  addUserMsg(activeTab, text);

  // Add to LLM history
  state.llmMessages.push({ role: "user", content: text });

  // Show loading
  showLoading(activeTab);
  setInputEnabled(false);

  try {
    const data = await apiChat(activeTab, state.llmMessages);

    removeLoading(activeTab);

    // Determine answer class
    const ansClass = classifyAnswer(data.response);
    addAIMsg(activeTab, data.response, ansClass);

    // Add assistant reply to LLM history
    state.llmMessages.push({ role: "assistant", content: data.response });

    // Only count valid yes/no answers
    if (data.isValid) {
      state.questionCount++;
      if (state.questionCount >= N) {
        state.gameOver = true;
        state.won = false;
        addSystemMessage(activeTab, "⏰ You've used all your questions!");
      }
    }
  } catch (err) {
    removeLoading(activeTab);
    addSystemMessage(activeTab, `⚠️ ${err.message}`);
  }

  setInputEnabled(true);
  render();
  $userInput.focus();
}

async function handleGuess() {
  const state = getState();
  if (!state || state.gameOver) return;

  const text = $userInput.value.trim();
  if (!text) return;
  $userInput.value = "";

  addGuessMsg(activeTab, text);
  setInputEnabled(false);

  try {
    const data = await apiGuess(activeTab, text);
    state.guessCount++;

    if (data.correct) {
      state.gameOver = true;
      state.won = true;
      state.revealed = data.characterName;
      addGuessResult(activeTab, `✅ Correct! It's ${data.characterName}!`, true);
      launchConfetti();
    } else {
      addGuessResult(activeTab, "❌ Wrong guess! Try again.", false);
      // Penalty
      if (WRONG_GUESS_PENALTY > 0) {
        state.questionCount += WRONG_GUESS_PENALTY;
        addSystemMessage(
          activeTab,
          `⚠️ Wrong guess costs ${WRONG_GUESS_PENALTY} question${WRONG_GUESS_PENALTY > 1 ? "s" : ""}. (${N - state.questionCount} remaining)`
        );
        if (state.questionCount >= N) {
          state.gameOver = true;
          state.won = false;
          addSystemMessage(activeTab, "⏰ You've used all your questions!");
        }
      }
    }
  } catch (err) {
    addSystemMessage(activeTab, `⚠️ ${err.message}`);
  }

  setInputEnabled(true);
  render();
  $userInput.focus();
}

function handleReplay() {
  if (activeTab < 0) return;
  tabStates[activeTab] = null; // reset
  switchTab(activeTab);        // re-init
}

// ============================================================
//  GAME OVER DISPLAY
// ============================================================
function showGameOver(state) {
  $gameOverOvl.classList.remove("hidden");
  const won = state.won;
  const name = state.revealed || "???";

  $gameOverCard.className = `game-over-card ${won ? "won" : "lost"}`;
  $gameOverCard.innerHTML = `
    <div class="go-icon">${won ? "🎉" : "😢"}</div>
    <h2>${won ? "YOU GOT IT!" : "GAME OVER"}</h2>
    <div class="go-character">${won ? name : `It was: ${name}`}</div>
    <div class="go-stats">
      Questions used: ${state.questionCount} / ${N}<br/>
      Guesses made: ${state.guessCount}
    </div>
    <button class="btn-replay" id="btnReplay">Play Again 🔄</button>
  `;

  // Fetch and reveal the character if lost (need server to tell us)
  if (!won && !state.revealed) {
    revealCharacter(activeTab, state);
  }

  // Attach replay handler
  document.getElementById("btnReplay")?.addEventListener("click", handleReplay);
}

async function revealCharacter(tabIndex, state) {
  try {
    const res = await fetch(`/api/reveal?tab=${tabIndex}`);
    if (res.ok) {
      const data = await res.json();
      state.revealed = data.characterName;
      render();
    }
  } catch {
    // Silently fail — the overlay already shows "???"
  }
}

// ============================================================
//  INPUT STATE
// ============================================================
function setInputEnabled(enabled) {
  $userInput.disabled = !enabled;
  $btnAsk.disabled = !enabled;
  $btnGuess.disabled = !enabled;
}

// ============================================================
//  EVENT LISTENERS
// ============================================================
function setupEventListeners() {
  $btnAsk.addEventListener("click", handleAsk);
  $btnGuess.addEventListener("click", handleGuess);

  $userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      handleGuess();
    }
  });

  // Difficulty buttons
  document.querySelectorAll(".diff-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      difficulty = btn.dataset.diff;
      N = DIFFICULTIES[difficulty];
      updateDifficultyUI();
      // Update display if a tab is active
      if (activeTab >= 0) render();
    });
  });
}

function updateDifficultyUI() {
  document.querySelectorAll(".diff-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.diff === difficulty);
  });
  $questionMax.textContent = N;
}

// ============================================================
//  HELPERS
// ============================================================
function getState() {
  return tabStates[activeTab] || null;
}

function classifyAnswer(text) {
  const t = text.toLowerCase().trim();
  if (t.startsWith("yes"))        return "answer-yes";
  if (t.startsWith("no"))         return "answer-no";
  if (t.startsWith("sometimes"))  return "answer-sometimes";
  if (t.startsWith("partially"))  return "answer-partially";
  if (t.startsWith("invalid"))    return "answer-invalid";
  return "";
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

// ============================================================
//  CONFETTI  🎊
// ============================================================
function launchConfetti() {
  const canvas = $confetti;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = [
    "#ff2d75", "#00f5d4", "#fee440", "#a855f7",
    "#3b82f6", "#34d399", "#f59e0b", "#ef4444",
  ];
  const NUM = 150;
  const particles = [];

  for (let i = 0; i < NUM; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vy: Math.random() * 3 + 2,
      vx: (Math.random() - 0.5) * 2,
      rot: Math.random() * 360,
      rv: (Math.random() - 0.5) * 10,
      opacity: 1,
    });
  }

  let frame = 0;
  const MAX_FRAMES = 180; // ~3 seconds at 60 fps

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rv;
      if (frame > MAX_FRAMES - 40) p.opacity -= 0.025;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (frame < MAX_FRAMES) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  draw();
}
