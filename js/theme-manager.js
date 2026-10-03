// NEXVION AI ACADEMY - Executive Alabaster Design Engine
// Manages executive palettes, precision hairline tokens, and subtle kinetic 3D materials

const ThemeManager = {
  currentTheme: "alabaster",

  themes: {
    alabaster: {
      name: "Executive Alabaster (Signature Obsidian)",
      icon: "fa-gem",
      primary: "#09090b",
      secondary: "#0051d5",
      accent: "#2563eb",
      surface: "#f8f9fa",
      grad: "linear-gradient(135deg, #09090b 0%, #1e293b 100%)",
      glow: "0 1px 3px rgba(15, 23, 42, 0.04)",
      hexPrimary: 0x09090b,
      hexSecondary: 0x0051d5,
      hexAccent: 0x2563eb,
    },
    cobalt: {
      name: "Alabaster Royal Cobalt",
      icon: "fa-shield-halved",
      primary: "#0051d5",
      secondary: "#2563eb",
      accent: "#09090b",
      surface: "#f8f9fa",
      grad: "linear-gradient(135deg, #0051d5 0%, #2563eb 100%)",
      glow: "0 1px 3px rgba(0, 81, 213, 0.08)",
      hexPrimary: 0x0051d5,
      hexSecondary: 0x2563eb,
      hexAccent: 0x09090b,
    },
    slate: {
      name: "Alabaster Architectural Slate",
      icon: "fa-compass-drafting",
      primary: "#334155",
      secondary: "#09090b",
      accent: "#475569",
      surface: "#f8f9fa",
      grad: "linear-gradient(135deg, #334155 0%, #475569 100%)",
      glow: "0 1px 3px rgba(15, 23, 42, 0.04)",
      hexPrimary: 0x334155,
      hexSecondary: 0x09090b,
      hexAccent: 0x475569,
    },
    emerald: {
      name: "Alabaster Private Reserve",
      icon: "fa-landmark",
      primary: "#059669",
      secondary: "#10b981",
      accent: "#09090b",
      surface: "#f8f9fa",
      grad: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
      glow: "0 1px 3px rgba(16, 185, 129, 0.08)",
      hexPrimary: 0x059669,
      hexSecondary: 0x10b981,
      hexAccent: 0x09090b,
    },
  },

  init: function () {
    let saved = localStorage.getItem("nexvion_active_theme");
    // If user has old obsolete cyber themes (cyan, matrix, solar, magenta), reset to alabaster
    if (!saved || !this.themes[saved]) {
      saved = "alabaster";
    }
    this.applyTheme(saved, false);
    this.renderDropdown();

    // Close dropdown on outside click
    document.addEventListener("click", (e) => {
      const dropdown = document.getElementById("themeDropdownMenu");
      const btn = document.getElementById("navThemeToggleBtn");
      if (dropdown && !dropdown.contains(e.target) && btn && !btn.contains(e.target)) {
        dropdown.classList.remove("open");
      }
    });
  },

  toggleMenu: function (e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById("themeDropdownMenu");
    if (dropdown) {
      dropdown.classList.toggle("open");
      if (typeof SoundFX !== "undefined") SoundFX.playClick();
    }
  },

  applyTheme: function (themeKey, notify = true) {
    if (!this.themes[themeKey]) themeKey = "alabaster";
    this.currentTheme = themeKey;
    localStorage.setItem("nexvion_active_theme", themeKey);
    const theme = this.themes[themeKey];

    const root = document.documentElement;
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--obsidian", theme.primary);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--cobalt-royal", theme.secondary);
    root.style.setProperty("--grad-primary", theme.grad);
    root.style.setProperty("--neon-cyan", theme.secondary);
    root.style.setProperty("--neon-violet", theme.primary);
    root.style.setProperty("--border-glow", `${theme.secondary}22`);

    // Synchronize Three.js architectural figure materials
    if (typeof ThreeBackground !== "undefined" && ThreeBackground.setThemeColors) {
      ThreeBackground.setThemeColors(theme);
    }

    // Update active state in UI
    document.querySelectorAll(".theme-option-item").forEach((el) => {
      if (el.dataset.theme === themeKey) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });

    const activeDot = document.getElementById("navThemeActiveDot");
    if (activeDot) {
      activeDot.style.background = theme.primary;
      activeDot.style.boxShadow = `0 0 6px ${theme.secondary}44`;
    }

    const dropdown = document.getElementById("themeDropdownMenu");
    if (dropdown) dropdown.classList.remove("open");

    if (notify && typeof App !== "undefined" && App.showToast) {
      App.showToast(`Executive Palette: ${theme.name}`, `Applied architectural color balance.`, "success");
      if (typeof SoundFX !== "undefined") SoundFX.playChime(700);
    }
  },

  renderDropdown: function () {
    const container = document.getElementById("themeDropdownMenu");
    if (!container) return;

    let html = `
      <div class="theme-dropdown-header">
        <i class="fas fa-palette" style="color:var(--secondary);"></i>
        <span>Executive Alabaster Themes</span>
      </div>
      <div class="theme-options-grid">
    `;

    Object.keys(this.themes).forEach((key) => {
      const t = this.themes[key];
      const isActive = this.currentTheme === key ? "active" : "";
      html += `
        <button class="theme-option-item ${isActive}" data-theme="${key}" onclick="ThemeManager.applyTheme('${key}', true)">
          <span class="theme-color-swatch" style="background:${t.grad};"></span>
          <span class="theme-label">${t.name}</span>
          ${isActive ? '<i class="fas fa-check theme-check"></i>' : ""}
        </button>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  },
};

// Initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => ThemeManager.init());
} else {
  ThemeManager.init();
}
