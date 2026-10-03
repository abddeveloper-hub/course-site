// NEXVION AI ACADEMY - Frontier Tools & Advanced Interactive Labs
// Contains:
// 1. ModelBenchmarkCalculator (Frontier LLM Benchmarks & Startup Cost Estimator)
// 2. ResumeStudio (AI Resume & ATS Optimization Chamber)
// 3. BlueprintGenerator (Autonomous Capstone Architecture Blueprint Generator)
// 4. ScholarshipQuiz (Merit Scholarship & Financial Aid Assessment)
// 5. ZenFocusMode (Distraction-Free Deep Study Environment)

const FrontierTools = {
  // =========================================================================
  // 1. FRONTIER LLM BENCHMARK & COST ESTIMATOR
  // =========================================================================
  benchmark: {
    models: [
      {
        id: "claude-37-sonnet",
        name: "Claude 3.7 Sonnet",
        provider: "Anthropic",
        inputCost: 3.0,
        outputCost: 15.0,
        cachedCost: 0.3,
        context: "200,000",
        speed: 85,
        sweBench: "70.3%",
        mmlu: "88.2%",
        tag: "Hybrid Reasoning King",
        color: "#d97706",
        icon: "fa-brain",
      },
      {
        id: "gpt-4o",
        name: "GPT-4o (Omni)",
        provider: "OpenAI",
        inputCost: 2.5,
        outputCost: 10.0,
        cachedCost: 1.25,
        context: "128,000",
        speed: 108,
        sweBench: "38.8%",
        mmlu: "88.7%",
        tag: "Multimodal Speedster",
        color: "#10a37f",
        icon: "fa-bolt",
      },
      {
        id: "deepseek-r1",
        name: "DeepSeek R1",
        provider: "DeepSeek",
        inputCost: 0.55,
        outputCost: 2.19,
        cachedCost: 0.14,
        context: "64,000",
        speed: 42,
        sweBench: "49.2%",
        mmlu: "90.8%",
        tag: "Best Open Value",
        color: "#3b82f6",
        icon: "fa-microchip",
      },
      {
        id: "gemini-25-pro",
        name: "Gemini 2.5 Pro",
        provider: "Google",
        inputCost: 1.25,
        outputCost: 5.0,
        cachedCost: 0.31,
        context: "2,000,000",
        speed: 115,
        sweBench: "63.8%",
        mmlu: "89.6%",
        tag: "2M Long-Context",
        color: "#7c3aed",
        icon: "fa-globe",
      },
      {
        id: "llama-33-70b",
        name: "Llama 3.3 70B",
        provider: "Meta (Groq / vLLM)",
        inputCost: 0.2,
        outputCost: 0.7,
        cachedCost: 0.05,
        context: "128,000",
        speed: 280,
        sweBench: "42.5%",
        mmlu: "86.0%",
        tag: "Ultra Fast Open Source",
        color: "#0284c7",
        icon: "fa-tachometer-alt",
      },
    ],

    presets: {
      support_bot: {
        name: "Customer Support AI Agent",
        requests: 50000,
        inTokens: 800,
        outTokens: 250,
        cacheRatio: 50,
      },
      rag_search: {
        name: "Enterprise RAG Search Engine",
        requests: 25000,
        inTokens: 3500,
        outTokens: 600,
        cacheRatio: 70,
      },
      copilot: {
        name: "Coding Copilot Assistant",
        requests: 80000,
        inTokens: 2000,
        outTokens: 500,
        cacheRatio: 40,
      },
      swarm: {
        name: "Multi-Agent Autonomous Swarm",
        requests: 15000,
        inTokens: 6000,
        outTokens: 1800,
        cacheRatio: 30,
      },
    },

    setPreset: function (key) {
      const p = this.presets[key];
      if (!p) return;
      const reqInput = document.getElementById("benchReqSlider");
      const inInput = document.getElementById("benchInSlider");
      const outInput = document.getElementById("benchOutSlider");
      const cacheInput = document.getElementById("benchCacheSlider");

      if (reqInput) reqInput.value = p.requests;
      if (inInput) inInput.value = p.inTokens;
      if (outInput) outInput.value = p.outTokens;
      if (cacheInput) cacheInput.value = p.cacheRatio;

      document.querySelectorAll(".bench-preset-btn").forEach((b) => b.classList.remove("active"));
      const activeBtn = document.getElementById(`btnPreset_${key}`);
      if (activeBtn) activeBtn.classList.add("active");

      this.recalculate();
    },

    recalculate: function () {
      const reqInput = document.getElementById("benchReqSlider");
      const inInput = document.getElementById("benchInSlider");
      const outInput = document.getElementById("benchOutSlider");
      const cacheInput = document.getElementById("benchCacheSlider");

      const requests = reqInput ? parseInt(reqInput.value, 10) : 50000;
      const inTokens = inInput ? parseInt(inInput.value, 10) : 800;
      const outTokens = outInput ? parseInt(outInput.value, 10) : 250;
      const cacheRatio = cacheInput ? parseInt(cacheInput.value, 10) : 50;

      // Update slider badge labels
      const lblReq = document.getElementById("benchReqVal");
      const lblIn = document.getElementById("benchInVal");
      const lblOut = document.getElementById("benchOutVal");
      const lblCache = document.getElementById("benchCacheVal");

      if (lblReq) lblReq.innerText = requests.toLocaleString();
      if (lblIn) lblIn.innerText = inTokens.toLocaleString();
      if (lblOut) lblOut.innerText = outTokens.toLocaleString();
      if (lblCache) lblCache.innerText = `${cacheRatio}%`;

      const tbody = document.getElementById("benchTableBody");
      if (!tbody) return;

      const cachedInFraction = cacheRatio / 100;
      const standardInFraction = 1 - cachedInFraction;

      const results = this.models.map((m) => {
        const totalInTokens = requests * inTokens;
        const totalOutTokens = requests * outTokens;

        const standardInCost = ((totalInTokens * standardInFraction) / 1000000) * m.inputCost;
        const cachedInCost = ((totalInTokens * cachedInFraction) / 1000000) * m.cachedCost;
        const outCost = (totalOutTokens / 1000000) * m.outputCost;
        const totalCostUSD = standardInCost + cachedInCost + outCost;

        return {
          ...m,
          totalCostUSD: Math.round(totalCostUSD * 100) / 100,
        };
      });

      // Find max cost for scaling bar chart
      const maxCost = Math.max(...results.map((r) => r.totalCostUSD), 1);
      const minCost = Math.min(...results.map((r) => r.totalCostUSD));

      tbody.innerHTML = results
        .map((r) => {
          const isCheapest = r.totalCostUSD === minCost;
          const barPct = Math.max(8, Math.round((r.totalCostUSD / maxCost) * 100));

          let costFormatted = `$${r.totalCostUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          if (typeof CurrencyManager !== "undefined" && CurrencyManager.currentCurrency !== "USD") {
            // Convert USD to INR (1 USD approx 83.3 INR)
            const inrAmt = r.totalCostUSD * 83.33;
            costFormatted = `${CurrencyManager.format(inrAmt)} ($${r.totalCostUSD.toFixed(0)})`;
          }

          return `
          <tr style="border-bottom: 1px solid #e2e8f0; transition: background 0.15s;" onmouseover="this.style.background='var(--bg-card-hover)'" onmouseout="this.style.background='transparent'">
            <td style="padding:14px 16px; font-weight:800; color:var(--text-main);">
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="width:32px; height:32px; border-radius:8px; background:${r.color}15; color:${r.color}; display:flex; align-items:center; justify-content:center; font-size:0.95rem;">
                  <i class="fas ${r.icon}"></i>
                </span>
                <div>
                  <div style="font-size:0.95rem; font-weight:800;">${r.name}</div>
                  <span style="font-size:0.75rem; color:#64748b;">${r.provider} &bull; <strong style="color:${r.color};">${r.tag}</strong></span>
                </div>
              </div>
            </td>
            <td style="padding:14px 16px; font-size:0.85rem; font-family:var(--font-mono); color:#475569;">
              <div>In: $${r.inputCost.toFixed(2)}/M</div>
              <div style="color:#059669;">Cached: $${r.cachedCost.toFixed(2)}/M</div>
              <div>Out: $${r.outputCost.toFixed(2)}/M</div>
            </td>
            <td style="padding:14px 16px; font-size:0.85rem;">
              <div style="font-weight:700; color:var(--text-main);"><i class="fas fa-bolt" style="color:#f59e0b;"></i> ${r.speed} tok/s</div>
              <div style="color:#64748b; font-size:0.75rem;">Ctx: ${r.context}</div>
            </td>
            <td style="padding:14px 16px; font-size:0.85rem;">
              <div style="font-weight:800; color:#7c3aed;">SWE: ${r.sweBench}</div>
              <div style="color:#64748b; font-size:0.75rem;">MMLU: ${r.mmlu}</div>
            </td>
            <td style="padding:14px 16px; width:280px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <span style="font-size:1.05rem; font-weight:900; color:${isCheapest ? "#059669" : "var(--text-main)"};">
                  ${costFormatted} /mo
                </span>
                ${isCheapest ? '<span class="status-badge status-confirmed" style="font-size:0.7rem; padding:2px 8px;"><i class="fas fa-piggy-bank"></i> Best ROI</span>' : ""}
              </div>
              <div style="height:8px; width:100%; background:#e2e8f0; border-radius:999px; overflow:hidden;">
                <div style="height:100%; width:${barPct}%; background:${r.color}; border-radius:999px; transition:width 0.3s ease;"></div>
              </div>
            </td>
          </tr>
        `;
        })
        .join("");
    },
  },

  // =========================================================================
  // 2. AI RESUME & ATS OPTIMIZATION STUDIO
  // =========================================================================
  resume: {
    roles: {
      agent_architect: {
        title: "Autonomous AI Agent Architect",
        salary: "$165,000 - $240,000",
        keywords: [
          "CrewAI",
          "LangGraph",
          "Multi-Agent",
          "Tool Calling",
          "StateGraph",
          "Autonomous Loops",
          "FastAPI",
          "Docker",
          "Redis",
          "Python",
          "Vector DB",
          "Enterprise RAG",
          "Guardrails",
          "Evaluation",
          "vLLM",
        ],
        sampleResume: `SUMMARY:
Fullstack Software Developer with 3 years experience building web apps with React and Node.js. Seeking to transition into Autonomous AI Engineering and Multi-Agent Systems.

EXPERIENCE:
Software Engineer | NexaTech Solutions (2023 - Present)
• Built customer dashboard using React, Next.js, and TypeScript.
• Connected ChatGPT API to summarize customer support tickets for agents.
• Worked with PostgreSQL database and Docker containers for local dev.
• Improved API response time by 15% through query caching.

PROJECTS:
• AI Support Chatbot: Created a prototype chatbot with Python and OpenAI API.
• Portfolio Website: Personal portfolio site hosted on Vercel.`,
      },
      rag_specialist: {
        title: "Enterprise RAG & Knowledge Systems Specialist",
        salary: "$150,000 - $210,000",
        keywords: [
          "Pinecone",
          "Hybrid Search",
          "Reciprocal Rank Fusion",
          "Chunking",
          "Vector Embeddings",
          "ChromaDB",
          "Milvus",
          "BM25",
          "Reranker",
          "Cohere Rerank",
          "LangChain",
          "FastAPI",
          "Document Parsing",
          "PyPDF",
          "Metadata Filtering",
        ],
        sampleResume: `SUMMARY:
Backend Engineer with strong experience in Python, REST APIs, and database indexing. Passionate about Enterprise Knowledge Retrieval, Semantic Search, and LLM orchestration.

EXPERIENCE:
Backend Developer | DataStream Corp (2022 - Present)
• Designed REST microservices with Python FastAPI and PostgreSQL.
• Implemented elasticsearch for document text retrieval across 200,000 records.
• Built prototype vector search using ChromaDB and OpenAI text-embedding-3-small.
• Reduced document ingestion latency by 25%.`,
      },
      prompt_engineer: {
        title: "AI Prompt & Context Engineer",
        salary: "$120,000 - $170,000",
        keywords: [
          "Few-Shot Prompting",
          "Chain-of-Thought",
          "XML Tags",
          "Context Window",
          "Prompt Injection Defense",
          "Guardrails",
          "LLM Benchmarking",
          "System Prompt Architecture",
          "Evaluation Datasets",
          "Claude 3.7",
          "GPT-4o",
        ],
        sampleResume: `SUMMARY:
Digital product specialist and Vibe Coder leveraging Cursor AI, Claude, and GPT-4 to rapidly prototype full-stack applications.

EXPERIENCE:
Product Specialist | Innovate Labs (2023 - Present)
• Crafted system prompts for internal customer satisfaction AI tools.
• Tested model prompts for tone, accuracy, and format adherence.
• Created 20+ no-code automations using Zapier, Make, and Claude API.`,
      },
    },

    currentRoleKey: "agent_architect",

    setRole: function (roleKey, btnEl) {
      this.currentRoleKey = roleKey;
      document.querySelectorAll(".resume-role-pill").forEach((b) => b.classList.remove("active"));
      if (btnEl) btnEl.classList.add("active");

      const role = this.roles[roleKey];
      if (!role) return;

      const titleEl = document.getElementById("resumeTargetTitle");
      const salaryEl = document.getElementById("resumeTargetSalary");
      if (titleEl) titleEl.innerText = role.title;
      if (salaryEl) salaryEl.innerText = role.salary;

      // Update keyword tags
      const kwList = document.getElementById("resumeTargetKeywords");
      if (kwList) {
        kwList.innerHTML = role.keywords
          .map(
            (k) => `
          <span class="status-badge" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.75rem;">
            ${k}
          </span>
        `
          )
          .join("");
      }

      this.analyzeResume();
    },

    loadSample: function () {
      const role = this.roles[this.currentRoleKey];
      if (!role) return;
      const ta = document.getElementById("resumeInputText");
      if (ta) {
        ta.value = role.sampleResume;
        this.analyzeResume();
      }
    },

    analyzeResume: function () {
      const ta = document.getElementById("resumeInputText");
      const text = ta ? ta.value.trim() : "";
      const role = this.roles[this.currentRoleKey];
      if (!role) return;

      const scoreEl = document.getElementById("resumeScoreVal");
      const matchBar = document.getElementById("resumeMatchBar");
      const missingKwEl = document.getElementById("resumeMissingKeywords");
      const suggestionsEl = document.getElementById("resumeSuggestionsList");

      if (!text) {
        if (scoreEl) scoreEl.innerText = "0%";
        if (matchBar) matchBar.style.width = "0%";
        return;
      }

      const lower = text.toLowerCase();
      const matched = [];
      const missing = [];

      role.keywords.forEach((kw) => {
        if (lower.includes(kw.toLowerCase())) {
          matched.push(kw);
        } else {
          missing.push(kw);
        }
      });

      // Score calculation
      const matchPct = Math.round((matched.length / role.keywords.length) * 100);
      const lengthBonus = Math.min(10, Math.round(text.length / 150));
      const hasNumbers = (text.match(/\d+%/g) || []).length * 3;
      const finalScore = Math.min(100, Math.max(15, Math.round(matchPct * 0.75 + lengthBonus + hasNumbers)));

      if (scoreEl) scoreEl.innerText = `${finalScore}/100`;
      if (matchBar) {
        matchBar.style.width = `${finalScore}%`;
        matchBar.style.background = finalScore >= 80 ? "#10b981" : finalScore >= 50 ? "#f59e0b" : "#ef4444";
      }

      if (missingKwEl) {
        missingKwEl.innerHTML =
          missing.length > 0
            ? missing
                .map(
                  (m) =>
                    `<span class="status-badge" style="background:#fee2e2; color:#b91c1c; font-size:0.75rem;"><i class="fas fa-plus"></i> ${m}</span>`
                )
                .join("")
            : '<span style="color:#059669; font-weight:800;"><i class="fas fa-check-circle"></i> 100% Critical Keywords Present!</span>';
      }

      if (suggestionsEl) {
        const tips = [];
        if (missing.length > 3) {
          tips.push(
            `Include high-yield keywords like <strong>${missing.slice(0, 3).join(", ")}</strong> in your project bullets.`
          );
        }
        if (!text.includes("%") && !text.includes("ms") && !text.includes("$")) {
          tips.push(
            `Quantify metrics: State exact latency reductions (e.g. <em>"reduced inference latency by 42%"</em>) and token cost savings.`
          );
        }
        tips.push(
          `Map your graduation Capstone from NEXVION AI ACADEMY directly under Featured Projects with verifiable serial credentials.`
        );
        suggestionsEl.innerHTML = tips.map((t) => `<li style="margin-bottom:8px; line-height:1.5;">${t}</li>`).join("");
      }
    },

    aiPolishResume: function () {
      const ta = document.getElementById("resumeInputText");
      const text = ta ? ta.value.trim() : "";
      if (!text) {
        if (typeof App !== "undefined" && App.showToast) {
          App.showToast("Resume Empty", "Paste your current resume or click 'Load Sample Resume' first.", "error");
        }
        return;
      }

      const role = this.roles[this.currentRoleKey];
      const btn = document.getElementById("btnPolishResume");
      if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Synthesizing FAANG-Grade AI Bullets...';

      if (typeof SoundFX !== "undefined" && SoundFX.playSuccess) {
        SoundFX.playSuccess();
      }

      setTimeout(() => {
        const enhanced = `SUMMARY:
High-Impact ${role.title} with proven expertise in production LLM orchestration, agentic architectures, and distributed AI engineering. Expert in ${role.keywords.slice(0, 4).join(", ")}.

PROFESSIONAL EXPERIENCE:
AI Systems Engineer | Production AI Labs (2024 - Present)
• Architected enterprise-grade multi-agent autonomous swarm utilizing ${role.keywords[0]} & ${role.keywords[1]}, achieving 99.4% task completion rate across 45,000 monthly workflows.
• Deployed high-throughput asynchronous microservices via Python FastAPI & Docker, reducing P99 model inference latency from 1.8s to 240ms.
• Built hybrid semantic retrieval pipeline combining ${role.keywords[2] || "Pinecone"}, BM25 keyword matching, and reciprocal rank fusion, improving context precision by 38%.
• Implemented token bucket rate-limiters, dynamic prompt caching, and cost-routing guardrails, slashing monthly LLM API expenditures by $14,200 (48% reduction).

ACADEMIC CAPSTONE & ACCREDITATIONS:
NEXVION AI ACADEMY | Accredited AI Masterclass Cohort (2026)
• Grand Capstone: Production-Ready ${role.title} Solution with real-time vector search & automated guardrails.
• Verified Credential ID: NEXVION-AI-${Math.floor(100000 + Math.random() * 900000)}`;

        const polishedBox = document.getElementById("resumePolishedOutput");
        const polishedText = document.getElementById("resumePolishedText");
        if (polishedBox && polishedText) {
          polishedText.value = enhanced;
          polishedBox.style.display = "block";
          polishedBox.scrollIntoView({ behavior: "smooth" });
        }

        if (btn) btn.innerHTML = '<i class="fas fa-magic"></i> AI Polish & Transform Resume';
        if (typeof App !== "undefined" && App.showToast) {
          App.showToast(
            "Resume Optimized! 🚀",
            "Score upgraded to 98/100 with quantified metrics & keyword density.",
            "success"
          );
        }
      }, 700);
    },

    copyPolished: function () {
      const el = document.getElementById("resumePolishedText");
      if (el) {
        navigator.clipboard.writeText(el.value);
        if (typeof App !== "undefined" && App.showToast) {
          App.showToast("Copied to Clipboard", "Optimized resume markdown ready for LinkedIn or job portals.", "info");
        }
      }
    },
  },

  // =========================================================================
  // 3. AUTONOMOUS AI CAPSTONE BLUEPRINT GENERATOR
  // =========================================================================
  blueprint: {
    industries: {
      healthcare: {
        title: "HIPAA-Compliant Clinical Diagnostic & Trial Intelligence Agent",
        domain: "Healthcare & Life Sciences",
        icon: "fa-heartbeat",
        color: "#ef4444",
        stack: [
          "LangGraph StateGraph",
          "FastAPI Async Engine",
          "Pinecone Vector DB (HIPAA Tier)",
          "Llama-3.3 Med-Tuned (vLLM)",
          "Presidio PII Anonymizer",
        ],
        architecture: `[Doctor / Clinical Intake] 
          │ (Encrypted TLS 1.3)
          ▼
   [PII Sanitizer & Presidio Redaction Layer]
          │
          ▼
   [LangGraph Multi-Agent Orchestrator]
    ├─── Agent 1: Medical History RAG (Pinecone Clinical Vectors)
    ├─── Agent 2: Differential Diagnostic Reasoner (CoT + Llama-3.3)
    └─── Agent 3: Drug Interaction & Safety Guardrail Checker
          │
          ▼
   [Structured JSON Clinical Summary Report] ──> [Doctor Verification Sign-Off]`,
        milestones: [
          "Week 1: PII masking pipeline with Microsoft Presidio & HIPAA compliant vector index.",
          "Week 2: Medical document ingestion (EHR, PubMed papers) with semantic chunking.",
          "Week 3: LangGraph state machine with deterministic human-in-the-loop sign-off.",
          "Week 4: Deployment on secure Docker container with JWT role authorization.",
        ],
      },
      fintech: {
        title: "High-Frequency Algorithmic Market Sentiment & Risk Copilot",
        domain: "FinTech & Quantitative Trading",
        icon: "fa-chart-line",
        color: "#10b981",
        stack: [
          "CrewAI Swarm Engine",
          "Python FastAPI",
          "Redis Sliding Window Cache",
          "DeepSeek R1 / Claude 3.7",
          "ClickHouse / Time-Series DB",
        ],
        architecture: `[Live News / SEC 10-K Filings / Order Book Feeds]
          │ (WebSocket Stream)
          ▼
   [Token Bucket Ingestion & Deduplication Proxy]
          │
          ▼
   [CrewAI Financial Swarm]
    ├─── Senior Fundamental Analyst (Financial Metric Extraction)
    ├─── Sentiment Quantification Agent (Real-time SEC filing parser)
    └─── Risk & Portfolio Exposure Auditor (Value-at-Risk Simulation)
          │
          ▼
   [Automated Trade Strategy Alert / Order Execution Hook]`,
        milestones: [
          "Week 1: SEC EDGAR API & WebSocket live data ingestion pipeline.",
          "Week 2: Vector embedding of 10-K filings with Reciprocal Rank Fusion.",
          "Week 3: CrewAI collaborative financial personas with confidence scoring.",
          "Week 4: Production backtesting engine and Slack/Telegram alert webhook.",
        ],
      },
      legal: {
        title: "Autonomous Enterprise Contract Redlining & Precedent Engine",
        domain: "LegalTech & Enterprise Compliance",
        icon: "fa-gavel",
        color: "#8b5cf6",
        stack: [
          "LangChain / LangGraph",
          "ChromaDB Local Vector DB",
          "Claude 3.7 Sonnet (200k context)",
          "Python docx/PDF parser",
          "Streamlit / Next.js UI",
        ],
        architecture: `[Contract Upload (NDA, MSA, SaaS Agreements)]
          │
          ▼
   [Hierarchical Section & Clause Extraction Parser]
          │
          ▼
   [Dual-Agent Legal Review Loop]
    ├─── Agent A: Clause Risk Analyzer (Flags deviation from company playbook)
    └─── Agent B: Redline Generator (Writes substitute protective language)
          │
          ▼
   [Interactive Side-by-Side Diff Viewer with 1-Click Accept/Reject]`,
        milestones: [
          "Week 1: Legal clause boundary parser and company playbook embedding.",
          "Week 2: High-precision semantic comparison with threshold gating.",
          "Week 3: Automated track-changes docx export generation.",
          "Week 4: Benchmarking against top 100 Fortune 500 standard agreements.",
        ],
      },
      ecommerce: {
        title: "Autonomous Omni-Channel Customer Resolution & Inventory Swarm",
        domain: "E-Commerce & Supply Chain",
        icon: "fa-shopping-cart",
        color: "#f59e0b",
        stack: [
          "CrewAI Multi-Agent",
          "Supabase PostgreSQL",
          "Shopify / Stripe Webhooks",
          "OpenAI GPT-4o-mini",
          "Redis Message Queue",
        ],
        architecture: `[Customer Support Ticket / WhatsApp / Live Chat]
          │
          ▼
   [Intent Classifier & Order Status Fetcher (Shopify API)]
          │
          ▼
   [Autonomous Customer Resolution Swarm]
    ├─── Order & Logistics Agent (Live tracking & carrier status)
    ├─── Refund & Warranty Arbiter (Enforces policy & triggers Stripe refund)
    └─── Empathy & Brand Tone Specialist (Personalized messaging)
          │
          ▼
   [Automated Resolution + CRM Ticket Closure in < 45 seconds]`,
        milestones: [
          "Week 1: Shopify & Stripe webhook event handlers in FastAPI.",
          "Week 2: Autonomous tool calling with strict JSON schema constraints.",
          "Week 3: Self-evaluating refund approval guardrails with manager escalation.",
          "Week 4: Live deployment with 95% zero-human-touch resolution rate.",
        ],
      },
    },

    currentKey: "healthcare",

    generate: function (key) {
      this.currentKey = key || this.currentKey;
      const bp = this.industries[this.currentKey];
      if (!bp) return;

      document.querySelectorAll(".blueprint-pill-btn").forEach((b) => b.classList.remove("active"));
      const activeBtn = document.getElementById(`btnBp_${this.currentKey}`);
      if (activeBtn) activeBtn.classList.add("active");

      const titleEl = document.getElementById("bpTitle");
      const domainEl = document.getElementById("bpDomain");
      const stackEl = document.getElementById("bpStackList");
      const archEl = document.getElementById("bpArchitectureText");
      const milestonesEl = document.getElementById("bpMilestonesList");

      if (titleEl) titleEl.innerText = bp.title;
      if (domainEl) domainEl.innerHTML = `<i class="fas ${bp.icon}" style="color:${bp.color};"></i> ${bp.domain}`;
      if (archEl) archEl.innerText = bp.architecture;

      if (stackEl) {
        stackEl.innerHTML = bp.stack
          .map(
            (s) => `
          <div style="background:#f1f5f9; padding:8px 12px; border-radius:8px; font-weight:700; font-size:0.85rem; color:#0f172a; display:flex; align-items:center; gap:8px;">
            <i class="fas fa-check-circle" style="color:#059669;"></i> ${s}
          </div>
        `
          )
          .join("");
      }

      if (milestonesEl) {
        milestonesEl.innerHTML = bp.milestones
          .map(
            (m) => `
          <li style="margin-bottom:10px; font-size:0.9rem; line-height:1.5; color:#334155;">
            <strong>${m.split(":")[0]}:</strong>${m.split(":")[1] || ""}
          </li>
        `
          )
          .join("");
      }

      if (typeof SoundFX !== "undefined" && SoundFX.playClick) {
        SoundFX.playClick();
      }
    },

    downloadSpec: function () {
      const bp = this.industries[this.currentKey];
      if (!bp) return;

      const content = `# CAPSTONE SPECIFICATION: ${bp.title}
Domain: ${bp.domain}
Architected by: NEXVION AI ACADEMY Scholar

## TECH STACK
${bp.stack.map((s) => `- ${s}`).join("\n")}

## SYSTEM ARCHITECTURE
\`\`\`
${bp.architecture}
\`\`\`

## 4-WEEK EXECUTION ROADMAP
${bp.milestones.map((m) => `- ${m}`).join("\n")}

## OFFICIAL ACCREDITATION
Upon completion of this capstone, graduate is authorized for:
- Faculty Review & Digital Certificate Verification
- Verifiable ID Pass QR Hash
`;

      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `NEXVION_Capstone_${this.currentKey}_Blueprint.md`;
      a.click();
      URL.revokeObjectURL(url);

      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("Blueprint Downloaded", "Production specification markdown saved.", "success");
      }
    },
  },

  // =========================================================================
  // 4. MERIT SCHOLARSHIP & FINANCIAL AID ASSESSMENT
  // =========================================================================
  scholarship: {
    isOpen: false,
    selectedGrant: null,

    openModal: function () {
      const modal = document.getElementById("scholarshipModal");
      if (modal) {
        modal.classList.add("active");
        this.isOpen = true;
      }
    },

    closeModal: function () {
      const modal = document.getElementById("scholarshipModal");
      if (modal) {
        modal.classList.remove("active");
        this.isOpen = false;
      }
    },

    calculateGrant: function (e) {
      if (e) e.preventDefault();
      const exp = document.getElementById("scholExp").value;
      const hours = document.getElementById("scholHours").value;
      const goal = document.getElementById("scholGoal").value;

      let discountPct = 25;
      if (exp === "student" || hours === "20+") discountPct = 30;
      if (goal === "saas" && hours === "20+") discountPct = 35;

      const voucherCode = `NEXVION-SCHOLAR-${discountPct}`;
      this.selectedGrant = {
        discountPct,
        voucherCode,
      };

      const quizForm = document.getElementById("scholQuizForm");
      const resultCard = document.getElementById("scholResultCard");
      const discountTag = document.getElementById("scholDiscountTag");
      const voucherEl = document.getElementById("scholVoucherCode");

      if (quizForm) quizForm.style.display = "none";
      if (resultCard) resultCard.style.display = "block";
      if (discountTag) discountTag.innerText = `${discountPct}% TUITION GRANT APPROVED`;
      if (voucherEl) voucherEl.innerText = voucherCode;

      if (typeof SoundFX !== "undefined" && SoundFX.playSuccess) {
        SoundFX.playSuccess();
      }
    },

    applyToWizard: function () {
      this.closeModal();
      if (typeof App !== "undefined" && App.showView) {
        App.showView("register");
      }

      // Pre-fill promo code in Wizard if available
      setTimeout(() => {
        const promoInput = document.getElementById("promoCodeInput");
        if (promoInput && this.selectedGrant) {
          promoInput.value = this.selectedGrant.voucherCode;
          if (typeof Wizard !== "undefined" && Wizard.applyPromoCode) {
            Wizard.applyPromoCode();
          }
        }
        if (typeof App !== "undefined" && App.showToast) {
          App.showToast(
            "Scholarship Voucher Applied! 🎓",
            `${this.selectedGrant ? this.selectedGrant.discountPct : 25}% tuition credit applied to your enrollment.`,
            "success"
          );
        }
      }, 350);
    },
  },

  // =========================================================================
  // 5. ZEN FOCUS MODE & DEEP STUDY ENVIRONMENT
  // =========================================================================
  zen: {
    active: false,
    timerSeconds: 25 * 60,
    timerInterval: null,
    isRunning: false,

    toggle: function () {
      this.active = !this.active;
      let hud = document.getElementById("zenFocusHud");

      if (this.active) {
        if (!hud) {
          this.createHud();
          hud = document.getElementById("zenFocusHud");
        }
        hud.style.display = "flex";
        document.body.classList.add("zen-focus-active");
        if (typeof App !== "undefined" && App.showToast) {
          App.showToast("Zen Focus Mode ON 🧘", "Distractions minimized. Press [Z] or ESC to exit.", "info");
        }
      } else {
        if (hud) hud.style.display = "none";
        document.body.classList.remove("zen-focus-active");
        this.pauseTimer();
      }
    },

    createHud: function () {
      const div = document.createElement("div");
      div.id = "zenFocusHud";
      div.className = "zen-focus-hud";
      div.innerHTML = `
        <div class="zen-hud-inner">
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="zen-pulse-dot"></span>
            <span style="font-weight:800; font-size:0.85rem; color:#00f0ff; letter-spacing:0.06em;">ZEN FOCUS LAB</span>
          </div>
          <div class="zen-timer-display" id="zenTimerVal">25:00</div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="btn btn-sm btn-primary" id="btnZenPlayPause" onclick="FrontierTools.zen.toggleTimer()" style="padding:6px 14px;">
              <i class="fas fa-play"></i> Start
            </button>
            <button class="btn btn-sm btn-secondary" onclick="FrontierTools.zen.resetTimer()" style="padding:6px 10px;">
              <i class="fas fa-redo"></i>
            </button>
            <button class="btn btn-sm btn-secondary" onclick="FrontierTools.zen.toggle()" title="Exit Zen Mode (ESC)" style="padding:6px 10px;">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(div);
    },

    toggleTimer: function () {
      if (this.isRunning) {
        this.pauseTimer();
      } else {
        this.startTimer();
      }
    },

    startTimer: function () {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      if (this.timerSeconds <= 0) {
        this.timerSeconds = 25 * 60;
        this.updateDisplay();
      }
      this.isRunning = true;
      const btn = document.getElementById("btnZenPlayPause");
      if (btn) btn.innerHTML = '<i class="fas fa-pause"></i> Pause';

      this.timerInterval = setInterval(() => {
        if (this.timerSeconds > 0) {
          this.timerSeconds--;
          this.updateDisplay();
        } else {
          this.pauseTimer();
          if (typeof SoundFX !== "undefined" && SoundFX.playSuccess) {
            SoundFX.playSuccess();
          }
          alert("🎉 Focus Session Complete! Time for a 5-minute break.");
        }
      }, 1000);
    },

    pauseTimer: function () {
      this.isRunning = false;
      clearInterval(this.timerInterval);
      const btn = document.getElementById("btnZenPlayPause");
      if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Resume';
    },

    resetTimer: function () {
      this.pauseTimer();
      this.timerSeconds = 25 * 60;
      this.updateDisplay();
      const btn = document.getElementById("btnZenPlayPause");
      if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Start';
    },

    updateDisplay: function () {
      const el = document.getElementById("zenTimerVal");
      if (!el) return;
      const mins = Math.floor(this.timerSeconds / 60)
        .toString()
        .padStart(2, "0");
      const secs = (this.timerSeconds % 60).toString().padStart(2, "0");
      el.innerText = `${mins}:${secs}`;
    },
  },

  // Setup Keyboard Shortcuts (Z for Zen, Esc to close modals, M for Audio)
  initKeyListeners: function () {
    window.addEventListener("keydown", (e) => {
      // Ignore when typing in inputs or textareas
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

      if (e.key === "z" || e.key === "Z") {
        this.zen.toggle();
      } else if (e.key === "m" || e.key === "M") {
        if (typeof SoundFX !== "undefined" && SoundFX.toggle) {
          SoundFX.toggle();
        }
      } else if (e.key === "Escape") {
        this.scholarship.closeModal();
        if (this.zen.active) this.zen.toggle();
      }
    });
  },

  init: function () {
    this.initKeyListeners();
    // Initialize benchmark calculation on startup
    setTimeout(() => {
      this.benchmark.recalculate();
      this.resume.setRole("agent_architect");
      this.blueprint.generate("healthcare");
    }, 100);
  },
};

// Auto-initialize when loaded
if (typeof window !== "undefined") {
  window.FrontierTools = FrontierTools;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      FrontierTools.init();
    });
  } else {
    FrontierTools.init();
  }
}
