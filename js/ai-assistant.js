// NEXVION AI ACADEMY - Interactive AI Admissions & Curriculum Advisor Chatbot
// Sentinel AI - Instant intelligent answers, track guidance & 1-click enrollment routing

const AIAssistant = {
  isOpen: false,
  messages: [],
  isTyping: false,

  // Academy Knowledge Engine
  knowledgeBase: [
    {
      keywords: ["free", "free course", "zero cost", "scholarship", "open access", "no money", "grant", "free track"],
      reply:
        "Yes! NEXVION provides a **100% Free Open-Access Course: Generative AI Foundations & Prompt Engineering (AI-001)**. It features 2 weeks of interactive labs, prompt engineering masterclasses with ChatGPT 4o and Claude 3.7, and a verified Digital Certificate at zero cost—sponsored by the NEXVION Educational Foundation!",
      actionText: "Enroll In Free Course (₹0)",
      actionRoute: "ai-foundations-free",
    },
    {
      keywords: ["beginner", "non-coder", "coding", "no-code", "start", "prerequisite", "experience"],
      reply:
        "For non-programmers and beginners, **Track 1 (Vibe Coding & AI-Assisted App Development)** is specifically engineered for you! You'll master prompt-to-app tools like Cursor AI, Windsurf, Lovable, Bolt.new, and v0.dev to construct full-stack web applications using pure natural language—zero prior syntax required.",
      actionText: "Enroll In Track 1 (Vibe Coding)",
      actionRoute: "ai-beginners",
    },
    {
      keywords: ["track", "tracks", "course", "courses", "programs", "curriculum", "specialization", "tier"],
      reply:
        "NEXVION offers 4 progressive career specializations:\n\n• **Track 1 (Low Tier)**: Vibe Coding & AI App Development\n• **Track 2 (Mid Tier)**: Cloud Hosting, Deployment & Databases (Vercel, Supabase, Docker)\n• **Track 3 (High Tier)**: API Architecture & AI Engines (FastAPI, OpenAI, Gemini, Pinecone)\n• **Track 4 (Highest Tier)**: Autonomous Multi-Agent Swarms & MLOps (CrewAI, LangGraph, GPU Labs)\n\nWhich track aligns with your current goal?",
      actionText: "Explore All Tracks",
      actionRoute: "courses",
    },
    {
      keywords: ["certificate", "cert", "accreditation", "credential", "google", "verified", "diploma"],
      reply:
        "Yes! Every graduate earns an officially verifiable, cryptographic **Google-Grade Digital Certificate** and a permanent Student ID Pass with live QR verification. Certificates are signed by the Academic Research Dean upon faculty evaluation of your Capstone project.",
      actionText: "View Certificate Showcase",
      actionRoute: "certShowcaseSection",
    },
    {
      keywords: ["timing", "batch", "schedule", "cohort", "time", "weekend", "weekday", "hours", "miss"],
      reply:
        "Cohorts feature flexible options:\n\n• **Evening Live Labs**: 7:00 PM – 9:00 PM IST (Mon/Wed/Fri)\n• **Weekend Executive**: 10:00 AM – 2:00 PM IST (Sat/Sun)\n\nAll live sessions are recorded in 4K with lifetime archive access inside your Student Hub, so you never miss a lecture if your schedule changes!",
      actionText: "Choose Batch Timing",
      actionRoute: "register",
    },
    {
      keywords: ["agent", "crewai", "langgraph", "advanced", "highest", "mlops", "gpu", "h100"],
      reply:
        "Our flagship **Track 4 (Autonomous Agents & MLOps)** is built for software engineers and architects. You build multi-agent collaborative networks using CrewAI and LangGraph, deploy fine-tuned local models on NVIDIA H100 GPU clusters, and master Enterprise RAG architecture.",
      actionText: "Join Track 4 (Autonomous Agents)",
      actionRoute: "fullstack-ai-engineer",
    },
    {
      keywords: ["enroll", "register", "admission", "join", "apply", "step"],
      reply:
        "Admissions for the **Fall 2026 Cohort** are currently live! You can complete enrollment in 5 streamlined steps: Personal Profile → Track Selection → Batch Timing → Verification & Enrollment Confirmation.",
      actionText: "Launch 5-Step Enrollment",
      actionRoute: "register",
    },
    {
      keywords: ["contact", "email", "phone", "support", "human", "mentor", "whatsapp"],
      reply:
        "Our Admissions Office is available 24/7:\n\n• **Email**: abddeveloper@gmail.com\n• **Admissions Direct**: +91 9844691633\n• **Global Remote Labs Support**: +91 9061106019 / +91 9061106009",
      actionText: "Contact Admissions",
      actionRoute: "contact",
    },
  ],

  init: function () {
    this.renderWidget();
    this.setupListeners();
    // Default initial bot welcome
    this.messages = [
      {
        sender: "bot",
        text: "Greetings, scholar! I am **Sentinel AI**, your interactive admissions & curriculum advisor. How can I guide your AI journey today?",
        timestamp: this.getTimestamp(),
      },
    ];
  },

  getTimestamp: function () {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  },

  toggle: function () {
    this.isOpen = !this.isOpen;
    const panel = document.getElementById("aiChatPanel");
    const badge = document.getElementById("aiChatLauncherBadge");
    if (panel) {
      if (this.isOpen) {
        panel.classList.add("open");
        if (badge) badge.style.display = "none";
        if (typeof SoundFX !== "undefined") SoundFX.playModal();
        setTimeout(() => {
          const input = document.getElementById("aiChatInput");
          if (input) input.focus();
        }, 200);
      } else {
        panel.classList.remove("open");
        if (typeof SoundFX !== "undefined") SoundFX.playClick();
      }
    }
  },

  renderWidget: function () {
    // Check if already injected
    if (document.getElementById("aiChatWidgetWrap")) return;

    const div = document.createElement("div");
    div.id = "aiChatWidgetWrap";
    div.className = "ai-chat-widget-wrap";
    div.innerHTML = `
      <!-- Floating Trigger Button -->
      <button class="ai-chat-launcher-btn" id="aiChatLauncherBtn" onclick="AIAssistant.toggle()" title="Chat with Sentinel AI Advisor" aria-label="Open AI Admissions Chatbot">
        <div class="ai-launcher-icon-wrap">
          <i class="fas fa-robot"></i>
        </div>
        <span class="ai-launcher-label">Ask Sentinel AI</span>
        <span class="ai-launcher-pulse"></span>
        <span class="ai-launcher-badge" id="aiChatLauncherBadge">1</span>
      </button>

      <!-- Expandable Cyber Terminal Chat Window -->
      <div class="ai-chat-panel" id="aiChatPanel">
        <div class="ai-chat-header">
          <div style="display:flex; align-items:center; gap:12px;">
            <div class="ai-chat-avatar">
              <i class="fas fa-brain"></i>
              <span class="ai-status-dot"></span>
            </div>
            <div>
              <div class="ai-chat-title">NEXVION Sentinel AI</div>
              <div class="ai-chat-subtitle">Curriculum & Admissions Advisor</div>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="ai-chat-header-btn" onclick="AIAssistant.toggle()" title="Close Chat" aria-label="Close Chat">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div class="ai-chat-telemetry-banner">
          <span><i class="fas fa-circle" style="color:#10b981; font-size:0.55rem; margin-right:4px;"></i> ENGINE: GPT-5 & CLAUDE-3.7 SWARM // ONLINE</span>
        </div>

        <!-- Chat Stream -->
        <div class="ai-chat-messages" id="aiChatMessages">
          <!-- Messages dynamically rendered -->
        </div>

        <!-- Quick Question Chips -->
        <div class="ai-chat-chips" id="aiChatChips">
          <button class="ai-chip-btn" onclick="AIAssistant.handleChipClick('Which track is best for a beginner with zero coding?')">🌱 For Non-Coders</button>
          <button class="ai-chip-btn" onclick="AIAssistant.handleChipClick('What are the 4 course tracks?')">📚 4 AI Tracks</button>
          <button class="ai-chip-btn" onclick="AIAssistant.handleChipClick('How do cohort timings and recordings work?')">⏰ Cohort Timing</button>
          <button class="ai-chip-btn" onclick="AIAssistant.handleChipClick('Tell me about Google verified certifications')">🏆 Certifications</button>
          <button class="ai-chip-btn" onclick="AIAssistant.handleChipClick('How do I start enrollment?')">⚡ Enroll Now</button>
        </div>

        <!-- Input Bar -->
        <form class="ai-chat-input-bar" onsubmit="AIAssistant.handleSend(event)">
          <input type="text" id="aiChatInput" class="ai-chat-input" placeholder="Ask anything about curriculum, batches, or AI tracks..." autocomplete="off">
          <button type="submit" class="ai-chat-send-btn" title="Send message" aria-label="Send Message">
            <i class="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(div);
    this.renderMessages();
  },

  renderMessages: function () {
    const container = document.getElementById("aiChatMessages");
    if (!container) return;

    let html = "";
    this.messages.forEach((m) => {
      const isBot = m.sender === "bot";
      html += `
        <div class="ai-msg-row ${isBot ? "bot-row" : "user-row"}">
          ${
            isBot
              ? `
            <div class="ai-msg-avatar">
              <i class="fas fa-robot"></i>
            </div>
          `
              : ""
          }
          <div class="ai-msg-bubble ${isBot ? "bot-bubble" : "user-bubble"}">
            <div class="ai-msg-text">${this.formatMarkdown(m.text)}</div>
            ${
              m.actionText
                ? `
              <button class="ai-msg-action-btn" onclick="AIAssistant.handleAction('${m.actionRoute}')">
                <i class="fas fa-arrow-right"></i> ${m.actionText}
              </button>
            `
                : ""
            }
            <div class="ai-msg-time">${m.timestamp}</div>
          </div>
        </div>
      `;
    });

    if (this.isTyping) {
      html += `
        <div class="ai-msg-row bot-row">
          <div class="ai-msg-avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="ai-msg-bubble bot-bubble typing-bubble">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
  },

  formatMarkdown: function (text) {
    if (!text) return "";
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
    return escaped
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n•/g, "<br>&bull;")
      .replace(/\n/g, "<br>");
  },

  handleSend: function (e) {
    if (e) e.preventDefault();
    const input = document.getElementById("aiChatInput");
    if (!input) return;
    const text = input.value.trim();
    if (!text || this.isTyping) return;

    // Add user message
    this.messages.push({
      sender: "user",
      text: text,
      timestamp: this.getTimestamp(),
    });
    input.value = "";
    this.renderMessages();

    if (typeof SoundFX !== "undefined") SoundFX.playMessage();

    // Trigger AI response with realistic neural typing delay
    this.isTyping = true;
    this.renderMessages();

    setTimeout(() => {
      const response = this.findAnswer(text);
      this.isTyping = false;
      this.messages.push({
        sender: "bot",
        text: response.reply,
        actionText: response.actionText,
        actionRoute: response.actionRoute,
        timestamp: this.getTimestamp(),
      });
      this.renderMessages();
      if (typeof SoundFX !== "undefined") SoundFX.playMessage();
    }, 650);
  },

  handleChipClick: function (questionText) {
    const input = document.getElementById("aiChatInput");
    if (input) input.value = questionText;
    this.handleSend();
  },

  findAnswer: function (query) {
    const q = query.toLowerCase();
    for (let k of this.knowledgeBase) {
      for (let word of k.keywords) {
        if (q.includes(word)) {
          return k;
        }
      }
    }

    // Default intelligent fallback
    return {
      reply:
        "Thank you for reaching out! NEXVION AI ACADEMY offers 4 world-class AI specializations ranging from natural-language Vibe Coding to autonomous Multi-Agent swarms with Cloud GPU access. Would you like me to recommend a track or connect you with admissions?",
      actionText: "Start 5-Step Enrollment",
      actionRoute: "register",
    };
  },

  handleAction: function (route) {
    this.toggle(); // Close chat window
    if (typeof App === "undefined") return;

    if (
      ["ai-foundations-free", "ai-beginners", "applied-ml-ds", "genai-agents", "fullstack-ai-engineer"].includes(route)
    ) {
      App.startEnrollment(route);
    } else if (route === "certShowcaseSection") {
      const el = document.getElementById("certShowcaseSection");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (route === "courses") {
      App.showView("courses");
    } else if (route === "register") {
      App.showView("register");
    } else if (route === "contact") {
      window.location.href = "mailto:abddeveloper@gmail.com";
    }
  },

  setupListeners: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.toggle();
      }
    });
  },
};

// Auto-initialize when ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => AIAssistant.init());
} else {
  AIAssistant.init();
}
