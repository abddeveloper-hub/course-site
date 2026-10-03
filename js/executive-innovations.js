// NEXVION AI ACADEMY - Executive Alabaster Innovation Engine
// Powers: 1. Command Palette (⌘K) | 2. Corporate & Career ROI Model | 3. Certificate Verifier
//         4. AI Track Diagnostic (60s) | 5. Obsidian Luxe Companion Mode | 6. Curriculum Deep-Dive Drawer

const ExecutiveInnovations = {
  activeCmdIndex: 0,
  diagnosticAnswers: {},

  init: function () {
    this.initHotkeys();
    this.initRoiCalculator();
    this.initObsidianLuxeState();
    console.log("🏛️ Executive Alabaster Innovations Engine online.");
  },

  // =========================================================================
  // 1. EXECUTIVE COMMAND PALETTE (⌘K / Ctrl+K)
  // =========================================================================
  cmdItems: [
    // Specializations
    {
      category: "Specialization Tracks",
      title: "Free Course: Generative AI Foundations & Prompt Engineering",
      icon: "fa-gift",
      badge: "100% Free",
      action: () => App.startEnrollment("ai-foundations-free"),
    },
    {
      category: "Specialization Tracks",
      title: "Track 1: Vibe Coding & AI Prototyping",
      icon: "fa-magic",
      badge: "Beginner",
      action: () => App.startEnrollment("ai-beginners"),
    },
    {
      category: "Specialization Tracks",
      title: "Track 2: Applied Machine Learning & MLOps",
      icon: "fa-cloud-upload-alt",
      badge: "Mid Tier",
      action: () => App.startEnrollment("applied-ml-ds"),
    },
    {
      category: "Specialization Tracks",
      title: "Track 3: Multi-Agent Swarms & Enterprise RAG",
      icon: "fa-network-wired",
      badge: "Advanced",
      action: () => App.startEnrollment("genai-agents"),
    },
    {
      category: "Specialization Tracks",
      title: "Track 4: Full-Stack AI Solutions Architect",
      icon: "fa-microchip",
      badge: "Executive",
      action: () => App.startEnrollment("fullstack-ai-engineer"),
    },

    // Executive Innovations
    {
      category: "Executive Tools",
      title: "Open Career & Corporate ROI Model",
      icon: "fa-calculator",
      badge: "Financials",
      action: () => ExecutiveInnovations.roiCalculator.openModal(),
    },
    {
      category: "Executive Tools",
      title: "Verify Cryptographic Certificate & QR",
      icon: "fa-certificate",
      badge: "LinkedIn",
      action: () => ExecutiveInnovations.certVerifier.openModal(),
    },
    {
      category: "Executive Tools",
      title: "Launch 60-Second Track Diagnostic",
      icon: "fa-compass",
      badge: "Advisory",
      action: () => ExecutiveInnovations.trackDiagnostic.openModal(),
    },
    {
      category: "Executive Tools",
      title: "Explore Full Curriculum & Lab Infrastructure",
      icon: "fa-layer-group",
      badge: "A100 Specs",
      action: () => ExecutiveInnovations.curriculumDrawer.open(),
    },
    {
      category: "Executive Tools",
      title: "Toggle Obsidian Luxe Dark / Alabaster Mode",
      icon: "fa-circle-half-stroke",
      badge: "Theme",
      action: () => ExecutiveInnovations.toggleObsidianLuxe(),
    },

    // Campus Navigation
    {
      category: "Campus Navigation",
      title: "Overview & Cohort Highlights",
      icon: "fa-home",
      badge: "Home",
      action: () => App.showView("home"),
    },
    {
      category: "Campus Navigation",
      title: "Student Hub & Digital ID Pass",
      icon: "fa-id-card",
      badge: "Pass",
      action: () => App.showView("student-hub"),
    },
    {
      category: "Campus Navigation",
      title: "Admissions CRM & Admin Console",
      icon: "fa-shield-alt",
      badge: "Faculty",
      action: () => window.open("admin.html", "_blank"),
    },
    {
      category: "Campus Navigation",
      title: "Interactive AI Study Hub & Playgrounds",
      icon: "fa-book-open",
      badge: "Sandbox",
      action: () => window.open("learn.html", "_blank"),
    },
    {
      category: "Campus Navigation",
      title: "Nexus AI Lab & Swarm Simulator",
      icon: "fa-flask",
      badge: "Lab",
      action: () => window.open("ai-lab.html", "_blank"),
    },
    {
      category: "Campus Navigation",
      title: "Merit Scholarship Quiz (Up to 35% Off)",
      icon: "fa-hand-holding-usd",
      badge: "Grant",
      action: () => FrontierTools.scholarship.openModal(),
    },

    // Palettes
    {
      category: "Executive Palettes",
      title: "Palette: Executive Alabaster (Obsidian Signature)",
      icon: "fa-gem",
      badge: "Default",
      action: () => ThemeManager.applyTheme("alabaster"),
    },
    {
      category: "Executive Palettes",
      title: "Palette: Alabaster Royal Cobalt",
      icon: "fa-shield-halved",
      badge: "Cobalt",
      action: () => ThemeManager.applyTheme("cobalt"),
    },
    {
      category: "Executive Palettes",
      title: "Palette: Alabaster Architectural Slate",
      icon: "fa-compass-drafting",
      badge: "Slate",
      action: () => ThemeManager.applyTheme("slate"),
    },
    {
      category: "Executive Palettes",
      title: "Palette: Alabaster Private Reserve",
      icon: "fa-landmark",
      badge: "Emerald",
      action: () => ThemeManager.applyTheme("emerald"),
    },
  ],

  initHotkeys: function () {
    window.addEventListener("keydown", (e) => {
      // ⌘K or Ctrl+K to open Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        ExecutiveInnovations.cmdPalette.toggle();
      }

      // Escape to close active modals/palette
      if (e.key === "Escape") {
        ExecutiveInnovations.cmdPalette.close();
        ExecutiveInnovations.curriculumDrawer.close();
        ExecutiveInnovations.roiCalculator.closeModal();
        ExecutiveInnovations.certVerifier.closeModal();
        ExecutiveInnovations.trackDiagnostic.closeModal();
      }

      // Keyboard navigation in command palette
      const palette = document.getElementById("execCmdPaletteBackdrop");
      if (palette && palette.classList.contains("open")) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          ExecutiveInnovations.cmdPalette.navigate(1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          ExecutiveInnovations.cmdPalette.navigate(-1);
        } else if (e.key === "Enter") {
          e.preventDefault();
          ExecutiveInnovations.cmdPalette.selectCurrent();
        }
      }
    });
  },

  cmdPalette: {
    isOpen: false,
    filteredItems: [],

    toggle: function () {
      if (this.isOpen) this.close();
      else this.open();
    },

    open: function () {
      const palette = document.getElementById("execCmdPaletteBackdrop");
      if (!palette) return;
      this.isOpen = true;
      palette.classList.add("open");
      const input = document.getElementById("execCmdInput");
      if (input) {
        input.value = "";
        input.focus();
      }
      this.filter("");
      if (typeof SoundFX !== "undefined") SoundFX.playClick();
    },

    close: function () {
      const palette = document.getElementById("execCmdPaletteBackdrop");
      if (!palette) return;
      this.isOpen = false;
      palette.classList.remove("open");
    },

    filter: function (query) {
      const q = (query || "").toLowerCase().trim();
      const all = ExecutiveInnovations.cmdItems;
      this.filteredItems = q
        ? all.filter(
            (it) =>
              it.title.toLowerCase().includes(q) ||
              it.category.toLowerCase().includes(q) ||
              it.badge.toLowerCase().includes(q)
          )
        : all;
      ExecutiveInnovations.activeCmdIndex = 0;
      this.render();
    },

    navigate: function (dir) {
      if (!this.filteredItems.length) return;
      ExecutiveInnovations.activeCmdIndex =
        (ExecutiveInnovations.activeCmdIndex + dir + this.filteredItems.length) % this.filteredItems.length;
      this.highlightItem();
    },

    highlightItem: function () {
      const items = document.querySelectorAll(".cmd-item");
      items.forEach((el, idx) => {
        if (idx === ExecutiveInnovations.activeCmdIndex) {
          el.classList.add("active");
          el.scrollIntoView({ block: "nearest" });
        } else {
          el.classList.remove("active");
        }
      });
    },

    selectCurrent: function () {
      const item = this.filteredItems[ExecutiveInnovations.activeCmdIndex];
      if (item && item.action) {
        this.close();
        item.action();
        if (typeof SoundFX !== "undefined") SoundFX.playChime(600);
      }
    },

    render: function () {
      const container = document.getElementById("execCmdResults");
      if (!container) return;

      if (!this.filteredItems.length) {
        container.innerHTML = `
          <div style="padding:32px 16px; text-align:center; color:var(--ink-muted);">
            <i class="fas fa-search" style="font-size:1.5rem; margin-bottom:8px; opacity:0.4;"></i>
            <p class="body-sm">No executive commands match your query.</p>
          </div>
        `;
        return;
      }

      let html = "";
      let lastCategory = "";
      this.filteredItems.forEach((item, index) => {
        if (item.category !== lastCategory) {
          lastCategory = item.category;
          html += `<div class="cmd-category-header">${lastCategory}</div>`;
        }
        const isActive = index === ExecutiveInnovations.activeCmdIndex ? "active" : "";
        html += `
          <div class="cmd-item ${isActive}" onclick="ExecutiveInnovations.cmdPalette.executeIndex(${index})">
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="cmd-item-icon"><i class="fas ${item.icon}"></i></div>
              <span class="cmd-item-title">${item.title}</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="cmd-badge">${item.badge}</span>
              <kbd class="cmd-key-hint">↵</kbd>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    },

    executeIndex: function (index) {
      ExecutiveInnovations.activeCmdIndex = index;
      this.selectCurrent();
    },
  },

  // =========================================================================
  // 2. EXECUTIVE CAREER & CORPORATE ROI FINANCIAL MODEL
  // =========================================================================
  initRoiCalculator: function () {
    this.roiCalculator.recalculate();
  },

  roiCalculator: {
    openModal: function () {
      const modal = document.getElementById("roiCalculatorModal");
      if (modal) modal.classList.add("open");
      this.recalculate();
    },

    closeModal: function () {
      const modal = document.getElementById("roiCalculatorModal");
      if (modal) modal.classList.remove("open");
    },

    recalculate: function () {
      const salaryInput = document.getElementById("roiSalaryInput");
      const hoursInput = document.getElementById("roiHoursInput");
      const teamInput = document.getElementById("roiTeamInput");

      const salary = salaryInput ? parseFloat(salaryInput.value) || 95000 : 95000;
      const hoursPerWeek = hoursInput ? parseFloat(hoursInput.value) || 16 : 16;
      const teamSize = teamInput ? parseFloat(teamInput.value) || 1 : 1;

      // Update slider visual label numbers
      const salaryLabel = document.getElementById("roiSalaryLabel");
      const hoursLabel = document.getElementById("roiHoursLabel");
      const teamLabel = document.getElementById("roiTeamLabel");

      if (salaryLabel) salaryLabel.textContent = `$${salary.toLocaleString()}`;
      if (hoursLabel) hoursLabel.textContent = `${hoursPerWeek} hrs/wk`;
      if (teamLabel) teamLabel.textContent = `${teamSize} ${teamSize === 1 ? "scholar" : "scholars"}`;

      // Calculations
      const hourlyRate = salary / 2000;
      const annualReclaimedHours = hoursPerWeek * 50 * teamSize;
      const productivityCapitalGain = Math.round(annualReclaimedHours * hourlyRate);
      const compensationMarketPremium = Math.round(salary * 0.28 * teamSize);
      const totalAnnualRoi = productivityCapitalGain + compensationMarketPremium;

      // Base Tuition average
      const tuitionFee = 599 * teamSize;
      const paybackHorizonMonths = Math.max(0.3, Math.min(12, tuitionFee / (totalAnnualRoi / 12))).toFixed(1);
      const roiMultiple = (totalAnnualRoi / tuitionFee).toFixed(1);

      // Render into metric display nodes
      const outHours = document.getElementById("roiOutputHours");
      const outTotal = document.getElementById("roiOutputTotal");
      const outPayback = document.getElementById("roiOutputPayback");
      const outMultiple = document.getElementById("roiOutputMultiple");

      if (outHours) outHours.textContent = `${annualReclaimedHours.toLocaleString()} hrs`;
      if (outTotal) outTotal.textContent = `+$${totalAnnualRoi.toLocaleString()}/yr`;
      if (outPayback) outPayback.textContent = `${paybackHorizonMonths} Months`;
      if (outMultiple) outMultiple.textContent = `${roiMultiple}x ROI`;
    },

    exportSummary: function () {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(
          "Financial Model Exported",
          "Executive ROI Brief generated in clipboard & PDF format.",
          "success"
        );
      }
      if (typeof SoundFX !== "undefined") SoundFX.playChime(750);
    },
  },

  // =========================================================================
  // 3. CRYPTOGRAPHIC CERTIFICATE & LINKEDIN VERIFIER
  // =========================================================================
  certVerifier: {
    currentCert: {
      hash: "SIG_SHA256: 9b2d87e04f028fa1609e9921c5fba609a8",
      scholar: "Alexandra Vance",
      track: "Multi-Agent Swarms & Enterprise RAG (AI-301)",
      credentialId: "NEX-2026-DIST-8841",
      issuedDate: "October 2026",
      dean: "Dr. Julian Vance, Director of Machine Intelligence",
      standing: "Dean's High Honors &bull; Top 2% Cohort Performance",
    },

    openModal: function () {
      const modal = document.getElementById("certVerifierModal");
      if (modal) modal.classList.add("open");
      this.verifyInput();
    },

    closeModal: function () {
      const modal = document.getElementById("certVerifierModal");
      if (modal) modal.classList.remove("open");
    },

    verifyInput: function () {
      const input = document.getElementById("certHashInput");
      const hash = input && input.value.trim() ? input.value.trim() : this.currentCert.credentialId;

      const elScholar = document.getElementById("certDisplayScholar");
      const elTrack = document.getElementById("certDisplayTrack");
      const elHash = document.getElementById("certDisplayHash");
      const elDate = document.getElementById("certDisplayDate");
      const elStanding = document.getElementById("certDisplayStanding");

      if (elScholar) elScholar.textContent = this.currentCert.scholar;
      if (elTrack) elTrack.textContent = this.currentCert.track;
      if (elHash) elHash.textContent = `CERT_ID: ${hash.toUpperCase()}`;
      if (elDate) elDate.textContent = `VERIFIED ON: ${this.currentCert.issuedDate.toUpperCase()}`;
      if (elStanding) elStanding.innerHTML = this.currentCert.standing;
    },

    addToLinkedIn: function () {
      const cert = this.currentCert;
      const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.track)}&organizationName=${encodeURIComponent("NEXVION AI ACADEMY")}&issueYear=2026&issueMonth=10&certUrl=${encodeURIComponent(window.location.origin + "/executive-alabaster.html#cert")}&certId=${encodeURIComponent(cert.credentialId)}`;
      window.open(url, "_blank");
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("LinkedIn Portal Opened", "Pre-filled credential ready for one-click addition.", "success");
      }
    },
  },

  // =========================================================================
  // 4. INTERACTIVE AI TRACK DIAGNOSTIC (60-SECOND MATCH)
  // =========================================================================
  trackDiagnostic: {
    currentStep: 1,

    openModal: function () {
      this.currentStep = 1;
      ExecutiveInnovations.diagnosticAnswers = {};
      const modal = document.getElementById("trackDiagnosticModal");
      if (modal) modal.classList.add("open");
      this.renderStep();
    },

    closeModal: function () {
      const modal = document.getElementById("trackDiagnosticModal");
      if (modal) modal.classList.remove("open");
    },

    selectOption: function (questionKey, optionValue) {
      ExecutiveInnovations.diagnosticAnswers[questionKey] = optionValue;
      this.currentStep++;
      if (typeof SoundFX !== "undefined") SoundFX.playClick();
      this.renderStep();
    },

    renderStep: function () {
      const body = document.getElementById("diagnosticStepBody");
      const progress = document.getElementById("diagnosticProgressText");
      if (!body) return;

      if (progress) progress.textContent = `Step ${Math.min(3, this.currentStep)} of 3`;

      if (this.currentStep === 1) {
        body.innerHTML = `
          <h3 class="headline-sm" style="margin-bottom:8px;">1. What is your primary career trajectory?</h3>
          <p class="body-sm" style="color:var(--ink-secondary); margin-bottom:20px;">We tailor cohort depth to your strategic responsibilities.</p>
          
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div class="diagnostic-option-card" onclick="ExecutiveInnovations.trackDiagnostic.selectOption('goal', 'agents')">
              <div class="diagnostic-option-title"><i class="fas fa-network-wired" style="color:var(--secondary);"></i> Architect Autonomous Multi-Agent Swarms</div>
              <div class="diagnostic-option-desc">Build production LangGraph agent workflows, vector embeddings, and self-correcting code loops.</div>
            </div>

            <div class="diagnostic-option-card" onclick="ExecutiveInnovations.trackDiagnostic.selectOption('goal', 'vibe')">
              <div class="diagnostic-option-title"><i class="fas fa-magic" style="color:var(--secondary);"></i> Vibe Coding & Rapid Prototype Prototyping</div>
              <div class="diagnostic-option-desc">Ship production software at 10x velocity using natural language and Cursor IDE automation.</div>
            </div>

            <div class="diagnostic-option-card" onclick="ExecutiveInnovations.trackDiagnostic.selectOption('goal', 'fullstack')">
              <div class="diagnostic-option-title"><i class="fas fa-microchip" style="color:var(--secondary);"></i> Full-Stack AI Engineering & Distributed MLOps</div>
              <div class="diagnostic-option-desc">Fine-tune Llama 3/DeepSeek, configure GPU clusters, and deploy enterprise AI infrastructure.</div>
            </div>
          </div>
        `;
      } else if (this.currentStep === 2) {
        body.innerHTML = `
          <h3 class="headline-sm" style="margin-bottom:8px;">2. What is your current engineering background?</h3>
          <p class="body-sm" style="color:var(--ink-secondary); margin-bottom:20px;">Ensures optimal pairing with dedicated faculty advisors.</p>
          
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div class="diagnostic-option-card" onclick="ExecutiveInnovations.trackDiagnostic.selectOption('exp', 'advanced')">
              <div class="diagnostic-option-title"><i class="fas fa-code" style="color:var(--secondary);"></i> Working Software Engineer / Architect</div>
              <div class="diagnostic-option-desc">Experienced with APIs, Python/TypeScript, databases, and microservices architecture.</div>
            </div>

            <div class="diagnostic-option-card" onclick="ExecutiveInnovations.trackDiagnostic.selectOption('exp', 'creator')">
              <div class="diagnostic-option-title"><i class="fas fa-lightbulb" style="color:var(--secondary);"></i> Product Leader, Founder or Business Strategist</div>
              <div class="diagnostic-option-desc">Focused on AI monetization, workflow automation, and managing technical AI teams.</div>
            </div>

            <div class="diagnostic-option-card" onclick="ExecutiveInnovations.trackDiagnostic.selectOption('exp', 'beginner')">
              <div class="diagnostic-option-title"><i class="fas fa-seedling" style="color:var(--secondary);"></i> Ambitious Beginner / Career Transitioner</div>
              <div class="diagnostic-option-desc">Seeking a disciplined, guided path from foundational AI principles to production apps.</div>
            </div>
          </div>
        `;
      } else if (this.currentStep === 3) {
        body.innerHTML = `
          <h3 class="headline-sm" style="margin-bottom:8px;">3. Preferred cohort cadence and weekly commitment:</h3>
          <p class="body-sm" style="color:var(--ink-secondary); margin-bottom:20px;">All live tracks provide 4K recordings and office hours.</p>
          
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div class="diagnostic-option-card" onclick="ExecutiveInnovations.trackDiagnostic.selectOption('cadence', 'accelerated')">
              <div class="diagnostic-option-title"><i class="fas fa-bolt" style="color:var(--secondary);"></i> Accelerated Intensive (15-20 hrs/wk)</div>
              <div class="diagnostic-option-desc">Fast-track completion in 4 weeks with daily hands-on lab sprints.</div>
            </div>

            <div class="diagnostic-option-card" onclick="ExecutiveInnovations.trackDiagnostic.selectOption('cadence', 'standard')">
              <div class="diagnostic-option-title"><i class="fas fa-calendar-check" style="color:var(--secondary);"></i> Executive Weekend Schedule (6-8 hrs/wk)</div>
              <div class="diagnostic-option-desc">Designed for working executives and busy engineering leads.</div>
            </div>
          </div>
        `;
      } else {
        // Results recommendation
        const answers = ExecutiveInnovations.diagnosticAnswers;
        let recommendedTrackId = "genai-agents";
        let trackName = "Track 3: Multi-Agent Swarms & Enterprise RAG";
        let matchScore = "98.4%";

        if (answers.goal === "vibe" || answers.exp === "beginner") {
          recommendedTrackId = "ai-beginners";
          trackName = "Track 1: Vibe Coding & AI Prompt Engineering";
          matchScore = "99.1%";
        } else if (answers.goal === "fullstack") {
          recommendedTrackId = "fullstack-ai-engineer";
          trackName = "Track 4: Full-Stack AI Engineer & Distributed MLOps";
          matchScore = "97.8%";
        }

        body.innerHTML = `
          <div style="text-align:center; padding:12px 0;">
            <div style="width:52px; height:52px; border-radius:50%; background:var(--success-bg); color:var(--success); display:flex; align-items:center; justify-content:center; font-size:1.4rem; margin:0 auto 14px auto;">
              <i class="fas fa-check-circle"></i>
            </div>
            <span class="badge badge-positive" style="margin-bottom:12px;">Curriculum Match: ${matchScore} Match</span>
            <h3 class="headline-sm" style="margin-bottom:8px; color:var(--ink-primary);">${trackName}</h3>
            <p class="body-sm" style="color:var(--ink-secondary); max-width:440px; margin:0 auto 20px auto;">
              Based on your strategic objectives, this specialization maximizes your career velocity with dedicated GPU quotas and faculty mentorship.
            </p>

            <div class="alabaster-well" style="margin-bottom:20px; text-align:left;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span class="label-sm" style="color:var(--ink-muted);">PRE-QUALIFIED TUITION FELLOWSHIP</span>
                <span class="badge badge-positive">30% Grant Approved</span>
              </div>
              <div class="mono-data" style="color:var(--secondary); font-size:14px; font-weight:700;">
                CODE: ALABASTER-EXEC-30
              </div>
            </div>

            <div style="display:flex; gap:10px; justify-content:center;">
              <button class="btn btn-secondary" onclick="ExecutiveInnovations.trackDiagnostic.closeModal()">Close</button>
              <button class="btn btn-primary" onclick="ExecutiveInnovations.trackDiagnostic.closeModal(); App.startEnrollment('${recommendedTrackId}');">
                Enroll with 30% Grant <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        `;
      }
    },
  },

  // =========================================================================
  // 5. OBSIDIAN LUXE COMPANION DARK MODE
  // =========================================================================
  initObsidianLuxeState: function () {
    const isObsidian = localStorage.getItem("nexvion_obsidian_luxe") === "true";
    if (isObsidian) {
      document.documentElement.setAttribute("data-theme", "obsidian-luxe");
    }
  },

  toggleObsidianLuxe: function () {
    const root = document.documentElement;
    const isCurrentlyDark = root.getAttribute("data-theme") === "obsidian-luxe";
    if (isCurrentlyDark) {
      root.removeAttribute("data-theme");
      localStorage.setItem("nexvion_obsidian_luxe", "false");
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("Executive Alabaster Active", "Pristine warm alabaster surface mode restored.", "info");
      }
    } else {
      root.setAttribute("data-theme", "obsidian-luxe");
      localStorage.setItem("nexvion_obsidian_luxe", "true");
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast(
          "Obsidian Luxe Active",
          "Architectural matte black mode with milled platinum hairlines.",
          "success"
        );
      }
    }
    if (typeof SoundFX !== "undefined") SoundFX.playChime(650);
  },

  // =========================================================================
  // 6. EXECUTIVE CURRICULUM & LAB INFRASTRUCTURE DRAWER
  // =========================================================================
  curriculumDrawer: {
    isOpen: false,
    currentTab: "modules",

    open: function () {
      const drawer = document.getElementById("execCurriculumDrawer");
      const overlay = document.getElementById("execCurriculumOverlay");
      if (!drawer) return;
      this.isOpen = true;
      if (overlay) overlay.classList.add("open");
      drawer.classList.add("open");
      this.render();
      if (typeof SoundFX !== "undefined") SoundFX.playClick();
    },

    close: function () {
      const drawer = document.getElementById("execCurriculumDrawer");
      const overlay = document.getElementById("execCurriculumOverlay");
      this.isOpen = false;
      if (drawer) drawer.classList.remove("open");
      if (overlay) overlay.classList.remove("open");
    },

    setTab: function (tab) {
      this.currentTab = tab;
      this.render();
    },

    render: function () {
      const content = document.getElementById("execCurriculumContent");
      if (!content) return;

      if (this.currentTab === "modules") {
        content.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:16px;">
            <div class="card card-body" style="padding:20px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span class="label-sm" style="color:var(--secondary);">WEEK 01 - 02</span>
                <span class="badge">Foundations</span>
              </div>
              <h4 class="headline-sm" style="margin-bottom:6px;">Frontier LLM Architectures & Prompt Topology</h4>
              <p class="body-sm" style="color:var(--ink-secondary); margin-bottom:12px;">Tokenization mechanics, attention counterbalances, structured JSON generation, and multi-turn reasoning chains.</p>
              <div class="mono-data" style="font-size:11px; color:var(--ink-muted);">LAB: Building Type-Safe Agent Output Parsers with Pydantic</div>
            </div>

            <div class="card card-body" style="padding:20px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span class="label-sm" style="color:var(--secondary);">WEEK 03 - 05</span>
                <span class="badge">Engineering</span>
              </div>
              <h4 class="headline-sm" style="margin-bottom:6px;">Multi-Agent Graph Orchestration (LangGraph)</h4>
              <p class="body-sm" style="color:var(--ink-secondary); margin-bottom:12px;">State machines for autonomous code reviews, recursive search reflection, and Human-in-the-Loop decision gates.</p>
              <div class="mono-data" style="font-size:11px; color:var(--ink-muted);">LAB: Deploying a Multi-Agent Automated Market Research Swarm</div>
            </div>

            <div class="card card-body" style="padding:20px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span class="label-sm" style="color:var(--secondary);">WEEK 06 - 08</span>
                <span class="badge">Enterprise</span>
              </div>
              <h4 class="headline-sm" style="margin-bottom:6px;">Production RAG Pipelines & Vector Hybrids</h4>
              <p class="body-sm" style="color:var(--ink-secondary); margin-bottom:12px;">Dense vs sparse embeddings, re-ranking models (Cohere Rerank 3), chunking algorithms, and latency caching.</p>
              <div class="mono-data" style="font-size:11px; color:var(--ink-muted);">LAB: Billion-Token Financial Document Vector Search with Pinecone</div>
            </div>

            <div class="card card-body" style="padding:20px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span class="label-sm" style="color:var(--secondary);">WEEK 09 - 12</span>
                <span class="badge">Capstone</span>
              </div>
              <h4 class="headline-sm" style="margin-bottom:6px;">Autonomous Capstone & Faculty Evaluation</h4>
              <p class="body-sm" style="color:var(--ink-secondary); margin-bottom:12px;">End-to-end deployment to dedicated Kubernetes GPU cluster with automated evaluation and credential issuance.</p>
              <div class="mono-data" style="font-size:11px; color:var(--ink-muted);">DELIVERABLE: Verifiable Google-Grade Accreditation Seal</div>
            </div>
          </div>
        `;
      } else {
        // Lab Infrastructure
        content.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:16px;">
            <div class="alabaster-well">
              <span class="label-sm" style="color:var(--ink-muted); display:block; margin-bottom:6px;">DEDICATED COMPUTE QUOTA</span>
              <div class="headline-sm" style="color:var(--ink-primary); margin-bottom:4px;">NVIDIA A100 Tensor Core Nodes (80GB VRAM)</div>
              <p class="body-sm" style="color:var(--ink-secondary);">Every enrolled scholar is provisioned a private container sandbox backed by high-throughput PCIe Gen4 interconnects.</p>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div class="card card-body" style="padding:16px;">
                <div class="label-sm" style="color:var(--ink-muted);">CONTEXT BUDGET</div>
                <div class="headline-sm" style="margin:4px 0;">2M Tokens</div>
                <div class="body-sm" style="color:var(--ink-secondary);">Gemini 1.5 Pro & Claude 3.7 Sonnet access included.</div>
              </div>

              <div class="card card-body" style="padding:16px;">
                <div class="label-sm" style="color:var(--ink-muted);">VECTOR CAPACITY</div>
                <div class="headline-sm" style="margin:4px 0;">10M Vectors</div>
                <div class="body-sm" style="color:var(--ink-secondary);">Dedicated Chroma & Pinecone enterprise indexes.</div>
              </div>
            </div>

            <div class="card card-body" style="padding:20px;">
              <h4 class="headline-sm" style="margin-bottom:8px;">Pre-Configured GitHub Repositories</h4>
              <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:13px; color:var(--ink-secondary);">
                <li><i class="fas fa-check" style="color:var(--success); margin-right:8px;"></i> Next.js 15 Full-Stack AI Starter Kit</li>
                <li><i class="fas fa-check" style="color:var(--success); margin-right:8px;"></i> LangGraph Multi-Agent Supervisor Pattern</li>
                <li><i class="fas fa-check" style="color:var(--success); margin-right:8px;"></i> FastAPI Docker Container for Model Serving</li>
              </ul>
            </div>
          </div>
        `;
      }
    },

    downloadPdf: function () {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("Syllabus PDF Generated", "Official Executive Curriculum PDF prepared for download.", "success");
      }
      if (typeof SoundFX !== "undefined") SoundFX.playChime(800);
    },
  },
};

// Auto-initialize when DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => ExecutiveInnovations.init());
} else {
  ExecutiveInnovations.init();
}
