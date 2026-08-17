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

      // 1. Resonant Sub-Bass Energy Charge Sweep
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(160, now);
      bassOsc.frequency.exponentialRampToValueAtTime(880, now + 0.45);
      bassGain.gain.setValueAtTime(0.08, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.6);

      // 2. Futuristic Sci-Fi Harmonic Shimmer Chords
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.06);
        osc.frequency.exponentialRampToValueAtTime(f * 1.35, now + 0.5 + idx * 0.06);

        gain.gain.setValueAtTime(0.06, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75 + idx * 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + 0.85 + idx * 0.06);
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

    headingEl.innerHTML = '';
    subtextEl.innerHTML = '';
    if (ctaWrap) ctaWrap.style.opacity = '1';

    const greetingText = "Welcome to AI Nexus Academy.";
    const subtext = "Pioneering the Next Era of Pure Artificial Intelligence Education, Autonomous Agents, Neural Engineering & Global Accreditations.";

    let charIdx = 0;
    this.typingInterval = setInterval(() => {
      if (charIdx < greetingText.length) {
        headingEl.innerHTML = greetingText.slice(0, charIdx + 1) + `<span style="color:#00f0ff; animation:beaconPulse 0.6s infinite;">|</span>`;
        if (charIdx % 3 === 0) {
          this.playAITextChime(420 + (charIdx % 5) * 60);
        }
        charIdx++;
      } else {
        clearInterval(this.typingInterval);
        headingEl.innerHTML = greetingText;
        this.typewriterSubtext(subtext, subtextEl);
      }
    }, 38);
  },

  typewriterSubtext: function(text, targetEl) {
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

  // Enter Site Transition (Rich Multi-Stage Cinematic Warp)
  enterSite: function() {
    const overlay = document.getElementById('aiWelcomeIntroScreen');
    if (!overlay || overlay.classList.contains('hidden') || this.isTransitioning) return;

    this.isTransitioning = true;
    this.isWarping = true;
    this.playPortalEnterSound();

    // 1. Trigger energetic portal shockwave and entity overdrive
    overlay.classList.add('portal-warping');

    // 2. Warp-dissolve welcome overlay and trigger homepage entrance cascade
    setTimeout(() => {
      overlay.classList.add('hidden');
      document.body.classList.add('portal-entering-active');

      // Stop starfield animation and clean up canvas to release 100% GPU memory
      if (this.canvasAnimId) {
        cancelAnimationFrame(this.canvasAnimId);
        this.canvasAnimId = null;
      }
      if (this.typingInterval) {
        clearInterval(this.typingInterval);
        this.typingInterval = null;
      }
      const canvas = document.getElementById('neuralMeshCanvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      this.isWarping = false;
    }, 450);

    // 3. Clean up active entrance cascade classes after animation completes
    setTimeout(() => {
      document.body.classList.remove('portal-entering-active');
      this.isTransitioning = false;

      if (typeof App !== 'undefined' && App.showToast) {
        App.showToast("Welcome to AI Nexus Academy! ✨", "Enjoy exploring our 4 AI course specializations and live labs.", "success");
      }
    }, 1500);
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
    }, 500);
  },

  // Replay AI Welcome Intro
  replayIntro: function() {
    const overlay = document.getElementById('aiWelcomeIntroScreen');
    if (overlay) {
      overlay.classList.remove('hidden');
      overlay.classList.remove('portal-warping');
      document.body.classList.remove('portal-entering-active');
      this.isTransitioning = false;
      this.isWarping = false;
      this.initCanvasStarfield();
      this.startAIGreetingSequence();
    }
  },

  // Starfield Particle Canvas Background (Theme-aware with Warp Speed - Ultra Optimized)
  initCanvasStarfield: function() {
    const canvas = document.getElementById('neuralMeshCanvas');
    if (!canvas) return;

    if (this.canvasAnimId) {
      cancelAnimationFrame(this.canvasAnimId);
      this.canvasAnimId = null;
    }

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (!canvas) return;
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    }, { passive: true });

    const particles = [];
    const isMobile = window.innerWidth <= 768;
    const maxP = isMobile ? 14 : 42;
    const numParticles = Math.min(maxP, Math.max(8, Math.floor((width * height) / 26000)));

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.2 + 1.0,
        alpha: Math.random() * 0.4 + 0.3
      });
    }

    const maxDist = 110;
    const maxDistSq = maxDist * maxDist;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const isLight = this.currentTheme === 'light';
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
          ctx.fillStyle = isLight 
            ? `rgba(2, 132, 199, ${p.alpha * 0.7})` 
            : `rgba(56, 189, 248, ${p.alpha})`;
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
                ? `rgba(2, 132, 199, ${0.16 * (1 - dist / maxDist)})`
                : `rgba(2, 132, 199, ${0.22 * (1 - dist / maxDist)})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
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
