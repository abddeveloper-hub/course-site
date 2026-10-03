// NEXVION AI ACADEMY - Futuristic Web Audio API Sound Synthesizer
// Zero external files, ultra-responsive, synthesized cyber sound FX

const SoundFX = {
  enabled: false,
  ctx: null,

  init: function () {
    const saved = localStorage.getItem("nexvion_sound_fx");
    this.enabled = saved === "true";
    this.updateUI();

    // Attach delegated listener for subtle click/tap sounds on interactive elements
    document.addEventListener(
      "click",
      (e) => {
        const target = e.target.closest(
          "button, .btn, .filter-chip, .filter-btn, .nav-logo, .mobile-nav-item a, .faq-item"
        );
        if (target && !target.classList.contains("no-sound")) {
          this.playClick();
        }
      },
      { passive: true }
    );
  },

  getContext: function () {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  },

  toggle: function () {
    this.enabled = !this.enabled;
    localStorage.setItem("nexvion_sound_fx", this.enabled ? "true" : "false");
    this.updateUI();

    if (this.enabled) {
      this.playSuccess();
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("Cyber Audio FX Enabled 🔊", "Interactive sci-fi UI acoustics are now active.", "success");
      }
    } else {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("Audio Muted 🔇", "UI acoustic feedback is muted.", "info");
      }
    }
  },

  updateUI: function () {
    const btns = document.querySelectorAll(".sound-toggle-btn, #navSoundToggleBtn, #mobileSoundToggleBtn");
    btns.forEach((btn) => {
      if (this.enabled) {
        btn.classList.add("sound-active");
        btn.innerHTML = `<i class="fas fa-volume-up" style="color:var(--neon-cyan);"></i> <span class="nav-btn-text">Audio ON</span>`;
        btn.title = "Audio FX Enabled (Click to Mute)";
      } else {
        btn.classList.remove("sound-active");
        btn.innerHTML = `<i class="fas fa-volume-mute" style="color:#94a3b8;"></i> <span class="nav-btn-text">Audio OFF</span>`;
        btn.title = "Audio FX Muted (Click to Enable)";
      }
    });
  },

  playClick: function () {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.035);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {}
  },

  playChime: function (baseFreq = 520) {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [baseFreq, baseFreq * 1.25, baseFreq * 1.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.04;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.03, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });
    } catch (e) {}
  },

  playSuccess: function () {
    this.playChime(640);
  },

  playModal: function () {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.15);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  },

  playMessage: function () {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {}
  },
};

// Initialize when ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => SoundFX.init());
} else {
  SoundFX.init();
}
