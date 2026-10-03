// NEXVION AI ACADEMY - Interactive Full-Screen AI Welcome Experience
// High-tech AI character greeting & portal unlock system (Cyber Obsidian Black Theme)

const AIWelcome = {
  soundEnabled: false, // Voice & audio disabled per user instruction
  currentTheme: "dark", // Cyber Obsidian Black Theme
  audioCtx: null,
  typingInterval: null,
  canvasAnimId: null,

  init: function () {
    // Ensure speech synthesis is completely stopped
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    // Load saved theme or default to cyber dark
    const savedTheme = localStorage.getItem("ai_welcome_theme") || "dark";
    this.applyTheme(savedTheme);

    this.initCanvasStarfield();
    this.startAIGreetingSequence();
    this.initMouseTracking();
    this.initKeyboardShortcuts();

    const overlay = document.getElementById("aiWelcomeIntroScreen");
    if (overlay && overlay.classList.contains("hidden")) {
      overlay.classList.remove("hidden");
    }
  },

  // Mouse Tracking for Sentinel Pupil (Eyes track cursor in real time)
  initMouseTracking: function () {
    const pupil = document.getElementById("sentinelPupil");
    const sphere = document.getElementById("quantumCoreSphere");
    if (!pupil || !sphere) return;

    window.addEventListener(
      "mousemove",
      (e) => {
        const rect = sphere.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const dist = Math.hypot(deltaX, deltaY);

        // Max pupil travel radius inside ocular frame is 9px
        const maxRadius = 9;
        const angle = Math.atan2(deltaY, deltaX);
        const moveDist = Math.min(dist / 25, maxRadius);

        const offsetX = Math.cos(angle) * moveDist;
        const offsetY = Math.sin(angle) * moveDist;

        pupil.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      },
      { passive: true }
    );
  },

  // Auto-rotating Cyberpunk Terminal Diagnostic Logs
  initTerminalLogRotator: function () {
    const logEl = document.getElementById("gatewayTerminalLog");
    if (!logEl) return;

    const logs = [
      "INITIALIZING NEURAL CLUSTERS: 128x NVIDIA H100 GPU NODES READY // 4 CAREER TRACKS ONLINE",
      "ACTIVE MODELS: GPT-5, CLAUDE-3.7 & GEMINI-2.5 MULTI-AGENT SWARMS SYNCHRONIZED",
      "CREDENTIAL ENGINE: CRYPTOGRAPHIC GOOGLE CAREER ACCREDITATIONS ENGAGED",
      "FALL 2026 COHORT: ADMISSIONS OPEN // 1,420+ SCHOLARS CURRENTLY ENROLLED",
      "SYLLABUS ARCHITECTURE: VIBE CODING • DEPLOYMENT • ENGINE APIS • MLOPS READY",
    ];

    let currentLog = 0;
    setInterval(() => {
      currentLog = (currentLog + 1) % logs.length;
      logEl.style.opacity = "0";
      setTimeout(() => {
        logEl.textContent = logs[currentLog];
        logEl.style.opacity = "1";
        this.playAITextChime(520 + (currentLog % 3) * 60);
      }, 250);
    }, 3800);
  },

  // Instant Keyboard Bypass ([ESC], [SPACE], or [ENTER])
  initKeyboardShortcuts: function () {
    window.addEventListener("keydown", (e) => {
      const overlay = document.getElementById("aiWelcomeIntroScreen");
      if (!overlay || overlay.classList.contains("hidden") || this.isTransitioning) return;

      if (e.key === "Escape" || e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        this.enterSite();
      }
    });
  },

  // Portal Hover Sound Synthesizer
  initPortalSounds: function () {
    const cards = document.querySelectorAll(".gateway-portal-card");
    cards.forEach((card, idx) => {
      card.addEventListener("mouseenter", () => {
        this.playAITextChime(640 + idx * 120);
      });
    });
  },

  // Apply Theme (Always Obsidian Black by default)
  applyTheme: function (theme) {
    this.currentTheme = theme;
    localStorage.setItem("ai_welcome_theme", theme);

    const overlay = document.getElementById("aiWelcomeIntroScreen");
    if (overlay) {
      if (theme === "light") {
        overlay.classList.add("theme-light");
      } else {
        overlay.classList.remove("theme-light");
      }
    }

    const toggleBtn = document.getElementById("aiThemeToggleBtn");
    if (toggleBtn) {
      toggleBtn.innerHTML =
        theme === "light" ? `<i class="fas fa-moon"></i>` : `<i class="fas fa-sun" style="color:#f59e0b;"></i>`;
      toggleBtn.title = theme === "light" ? "Switch to Dark Cyber Theme" : "Switch to Light Theme";
    }
  },

  // Toggle Theme
  toggleTheme: function () {
    const nextTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(nextTheme);

    if (typeof App !== "undefined" && App.showToast) {
      App.showToast(
        "Theme Changed",
        `AI Welcome set to ${nextTheme === "light" ? "Light" : "Cyber Obsidian Black"} Theme.`,
        "info"
      );
    }
  },

  // Synthesizer Web Audio API for futuristic AI vocal beeps & portal sound
  getAudioContext: function () {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  },

  playAITextChime: function (freq = 440) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  },

  // Vocal Speech Synthesis is completely disabled
  speakVoiceGreeting: function (text) {
    // Disabled per user instruction
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  },

  playPortalEnterSound: function () {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = "sine";
      bassOsc.frequency.setValueAtTime(160, now);
      bassOsc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
      bassGain.gain.setValueAtTime(0.06, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.4);
    } catch (e) {}
  },

  toggleSound: function () {
    this.soundEnabled = !this.soundEnabled;
  },

  // Dynamic Greeting Sequence
  startAIGreetingSequence: function () {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  },

  // Enter Site Transition (Silky Smooth Motion Animation to Index Page)
  enterSite: function () {
    const overlay = document.getElementById("aiWelcomeIntroScreen");
    if (!overlay || overlay.classList.contains("hidden") || this.isTransitioning) return;

    this.isTransitioning = true;
    this.isWarping = true;
    this.playPortalEnterSound();

    // 1. Trigger graceful cinematic upward glide and iris light burst
    overlay.classList.add("portal-warping");

    // 2. Cascade reveal the index page
    setTimeout(() => {
      document.body.classList.add("portal-entering-active");
    }, 150);

    // 3. Complete hide of overlay and cleanup
    setTimeout(() => {
      overlay.classList.add("hidden");

      // Stop starfield animation and clean up canvas to release 100% GPU memory
      if (this.canvasAnimId) {
        cancelAnimationFrame(this.canvasAnimId);
        this.canvasAnimId = null;
      }
      if (this.typingInterval) {
        clearInterval(this.typingInterval);
        this.typingInterval = null;
      }
      const canvas = document.getElementById("neuralMeshCanvas");
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      this.isWarping = false;
    }, 600);

    // 4. Clean up active entrance cascade classes after animation completes
    setTimeout(() => {
      document.body.classList.remove("portal-entering-active");
      this.isTransitioning = false;

      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(
          "Welcome to NEXVION AI ACADEMY! ✨",
          "Enjoy exploring our 4 AI course specializations and live labs.",
          "success"
        );
      }
    }, 1600);
  },

  // Enter Site and immediately route to specific view
  enterSiteAndRoute: function (viewId) {
    this.enterSite();
    setTimeout(() => {
      if (typeof App !== "undefined") {
        if (viewId === "register") {
          App.startEnrollment("ai-beginners");
        } else {
          App.showView(viewId);
        }
      }
    }, 500);
  },

  // Replay AI Welcome Intro
  replayIntro: function () {
    const overlay = document.getElementById("aiWelcomeIntroScreen");
    if (overlay) {
      overlay.classList.remove("hidden");
      overlay.classList.remove("portal-warping");
      document.body.classList.remove("portal-entering-active");
      this.isTransitioning = false;
      this.isWarping = false;
      this.initCanvasStarfield();
      this.startAIGreetingSequence();
    }
  },

  // Starfield Particle Canvas Background (Theme-aware with Warp Speed - Ultra Optimized)
  initCanvasStarfield: function () {
    const canvas = document.getElementById("neuralMeshCanvas");
    if (!canvas) return;

    if (this.canvasAnimId) {
      cancelAnimationFrame(this.canvasAnimId);
      this.canvasAnimId = null;
    }

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let resizeTimer = null;
    window.addEventListener(
      "resize",
      () => {
        if (!canvas) return;
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
        }, 150);
      },
      { passive: true }
    );

    const particles = [];
    const isMobile = window.innerWidth <= 768;
    const maxP = isMobile ? 35 : 90;
    const numParticles = Math.min(maxP, Math.max(25, Math.floor((width * height) / 16000)));

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.4 + 1.2,
        alpha: Math.random() * 0.5 + 0.45,
      });
    }

    const maxDist = 130;
    const maxDistSq = maxDist * maxDist;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const isLight = this.currentTheme === "light";
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw particle nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (this.isWarping) {
          // Warp Speed Particle Acceleration
          const dx = p.x - centerX || 1;
          const dy = p.y - centerY || 1;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          p.x += (dx / dist) * 22;
          p.y += (dy / dist) * 22;

          // Draw warp light streak
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - (dx / dist) * 36, p.y - (dy / dist) * 36);
          ctx.strokeStyle = isLight ? `rgba(2, 132, 199, 0.85)` : `rgba(0, 240, 255, 0.9)`;
          ctx.lineWidth = p.radius * 1.5;
          ctx.stroke();
        } else {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = isLight ? `rgba(2, 132, 199, ${p.alpha * 0.7})` : `rgba(56, 189, 248, ${p.alpha})`;
          ctx.fill();

          // Connect nearby nodes using squared distance (zero square roots unless connected)
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistSq) {
              const dist = Math.sqrt(distSq);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = isLight
                ? `rgba(2, 132, 199, ${0.28 * (1 - dist / maxDist)})`
                : `rgba(0, 240, 255, ${0.45 * (1 - dist / maxDist)})`;
              ctx.lineWidth = 1.0;
              ctx.stroke();
            }
          }
        }
      }

      this.canvasAnimId = requestAnimationFrame(animate);
    };

    animate();
  },
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  AIWelcome.init();
});
