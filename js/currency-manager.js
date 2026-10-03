// NEXVION AI ACADEMY - Global Multi-Currency & Purchasing Power Engine
// Synchronizes localized currency symbols, live exchange rates, and enrollment pricing

const CurrencyManager = {
  currentCurrency: "INR",

  currencies: {
    INR: {
      code: "INR",
      symbol: "₹",
      name: "Indian Rupee",
      rate: 1.0,
      flag: "🇮🇳",
      locale: "en-IN",
      popular: true,
    },
    USD: {
      code: "USD",
      symbol: "$",
      name: "US Dollar",
      rate: 0.012, // approx 1 USD = 83.3 INR
      flag: "🇺🇸",
      locale: "en-US",
      popular: true,
    },
    EUR: {
      code: "EUR",
      symbol: "€",
      name: "Euro",
      rate: 0.011, // approx 1 EUR = 90.9 INR
      flag: "🇪🇺",
      locale: "de-DE",
      popular: true,
    },
    GBP: {
      code: "GBP",
      symbol: "£",
      name: "British Pound",
      rate: 0.0094,
      flag: "🇬🇧",
      locale: "en-GB",
      popular: true,
    },
    AED: {
      code: "AED",
      symbol: "AED ",
      name: "UAE Dirham",
      rate: 0.044,
      flag: "🇦🇪",
      locale: "en-AE",
      popular: false,
    },
    CAD: {
      code: "CAD",
      symbol: "CA$",
      name: "Canadian Dollar",
      rate: 0.016,
      flag: "🇨🇦",
      locale: "en-CA",
      popular: false,
    },
  },

  init: function () {
    const saved = localStorage.getItem("nexvion_currency");
    if (saved && this.currencies[saved]) {
      this.currentCurrency = saved;
    }
    this.renderSelectors();
  },

  setCurrency: function (code) {
    if (!this.currencies[code]) return;
    this.currentCurrency = code;
    localStorage.setItem("nexvion_currency", code);
    this.renderSelectors();

    // Trigger UI updates across components
    if (typeof App !== "undefined" && App.renderCourseShowcase) {
      App.renderCourseShowcase();
    }
    if (typeof Wizard !== "undefined" && Wizard.renderCourseSelection) {
      Wizard.renderCourseSelection();
      if (Wizard.currentStep === 4) {
        Wizard.renderSummary();
      }
    }

    // Play subtle audio if available
    if (typeof SoundFX !== "undefined" && SoundFX.playClick) {
      SoundFX.playClick();
    }

    if (typeof App !== "undefined" && App.showToast) {
      const c = this.currencies[code];
      App.showToast(
        `Currency: ${c.name} (${c.symbol})`,
        `Tuition rates updated using global purchasing parity.`,
        "info"
      );
    }
  },

  convert: function (inrAmount) {
    const curr = this.currencies[this.currentCurrency] || this.currencies.INR;
    if (curr.code === "INR") return inrAmount;
    // Round to clean, appealing numbers
    const raw = inrAmount * curr.rate;
    if (raw < 50) return Math.round(raw);
    if (raw < 500) return Math.round(raw / 5) * 5;
    return Math.round(raw / 10) * 10;
  },

  format: function (inrAmount) {
    if (inrAmount === 0) return "Free";
    const curr = this.currencies[this.currentCurrency] || this.currencies.INR;
    const converted = this.convert(inrAmount);
    return `${curr.symbol}${converted.toLocaleString(curr.locale)}`;
  },

  renderSelectors: function () {
    const dropdowns = document.querySelectorAll(".currency-selector-dropdown");
    dropdowns.forEach((select) => {
      select.innerHTML = Object.values(this.currencies)
        .map(
          (c) => `
        <option value="${c.code}" ${c.code === this.currentCurrency ? "selected" : ""}>
          ${c.flag} ${c.code} (${c.symbol})
        </option>
      `
        )
        .join("");
    });

    // Update any label display
    const labelEls = document.querySelectorAll(".current-currency-label");
    labelEls.forEach((el) => {
      const c = this.currencies[this.currentCurrency];
      el.innerHTML = `${c.flag} ${c.code}`;
    });
  },
};

// Auto-initialize when script loads
if (typeof window !== "undefined") {
  window.CurrencyManager = CurrencyManager;
}
