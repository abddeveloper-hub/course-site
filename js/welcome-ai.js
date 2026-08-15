// AI Nexus Academy - Interactive Full-Screen AI Welcome Experience
// High-tech AI character greeting & portal unlock system (with White/Light Theme Support)

const AIWelcome = {
  soundEnabled: true,
  currentTheme: 'light', // Default to pristine White / Light Theme
  audioCtx: null,
  typingInterval: null,
  canvasAnimId: null,

  init: function() {
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('ai_welcome_theme') || 'light';
    this.applyTheme(savedTheme);

    this.initCanvasStarfield();
    this.startAIGreetingSequence();

    const overlay = document.getElementById('aiWelcomeIntroScreen');
    if (overlay && overlay.classList.contains('hidden')) {
      overlay.classList.remove('hidden');
    }
  },

  // Apply Theme (Light / Dark)
  applyTheme: function(theme) {
    this.currentTheme = theme;
    localStorage.setItem('ai_welcome_theme', theme);

    const overlay = document.getElementById('aiWelcomeIntroScreen');
    if (overlay) {
      if (theme === 'light') {
        overlay.classList.add('theme-light');
      } else {
        overlay.classList.remove('theme-light');
      }
    }

    const toggleBtn = document.getElementById('aiThemeToggleBtn');
    if (toggleBtn) {
      toggleBtn.innerHTML = theme === 'light'
        ? `<i class="fas fa-moon"></i>`
        : `<i class="fas fa-sun" style="color:#f59e0b;"></i>`;
      toggleBtn.title = theme === 'light' ? 'Switch to Dark Cyber Theme' : 'Switch to Pristine White Theme';
    }
  },

  // Toggle Theme between White/Light and Dark
  toggleTheme: function() {
    const nextTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(nextTheme);

    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast("Theme Changed", `AI Welcome switched to ${nextTheme === 'light' ? 'White Light' : 'Dark Cyber'} Theme.`, "info");
    }
  },

  // Synthesizer Web Audio API for futuristic AI vocal beeps & portal sound
  getAudioContext: function() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  },

  playAITextChime: function(freq = 440) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
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

  playPortalEnterSound: function() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Chord 1: Futuristic sci-fi shimmer
      [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);
        osc.frequency.exponentialRampToValueAtTime(f * 1.3, now + 0.6 + idx * 0.08);

        gain.gain.setValueAtTime(0.08, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8 + idx * 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + 0.9 + idx * 0.08);
      });
    } catch (e) {}
  },

  toggleSound: function() {
    this.soundEnabled = !this.soundEnabled;
    const btn = document.getElementById('aiSoundToggleBtn');
    if (btn) {
      btn.innerHTML = this.soundEnabled 
        ? `<i class="fas fa-volume-up"></i>` 
        : `<i class="fas fa-volume-mute" style="color:#ef4444;"></i>`;
    }
    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast("Audio Toggle", `AI voice synthesis ${this.soundEnabled ? 'enabled' : 'muted'}.`, "info");
    }
  },

  // Dynamic Typewriter Greeting
  startAIGreetingSequence: function() {
    const headingEl = document.getElementById('aiTypedGreeting');
    const subtextEl = document.getElementById('aiTypedMessage');
    const ctaWrap = document.getElementById('aiWelcomeCtaWrap');

    if (!headingEl || !subtextEl) return;

    headingEl.innerHTML = "";
    subtextEl.innerHTML = "";

    const headingText = "Hi there! 👋 I am Nexus AI";
    const subText = "Welcome to AI Nexus Academy! Step into the premier institution for Artificial Intelligence, Autonomous Agent Swarms, and production MLOps.";

    let hIndex = 0;
    if (this.typingInterval) clearInterval(this.typingInterval);

    // Type Heading
    this.typingInterval = setInterval(() => {
      if (hIndex < headingText.length) {
        headingEl.innerHTML = headingText.slice(0, hIndex + 1) + `<span style="color:#0284c7; animation:beaconPulse 0.5s infinite;">|</span>`;
        if (hIndex % 3 === 0) {
          this.playAITextChime(500 + (hIndex * 15));
        }
        hIndex++;
      } else {
        clearInterval(this.typingInterval);
        headingEl.innerHTML = `Hi there! 👋 I am <span class="highlight-name">Nexus AI</span>`;

        // Type Subtext after a short pause
        setTimeout(() => {
          this.typeSubtext(subText, subtextEl);
        }, 300);
      }
    }, 45);
  },

  typeSubtext: function(text, targetEl) {
    let sIndex = 0;
    const subInterval = setInterval(() => {
      if (sIndex < text.length) {
        targetEl.innerHTML = text.slice(0, sIndex + 1) + `<span style="color:#0284c7; animation:beaconPulse 0.5s infinite;">|</span>`;
        if (sIndex % 5 === 0) {
          this.playAITextChime(350 + (sIndex % 4) * 50);
        }
        sIndex++;
      } else {
        clearInterval(subInterval);
        targetEl.innerHTML = text;

        // Equalizer animation settle
        const eq = document.getElementById('aiEqualizerBars');
        if (eq) eq.style.opacity = '0.7';
      }
    }, 22);
  },

  // Enter Site Transition
  enterSite: function() {
    this.playPortalEnterSound();
    const overlay = document.getElementById('aiWelcomeIntroScreen');
    if (overlay) {
      overlay.classList.add('hidden');
    }

    // Immediately stop particle canvas loop to free 100% CPU/GPU on mobile
    if (this.canvasAnimId) {
      cancelAnimationFrame(this.canvasAnimId);
      this.canvasAnimId = null;
    }
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.typingInterval = null;
    }

    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast("Welcome to AI Nexus Academy! ✨", "Enjoy exploring our 4 AI course specializations and live labs.", "success");
    }
  },

  // Enter Site and immediately route to specific view
  enterSiteAndRoute: function(viewId) {
    this.enterSite();
    setTimeout(() => {
      if (typeof App !== 'undefined') {
        if (viewId === 'register') {
          App.startEnrollment('ai-beginners');
        } else {
          App.showView(viewId);
        }
      }
    }, 200);
  },

  // Replay AI Welcome Intro
  replayIntro: function() {
    const overlay = document.getElementById('aiWelcomeIntroScreen');
    if (overlay) {
      overlay.classList.remove('hidden');
      this.initCanvasStarfield();
      this.startAIGreetingSequence();
    }
  },

  // Starfield Particle Canvas Background (Theme-aware)
  initCanvasStarfield: function() {
    const canvas = document.getElementById('neuralMeshCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const numParticles = Math.min(65, Math.floor((width * height) / 16000));

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.5 + 0.3
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const isLight = this.currentTheme === 'light';

      // Draw particle nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isLight 
          ? `rgba(2, 132, 199, ${p.alpha * 0.7})` 
          : `rgba(56, 189, 248, ${p.alpha})`;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 125) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isLight
              ? `rgba(2, 132, 199, ${0.18 * (1 - dist / 125)})`
              : `rgba(2, 132, 199, ${0.25 * (1 - dist / 125)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      this.canvasAnimId = requestAnimationFrame(animate);
    };

    animate();
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  AIWelcome.init();
});
