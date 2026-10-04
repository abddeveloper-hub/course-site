// NEXVION AI ACADEMY - Minimalist Executive Navbar Engine (Stripe / Vercel Architecture)
const ExecutiveNavbar = {
  init: function () {
    // Close popover on outside click
    document.addEventListener("click", (e) => {
      const popover = document.getElementById("execSettingsPopover");
      const btn = document.getElementById("navSettingsBtn");
      if (popover && popover.classList.contains("open")) {
        if (!popover.contains(e.target) && btn && !btn.contains(e.target)) {
          popover.classList.remove("open");
        }
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeSettingsPopover();
      }
    });

    // Scrolled header backdrop effect
    window.addEventListener("scroll", () => {
      const nav = document.querySelector(".exec-navbar");
      if (nav) {
        if (window.scrollY > 20) {
          nav.classList.add("scrolled");
        } else {
          nav.classList.remove("scrolled");
        }
      }
    }, { passive: true });

    this.syncSettingsUI();
  },

  toggleSettingsPopover: function (e) {
    if (e) e.stopPropagation();
    const popover = document.getElementById("execSettingsPopover");
    if (popover) {
      const isOpen = popover.classList.toggle("open");
      if (isOpen) {
        this.syncSettingsUI();
        if (typeof SoundFX !== "undefined" && SoundFX.playClick) {
          SoundFX.playClick();
        }
      }
    }
  },

  closeSettingsPopover: function () {
    const popover = document.getElementById("execSettingsPopover");
    if (popover) popover.classList.remove("open");
  },

  syncSettingsUI: function () {
    const isDark = document.documentElement.getAttribute("data-theme") === "obsidian-luxe" ||
                   document.documentElement.getAttribute("data-theme") === "dark";
    const themeText = document.getElementById("popoverThemeText");
    const themeIcon = document.getElementById("popoverThemeIcon");
    if (themeText) themeText.textContent = isDark ? "Light Mode" : "Luxe Dark";
    if (themeIcon) themeIcon.className = isDark ? "fas fa-sun" : "fas fa-moon";

    const audioText = document.getElementById("popoverAudioText");
    const audioIcon = document.getElementById("popoverAudioIcon");
    if (typeof SoundFX !== "undefined") {
      const isMuted = SoundFX.muted;
      if (audioText) audioText.textContent = isMuted ? "Sound: Off" : "Sound: On";
      if (audioIcon) audioIcon.className = isMuted ? "fas fa-volume-mute" : "fas fa-volume-up";
    }

    const currSelect = document.getElementById("popoverCurrencySelect");
    if (currSelect && typeof CurrencyManager !== "undefined") {
      currSelect.value = CurrencyManager.currentCurrency || "INR";
    }
  }
};

document.addEventListener("DOMContentLoaded", () => ExecutiveNavbar.init());
if (document.readyState === "complete" || document.readyState === "interactive") {
  ExecutiveNavbar.init();
}
