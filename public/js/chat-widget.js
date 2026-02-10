// Anthropic Support Chat Widget
(async function () {
  const AGENT_BASE = "http://localhost:3001";
  const AGENT_URL = `${AGENT_BASE}/api/chat`;

  // Only render widget if the agent server is running
  try {
    const health = await fetch(`${AGENT_BASE}/api/health`);
    if (!health.ok) return;
  } catch {
    return;
  }

  // ── Inject styles ───────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    .chat-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #d97757;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(217, 119, 87, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      z-index: 10000;
    }
    .chat-fab:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 24px rgba(217, 119, 87, 0.5);
    }
    .chat-fab svg {
      width: 26px;
      height: 26px;
      fill: white;
    }

    .chat-window {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 380px;
      height: 520px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .chat-window.open {
      display: flex;
    }

    .chat-header {
      background: #131314;
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .chat-header-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      font-weight: 600;
    }
    .chat-header-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4ade80;
    }
    .chat-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      opacity: 0.7;
      transition: opacity 0.15s;
    }
    .chat-close:hover { opacity: 1; }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #faf9f0;
    }

    .chat-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
    }
    .chat-msg a {
      color: #d97757;
      text-decoration: underline;
    }
    .chat-msg.user {
      align-self: flex-end;
      background: #d97757;
      color: white;
      border-bottom-right-radius: 4px;
    }
    .chat-msg.agent {
      align-self: flex-start;
      background: #ffffff;
      color: #1a1a1b;
      border: 1px solid #e5e4db;
      border-bottom-left-radius: 4px;
    }

    .chat-typing {
      align-self: flex-start;
      padding: 10px 14px;
      background: #ffffff;
      border: 1px solid #e5e4db;
      border-radius: 12px;
      border-bottom-left-radius: 4px;
      display: none;
    }
    .chat-typing.visible { display: flex; gap: 4px; }
    .chat-typing-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #8a8a8a;
      animation: typing-bounce 1.2s infinite;
    }
    .chat-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .chat-typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }

    .chat-input-area {
      padding: 12px 16px;
      border-top: 1px solid #e5e4db;
      display: flex;
      gap: 8px;
      background: #ffffff;
      flex-shrink: 0;
    }
    .chat-input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #e5e4db;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.15s;
      background: #faf9f0;
    }
    .chat-input:focus { border-color: #d97757; }
    .chat-input::placeholder { color: #8a8a8a; }
    .chat-send {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: #d97757;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    .chat-send:hover { background: #c66a4d; }
    .chat-send:disabled { background: #e5e4db; cursor: default; }
    .chat-send svg { width: 18px; height: 18px; fill: white; }
  `;
  document.head.appendChild(style);

  // ── Create DOM ──────────────────────────────────────────────────
  const fab = document.createElement("button");
  fab.className = "chat-fab";
  fab.setAttribute("aria-label", "Open support chat");
  fab.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>`;

  const win = document.createElement("div");
  win.className = "chat-window";
  win.innerHTML = `
    <div class="chat-header">
      <div class="chat-header-title">
        <span class="chat-header-dot"></span>
        Anthropic Support
      </div>
      <button class="chat-close" aria-label="Close chat">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
    <div class="chat-messages">
      <div class="chat-msg agent">Hi! I'm the Anthropic support agent. I can help you find articles, learn about our products, or navigate the site. What can I help with?</div>
      <div class="chat-typing">
        <div class="chat-typing-dot"></div>
        <div class="chat-typing-dot"></div>
        <div class="chat-typing-dot"></div>
      </div>
    </div>
    <div class="chat-input-area">
      <input class="chat-input" type="text" placeholder="Ask a question..." />
      <button class="chat-send" aria-label="Send message">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(win);

  // ── Elements ────────────────────────────────────────────────────
  const messages = win.querySelector(".chat-messages");
  const typing = win.querySelector(".chat-typing");
  const input = win.querySelector(".chat-input");
  const sendBtn = win.querySelector(".chat-send");
  const closeBtn = win.querySelector(".chat-close");

  const history = [];

  // ── Toggle ──────────────────────────────────────────────────────
  fab.addEventListener("click", () => {
    win.classList.add("open");
    fab.style.display = "none";
    input.focus();
  });

  closeBtn.addEventListener("click", () => {
    win.classList.remove("open");
    fab.style.display = "flex";
  });

  // ── Send message ────────────────────────────────────────────────
  async function send() {
    const text = input.value.trim();
    if (!text) return;

    // Add user message
    addMessage(text, "user");
    history.push({ role: "user", content: text });
    input.value = "";
    sendBtn.disabled = true;
    typing.classList.add("visible");
    scrollToBottom();

    try {
      const res = await fetch(AGENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      const reply = data.response || data.error || "Something went wrong.";

      typing.classList.remove("visible");
      addMessage(reply, "agent");
      history.push({ role: "agent", content: reply });
    } catch {
      typing.classList.remove("visible");
      addMessage(
        "Couldn't reach the support agent. Make sure it's running with npm run agent.",
        "agent",
      );
    }

    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  function addMessage(text, role) {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${role}`;
    // Convert markdown-style links [text](url) to HTML
    msg.innerHTML = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_top">$1</a>')
      .replace(/\n/g, "<br>");
    messages.insertBefore(msg, typing);
    scrollToBottom();
  }

  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }
})();
