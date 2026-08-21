// AI Nexus Academy - Nexus AI Interactive Lab (Multi-Agent Swarm, Prompt Optimizer & Vector RAG)

const NexusAILab = {
  currentTab: 'swarm',
  isSwarmRunning: false,
  swarmInterval: null,

  // Sample Presets for Multi-Agent Swarms
  swarmPresets: {
    legal: {
      goal: "Build an Autonomous Legal Contract Analysis & Risk Detection Swarm",
      track: "AI-401: Advanced AI Architecture & MLOps",
      steps: [
        { agent: "Scout Agent", role: "Legal Doc Parser", icon: "fas fa-search", color: "#0284c7", msg: "Loading 84-page NDA & SaaS Agreement PDF into memory. Chunking via RecursiveCharacterTextSplitter(chunk_size=1000, overlap=150)..." },
        { agent: "Scout Agent", role: "Legal Doc Parser", icon: "fas fa-search", color: "#0284c7", msg: "Generating embeddings with text-embedding-3-small. Stored 142 vectors in Pinecone index 'legal-vault'." },
        { agent: "Architect Agent", role: "Risk Analyzer", icon: "fas fa-brain", color: "#7c3aed", msg: "Executing hybrid semantic search: querying 'Indemnity & Unlimited Liability clauses'. Top match cosine similarity: 0.942." },
        { agent: "Architect Agent", role: "Risk Analyzer", icon: "fas fa-brain", color: "#7c3aed", msg: "Identified 3 high-risk non-standard liability clauses in Section 8.4. Formatting mitigation strategy." },
        { agent: "Coder Agent", role: "FastAPI Engineer", icon: "fas fa-code", color: "#059669", msg: "Synthesized LangGraph Multi-Agent DAG workflow with human-in-the-loop review gate. Exporting Python code." },
        { agent: "Critic Agent", role: "Hallucination QA", icon: "fas fa-shield-alt", color: "#e11d48", msg: "Self-consistency verification complete: 0.0% hallucination detected. Legal citation accuracy: 100%." }
      ],
      outputCode: `# =====================================================================
# AI NEXUS ACADEMY - AUTONOMOUS LEGAL RISK SWARM (AI-401)
# =====================================================================
from crewai import Agent, Crew, Process, Task
from langchain_community.vectorstores import Pinecone
from langchain_openai import ChatOpenAI

# 1. Initialize Autonomous Swarm Agents
scout_agent = Agent(
    role="Senior Legal Document Ingestion Specialist",
    goal="Extract and vectorize non-standard contract clauses with precise line-level citations",
    backstory="Trained on 500,000+ commercial SaaS and venture capital contracts.",
    verbose=True,
    llm=ChatOpenAI(model="gpt-4o", temperature=0.1)
)

risk_architect = Agent(
    role="Lead Corporate Risk & Compliance Counsel",
    goal="Evaluate indemnity, IP assignment, and regulatory exposure across contract clauses",
    backstory="Former Big-Law general counsel specializing in AI governance and IP protection.",
    verbose=True
)

# 2. Define Multi-Agent Collaborative Task DAG
audit_task = Task(
    description="Analyze Section 8.4 indemnity clauses for uncapped financial liability exposure.",
    expected_output="Structured JSON report ranking severity from Low to Catastrophic with mitigation redlines.",
    agent=risk_architect
)

legal_crew = Crew(
    agents=[scout_agent, risk_architect],
    tasks=[audit_task],
    process=Process.hierarchical,
    manager_llm=ChatOpenAI(model="gpt-4o", temperature=0)
)

# Execute swarm
result = legal_crew.kickoff()
print("✓ Swarm Audit Complete. Output:\\n", result)`
    },
    seo: {
      goal: "Deploy an Autonomous Multi-Agent SEO Content & Competitive Intelligence Swarm",
      track: "AI-301: API Architecture & AI Engine APIs",
      steps: [
        { agent: "Scout Agent", role: "SERP Intelligence", icon: "fas fa-globe", color: "#0284c7", msg: "Querying Google Search API for keyword cluster: 'autonomous ai agents framework 2026'. Analyzing top 10 rankings." },
        { agent: "Scout Agent", role: "SERP Intelligence", icon: "fas fa-globe", color: "#0284c7", msg: "Extracted average word count (2,450), LSI keywords (CrewAI, LangGraph, DSPy), and user search intent." },
        { agent: "Architect Agent", role: "Editorial Director", icon: "fas fa-brain", color: "#7c3aed", msg: "Generating 7-part comprehensive outline with interactive code snippets and architectural diagrams." },
        { agent: "Coder Agent", role: "Technical Writer", icon: "fas fa-code", color: "#059669", msg: "Drafting production markdown content with verified Python imports and benchmark charts." },
        { agent: "Critic Agent", role: "Fact & SEO Auditor", icon: "fas fa-shield-alt", color: "#e11d48", msg: "Flesch-Kincaid grade: 11.2. Keyword density: 1.8%. SEO Content Score: 98/100." }
      ],
      outputCode: `# =====================================================================
# AI NEXUS ACADEMY - CONTENT INTELLIGENCE SWARM (AI-301)
# =====================================================================
import asyncio
from langgraph.graph import StateGraph, END

class SwarmState(dict):
    keyword: str
    serp_data: dict
    outline: list
    content: str
    seo_score: float

async def serp_research_node(state: SwarmState):
    # Simulated SERP extraction
    state["serp_data"] = {"top_queries": ["LangGraph vs CrewAI", "Production Agent Memory"]}
    return state

async def generate_article_node(state: SwarmState):
    state["content"] = "# The Ultimate Guide to Autonomous Multi-Agent Swarms in 2026..."
    state["seo_score"] = 98.4
    return state

workflow = StateGraph(SwarmState)
workflow.add_node("research", serp_research_node)
workflow.add_node("writer", generate_article_node)
workflow.set_entry_point("research")
workflow.add_edge("research", "writer")
workflow.add_edge("writer", END)

app = workflow.compile()
print("✓ LangGraph Content Swarm compiled & ready for real-time webhooks.")`
    },
    trading: {
      goal: "Real-Time Financial Sentiment & Market Anomaly Sentinel Swarm",
      track: "AI-401: Advanced AI Architecture & MLOps",
      steps: [
        { agent: "Scout Agent", role: "Telemetry Streamer", icon: "fas fa-bolt", color: "#0284c7", msg: "Streaming 10,000 live tweets & Bloomberg terminal RSS feeds for tickers: $NVDA, $GOOG, $MSFT." },
        { agent: "Scout Agent", role: "Telemetry Streamer", icon: "fas fa-bolt", color: "#0284c7", msg: "Computing real-time FinBERT sentiment scores. Positive sentiment surge: +42% in past 15 mins." },
        { agent: "Architect Agent", role: "Quantitative Model", icon: "fas fa-brain", color: "#7c3aed", msg: "Correlating sentiment surge with order-book depth and implied volatility smiles." },
        { agent: "Coder Agent", role: "Order Router", icon: "fas fa-code", color: "#059669", msg: "Generated synthetic risk-hedged options collar strategy. Simulating PnL in backtest sandbox." },
        { agent: "Critic Agent", role: "Risk Sentinel", icon: "fas fa-shield-alt", color: "#e11d48", msg: "VaR (Value at Risk) validated at 99% confidence level. Maximum allowable drawdown: 1.5%." }
      ],
      outputCode: `# =====================================================================
# AI NEXUS ACADEMY - REALTIME SENTINEL SWARM (AI-401)
# =====================================================================
import numpy as np
from transformers import pipeline

class MarketSentinelSwarm:
    def __init__(self):
        self.sentiment_pipe = pipeline("text-classification", model="ProsusAI/finbert")
        
    def analyze_feed(self, headline: str):
        result = self.sentiment_pipe(headline)[0]
        label = result['label']
        confidence = float(result['score'])
        return {"sentiment": label, "confidence": confidence, "action": "HEDGE" if label == "negative" else "BUY"}

sentinel = MarketSentinelSwarm()
test_signal = sentinel.analyze_feed("NVIDIA announces next-gen Rubin architecture exceeding cloud AI throughput.")
print(f"✓ Sentinel Signal: {test_signal}")`
    }
  },

  // Prompt Optimizer Presets
  promptPresets: {
    customerBot: {
      raw: "Make me an AI chatbot that answers customer questions on my website and doesnt make up false info.",
      optimized: `### SYSTEM PROMPT: ENTERPRISE CUSTOMER INTELLIGENCE AGENT (v3.4)

You are the Tier-1 AI Concierge for AI Nexus Academy. Your role is to deliver concise, polite, and 100% factually grounded support.

### STRICT GUARDRAILS & GROUNDING RULES:
1. STRICT TRUTH PROTOCOL: Answer ONLY using the provided Knowledge Base context below. If an answer cannot be deduced with 100% certainty, reply:
   "I do not have verified information on that specific inquiry. Let me connect you directly with our Dean's Admissions Office."
2. ZERO HALLUCINATION: Never invent pricing, batch start dates, or instructor credentials.
3. OUTPUT FORMAT: Respond in structured markdown using bullet points for multi-step instructions.

### FEW-SHOT EXAMPLES:
User: "How much is the Low Tier Vibe Coding course?"
Assistant: "Our Track AI-101 (Vibe Coding Softwares & AI App Development) is **₹1,500** for the 4-week live cohort with lifetime recording access."

### CONTEXT INGESTION:
{context_stream}

### USER INQUIRY:
{user_query}`,
      track: "AI-101 & AI-301",
      improvements: ["Chain-of-Thought (CoT) system scaffolding", "Strict anti-hallucination fallback policy", "Few-shot response grounding", "JSON / Context slot dynamic injection"]
    },
    codeReviewer: {
      raw: "Check my python code for bugs and speed issues and fix it.",
      optimized: `### SYSTEM PROMPT: PRINCIPAL AI CODE & PERFORMANCE AUDITOR

You are a Principal Software Engineer & MLOps Specialist. Review the supplied Python code with strict scrutiny for asymptotic complexity, memory leaks, concurrency safety, and type soundness.

### AUDIT TAXONOMY:
1. 🔴 CRITICAL (Security Vulnerabilities, SQLi, Prompt Injection, Memory Leaks)
2. 🟡 PERFORMANCE (O(N^2) bottlenecks, un-vectorized loops, lack of connection pooling)
3. 🟢 IDIOMATIC CLEAN CODE (PEP 8, Type Annotations, Pydantic Schema Validation)

### OUTPUT SPECIFICATION:
Provide a markdown report with:
- Summary Table of Detected Anomalies
- Optimized Drop-In Replacement Code with full typing
- Big-O Complexity Comparison (Before vs After)

### INPUT CODE:
\`\`\`python
{source_code}
\`\`\``,
      track: "AI-301 & AI-401",
      improvements: ["Severity taxonomy classification (Critical / Warning / Clean)", "Big-O complexity mathematical audit", "Strict type-soundness enforcement", "Standardized Markdown diff output"]
    }
  },

  // Vector RAG Knowledge Base for Explorer
  ragKnowledgeBase: [
    { id: 1, title: "CrewAI Multi-Agent Architecture", text: "CrewAI orchestrates role-playing autonomous AI agents using hierarchical or sequential processes. Agents communicate through delegated task memory and shared scratchpads.", track: "AI-401" },
    { id: 2, title: "Vector Embeddings & Pinecone Search", text: "Vector embeddings represent text in high-dimensional dense spaces. Cosine similarity calculates dot products between normalized query vectors and document chunk embeddings.", track: "AI-301" },
    { id: 3, title: "Vibe Coding with Cursor & Lovable", text: "Vibe coding is the practice of engineering end-to-end fullstack applications purely through conversational AI prompt loops and natural language code generation.", track: "AI-101" },
    { id: 4, title: "Cloud Deployment on Vercel & Render", text: "Production deployment of AI APIs requires SSL termination, secret environment variable handling, containerized Docker workers, and automated CI/CD pipelines.", track: "AI-201" }
  ],

  init: function() {
    this.switchTab('swarm');
  },

  // Switch between Swarm, Prompt, and RAG tabs
  switchTab: function(tabId) {
    this.currentTab = tabId;
    
    document.querySelectorAll('.ai-lab-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.ai-lab-pane').forEach(pane => {
      pane.style.display = pane.id === `labPane-${tabId}` ? 'block' : 'none';
    });

    if (tabId === 'swarm' && !this.isSwarmRunning) {
      this.loadSwarmPreset('legal');
    } else if (tabId === 'prompt') {
      this.loadPromptPreset('customerBot');
    } else if (tabId === 'rag') {
      this.runRagSearch();
    }
  },

  // ------------------------------------------------------------------------
  // 1. MULTI-AGENT SWARM SIMULATOR
  // ------------------------------------------------------------------------
  loadSwarmPreset: function(key) {
    if (this.isSwarmRunning) return;
    const preset = this.swarmPresets[key] || this.swarmPresets.legal;
    
    const goalInput = document.getElementById('labSwarmGoalInput');
    if (goalInput) goalInput.value = preset.goal;

    const trackTag = document.getElementById('labSwarmTrackTag');
    if (trackTag) trackTag.textContent = preset.track;

    this.renderSwarmAgentsIdle();
    this.renderTerminalInitial(preset);
  },

  renderSwarmAgentsIdle: function() {
    const container = document.getElementById('labSwarmAgentsGrid');
    if (!container) return;

    const agents = [
      { name: "Scout Agent", role: "Telemetry & Ingestion", icon: "fas fa-satellite-dish", color: "#0284c7", state: "STANDBY" },
      { name: "Architect Agent", role: "RAG & Reasoning", icon: "fas fa-brain", color: "#7c3aed", state: "STANDBY" },
      { name: "Coder Agent", role: "FastAPI & LangGraph", icon: "fas fa-code", color: "#059669", state: "STANDBY" },
      { name: "Critic Agent", role: "Guardrails & QA", icon: "fas fa-shield-alt", color: "#e11d48", state: "STANDBY" }
    ];

    container.innerHTML = agents.map(a => `
      <div class="lab-agent-node" id="node-${a.name.replace(' ', '')}">
        <div class="lab-agent-icon" style="background: ${a.color}20; color: ${a.color}; border: 1px solid ${a.color}50;">
          <i class="${a.icon}"></i>
        </div>
        <div class="lab-agent-info">
          <div class="lab-agent-name">${a.name}</div>
          <div class="lab-agent-role">${a.role}</div>
        </div>
        <span class="lab-agent-badge status-pending" id="badge-${a.name.replace(' ', '')}">
          ${a.state}
        </span>
      </div>
    `).join('');
  },

  renderTerminalInitial: function(preset) {
    const term = document.getElementById('labSwarmTerminalOutput');
    if (!term) return;

    term.innerHTML = `
      <div class="term-line term-dim">// AI Nexus Swarm Orchestrator v4.2.0 initialized.</div>
      <div class="term-line term-cyan">> Ready to launch DAG. Target Goal: "${preset.goal}"</div>
      <div class="term-line term-dim">> Click 'Launch Multi-Agent Swarm' to observe autonomous peer delegation.</div>
    `;

    const codeBox = document.getElementById('labSwarmCodeOutput');
    if (codeBox) {
      codeBox.textContent = preset.outputCode;
    }
  },

  startSwarmSimulation: function() {
    if (this.isSwarmRunning) return;
    this.isSwarmRunning = true;

    const btn = document.getElementById('btnLaunchSwarm');
    if (btn) {
      btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Swarm Orchestrating...`;
      btn.disabled = true;
    }

    const currentKey = document.getElementById('labSwarmPresetSelect')?.value || 'legal';
    const preset = this.swarmPresets[currentKey] || this.swarmPresets.legal;
    const steps = preset.steps;

    const term = document.getElementById('labSwarmTerminalOutput');
    if (term) term.innerHTML = `<div class="term-line term-magenta">> [INIT] Spawning multi-agent swarm cluster on 4x A100 GPU nodes...</div>`;

    let stepIndex = 0;
    const tokenMeter = document.getElementById('labSwarmTokensMeter');
    const latencyMeter = document.getElementById('labSwarmLatencyMeter');

    this.swarmInterval = setInterval(() => {
      if (stepIndex >= steps.length) {
        clearInterval(this.swarmInterval);
        this.isSwarmRunning = false;
        if (btn) {
          btn.innerHTML = `<i class="fas fa-play"></i> Re-Run Swarm Simulation`;
          btn.disabled = false;
        }

        if (term) {
          term.innerHTML += `
            <div class="term-line term-green" style="margin-top:8px; font-weight:700;">✓ [SUCCESS] Swarm mission accomplished. 0 errors detected.</div>
            <div class="term-line term-cyan">> Production Python artifact compiled below. Ready to deploy.</div>
          `;
          term.scrollTop = term.scrollHeight;
        }

        // Set all badges to ACTIVE
        document.querySelectorAll('.lab-agent-node').forEach(node => {
          node.classList.remove('active-pulsing');
        });
        document.querySelectorAll('.lab-agent-badge').forEach(badge => {
          badge.className = 'lab-agent-badge status-confirmed';
          badge.textContent = 'COMPLETED';
        });

        App.showToast("Swarm Execution Complete! 🚀", `All 4 autonomous agents finished their tasks with 100% accuracy.`, "success");
        return;
      }

      const step = steps[stepIndex];
      const agentId = step.agent.replace(' ', '');

      // Update Agent Nodes Visual State
      document.querySelectorAll('.lab-agent-node').forEach(n => n.classList.remove('active-pulsing'));
      const activeNode = document.getElementById(`node-${agentId}`);
      const activeBadge = document.getElementById(`badge-${agentId}`);
      if (activeNode) activeNode.classList.add('active-pulsing');
      if (activeBadge) {
        activeBadge.className = 'lab-agent-badge status-payment';
        activeBadge.innerHTML = `<i class="fas fa-cog fa-spin"></i> WORKING`;
      }

      // Append Terminal Log
      if (term) {
        const time = new Date().toLocaleTimeString();
        term.innerHTML += `
          <div class="term-line">
            <span class="term-dim">[${time}]</span> 
            <strong style="color:${step.color};">[${step.agent} &bull; ${step.role}]</strong>: 
            <span>${step.msg}</span>
          </div>
        `;
        term.scrollTop = term.scrollHeight;
      }

      // Update live telemetry
      if (tokenMeter) {
        const tok = 120 + Math.floor(Math.random() * 45);
        tokenMeter.textContent = `${tok} tok/sec`;
      }
      if (latencyMeter) {
        const lat = 12 + Math.floor(Math.random() * 8);
        latencyMeter.textContent = `${lat}ms`;
      }

      stepIndex++;
    }, 1100);
  },

  copySwarmCode: function() {
    const codeBox = document.getElementById('labSwarmCodeOutput');
    if (!codeBox) return;

    navigator.clipboard.writeText(codeBox.textContent).then(() => {
      App.showToast("Code Copied! 📋", "Python Multi-Agent code copied to clipboard.", "success");
    });
  },

  // ------------------------------------------------------------------------
  // 2. PROMPT OPTIMIZER & SYSTEM ARCHITECT
  // ------------------------------------------------------------------------
  loadPromptPreset: function(key) {
    const preset = this.promptPresets[key] || this.promptPresets.customerBot;
    const rawInput = document.getElementById('labRawPromptInput');
    if (rawInput) rawInput.value = preset.raw;
    this.optimizePrompt(preset);
  },

  optimizePrompt: function(customPreset) {
    const rawInput = document.getElementById('labRawPromptInput');
    const text = rawInput ? rawInput.value.trim() : "";

    const selectedKey = document.getElementById('labPromptPresetSelect')?.value || 'customerBot';
    const preset = customPreset || this.promptPresets[selectedKey] || this.promptPresets.customerBot;

    const optOutput = document.getElementById('labOptimizedPromptOutput');
    const impList = document.getElementById('labPromptImprovementsList');
    const trackBadge = document.getElementById('labPromptTrackTag');

    if (optOutput) {
      optOutput.textContent = preset.optimized.replace('{user_query}', text || "What are the track syllabus topics?");
    }

    if (trackBadge) {
      trackBadge.textContent = `Mastered in ${preset.track}`;
    }

    if (impList) {
      impList.innerHTML = preset.improvements.map(imp => `
        <span class="tech-chip" style="font-size:0.75rem; background:rgba(2,132,199,0.08); color:var(--neon-cyan); border-color:rgba(2,132,199,0.3);">
          <i class="fas fa-check-circle" style="color:var(--neon-emerald);"></i> ${imp}
        </span>
      `).join('');
    }

    App.showToast("Prompt Optimized! ✨", "Enhanced with production system guardrails & Chain-of-Thought reasoning.", "info");
  },

  copyOptimizedPrompt: function() {
    const optOutput = document.getElementById('labOptimizedPromptOutput');
    if (!optOutput) return;

    navigator.clipboard.writeText(optOutput.textContent).then(() => {
      App.showToast("Prompt Copied! 📋", "Optimized system prompt copied to clipboard.", "success");
    });
  },

  // ------------------------------------------------------------------------
  // 3. VECTOR RAG & SEMANTIC EMBEDDING EXPLORER
  // ------------------------------------------------------------------------
  runRagSearch: function() {
    const queryInput = document.getElementById('labRagQueryInput');
    const query = (queryInput ? queryInput.value.trim() : "") || "How do multi-agent swarms share memory and context?";

    const resultsContainer = document.getElementById('labRagResultsContainer');
    const vectorDisplay = document.getElementById('labRagVectorDisplay');
    const promptInjection = document.getElementById('labRagInjectedPrompt');

    // Simulate 384-dimensional dense vector numbers
    const sampleVector = Array.from({ length: 12 }, () => (Math.random() * 2 - 1).toFixed(4)).join(', ') + '... [384 dims]';
    if (vectorDisplay) {
      vectorDisplay.textContent = `[${sampleVector}]`;
    }

    // Rank knowledge chunks based on query matching
    const qLower = query.toLowerCase();
    const ranked = this.ragKnowledgeBase.map(item => {
      let score = 0.65;
      if (qLower.includes("agent") || qLower.includes("swarm") || qLower.includes("crew")) {
        if (item.id === 1) score = 0.96;
        if (item.id === 2) score = 0.81;
      } else if (qLower.includes("vector") || qLower.includes("pinecone") || qLower.includes("embed")) {
        if (item.id === 2) score = 0.98;
        if (item.id === 1) score = 0.76;
      } else if (qLower.includes("vibe") || qLower.includes("cursor") || qLower.includes("lovable")) {
        if (item.id === 3) score = 0.97;
      } else {
        if (item.id === 4) score = 0.94;
      }
      return { ...item, score };
    }).sort((a, b) => b.score - a.score);

    if (resultsContainer) {
      resultsContainer.innerHTML = ranked.map((r, i) => `
        <div class="lab-rag-card ${i === 0 ? 'top-match' : ''}">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div style="font-weight:700; color:#0f172a; font-size:0.9rem;">
              <i class="fas fa-file-alt" style="color:var(--neon-cyan); margin-right:6px;"></i> Chunk #${r.id}: ${r.title}
            </div>
            <span class="status-badge ${r.score > 0.9 ? 'status-confirmed' : 'status-payment'}" style="font-size:0.75rem; font-family:var(--font-mono);">
              Similarity: ${(r.score * 100).toFixed(1)}%
            </span>
          </div>
          <p style="font-size:0.825rem; color:#475569; line-height:1.5; margin-bottom:8px;">${r.text}</p>
          <div style="font-size:0.725rem; color:#64748b; font-family:var(--font-mono);">
            Accredited Track: <strong style="color:#0284c7;">${r.track}</strong>
          </div>
        </div>
      `).join('');
    }

    if (promptInjection) {
      const topMatch = ranked[0];
      promptInjection.textContent = `### SYSTEM INJECTED AUGMENTATION (RAG CONTEXT):
Source: ${topMatch.title} (Cosine Score: ${(topMatch.score * 100).toFixed(1)}%)
Context Snippet: "${topMatch.text}"

### USER QUESTION:
"${query}"

### SYNTHESIZED LLM GROUNDED ANSWER:
Based on official curriculum standards, ${topMatch.text.toLowerCase()} This architecture is implemented and scaled in ${topMatch.track}.`;
    }
  }
};
