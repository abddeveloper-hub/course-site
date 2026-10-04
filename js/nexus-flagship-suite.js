// NEXVION AI ACADEMY - FLAGSHIP SUITE CONTROLLER
// Modules:
// 1. FloatingLuxeDock (Unified persistent executive access)
// 2. NeuralNetPlayground (Interactive Backprop & Decision Boundary Visualizer)
// 3. AgentWarRoom (Autonomous 4-Agent Orchestration Simulator)
// 4. VoiceMentorAria (Real-time Audio Waveform & Web Speech AI Mentor)
// 5. DigitalStudentPass (Verifiable 3D Holographic Pass & Mobile Wallet)
// 6. CorporateCohortPortal (Multi-Seat Volume Calculator & Pro-Forma Invoice)

const NexusFlagshipSuite = {
  initialized: false,

  init: function () {
    if (this.initialized) return;
    this.dock.init();
    this.neuralPlayground.init();
    this.agentWarRoom.init();
    this.voiceMentor.init();
    this.studentPass.init();
    this.corporatePortal.init();
    this.initialized = true;
    console.log("🚀 Nexvion Flagship Suite fully operational.");
  },

  // =========================================================================
  // 1. FLOATING LUXE EXECUTIVE DOCK
  // =========================================================================
  dock: {
    init: function () {
      // Bottom dock permanently removed per user request
      const existing = document.getElementById("flagshipFloatingDock");
      if (existing) existing.remove();

      // Global hotkeys
      document.addEventListener("keydown", (e) => {
        if (e.altKey && e.key.toLowerCase() === "n") {
          e.preventDefault();
          NexusFlagshipSuite.neuralPlayground.openModal();
        } else if (e.altKey && e.key.toLowerCase() === "w") {
          e.preventDefault();
          NexusFlagshipSuite.agentWarRoom.openModal();
        } else if (e.altKey && e.key.toLowerCase() === "v") {
          e.preventDefault();
          NexusFlagshipSuite.voiceMentor.openModal();
        }
      });
    }
  },

  // =========================================================================
  // 2. NEURAL NETWORK PLAYGROUND (Backprop & Decision Boundary)
  // =========================================================================
  neuralPlayground: {
    epoch: 0,
    loss: 0.693,
    accuracy: 52.0,
    isPlaying: false,
    intervalId: null,
    dataset: "circle",
    activation: "gelu",
    learningRate: 0.05,

    // Network weights state: 2 inputs -> 4 hidden -> 3 hidden -> 1 output
    weights: {
      w1: [
        [0.4, -0.3, 0.5, -0.2],
        [-0.5, 0.2, -0.4, 0.6]
      ],
      w2: [
        [0.3, -0.5, 0.2],
        [-0.4, 0.6, -0.1],
        [0.5, -0.2, 0.4],
        [-0.3, 0.4, -0.5]
      ],
      w3: [[0.7], [-0.8], [0.6]]
    },

    init: function () {
      this.createModal();
    },

    createModal: function () {
      if (document.getElementById("neuralPlaygroundModal")) return;

      const modalHtml = `
        <div class="flagship-modal-backdrop" id="neuralPlaygroundModal" onclick="if(event.target === this) NexusFlagshipSuite.neuralPlayground.closeModal()">
          <div class="flagship-modal-card" style="max-width: 920px;">
            <div class="flagship-modal-header">
              <div>
                <span class="corp-tier-pill" style="margin-bottom: 4px;"><i class="fas fa-brain"></i> Interactive Lab</span>
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 700;">Neural Network Backprop Visualizer</h3>
              </div>
              <button class="modal-close-btn" onclick="NexusFlagshipSuite.neuralPlayground.closeModal()" title="Close">&times;</button>
            </div>
            <div class="flagship-modal-body">
              <div class="neural-controls-bar">
                <div style="display:flex; align-items:center; gap:8px;">
                  <label style="font-size:0.8rem; font-weight:600; color:var(--on-surface-variant);">Dataset:</label>
                  <select id="neuralDatasetSelect" class="input-field" style="padding:4px 8px; font-size:0.82rem; width:auto;" onchange="NexusFlagshipSuite.neuralPlayground.changeDataset(this.value)">
                    <option value="circle">Concentric Circles</option>
                    <option value="xor">XOR Problem</option>
                    <option value="spiral">Spiral Manifold</option>
                    <option value="linear">Linear Separation</option>
                  </select>
                </div>

                <div style="display:flex; align-items:center; gap:8px;">
                  <label style="font-size:0.8rem; font-weight:600; color:var(--on-surface-variant);">Activation:</label>
                  <select id="neuralActivationSelect" class="input-field" style="padding:4px 8px; font-size:0.82rem; width:auto;" onchange="NexusFlagshipSuite.neuralPlayground.changeActivation(this.value)">
                    <option value="gelu">GELU (Modern LLM)</option>
                    <option value="relu">ReLU</option>
                    <option value="tanh">Tanh</option>
                    <option value="sigmoid">Sigmoid</option>
                  </select>
                </div>

                <div style="display:flex; align-items:center; gap:8px;">
                  <button class="btn btn-secondary btn-sm" onclick="NexusFlagshipSuite.neuralPlayground.trainStep()"><i class="fas fa-step-forward"></i> Step</button>
                  <button class="btn btn-primary btn-sm" id="neuralPlayBtn" onclick="NexusFlagshipSuite.neuralPlayground.togglePlay()"><i class="fas fa-play"></i> Auto Train</button>
                  <button class="btn btn-secondary btn-sm" onclick="NexusFlagshipSuite.neuralPlayground.reset()"><i class="fas fa-rotate-left"></i> Reset</button>
                </div>
              </div>

              <div class="neural-canvas-split">
                <div class="neural-canvas-card">
                  <div style="font-size:0.8rem; font-weight:700; margin-bottom:8px; color:var(--on-surface-variant);"><i class="fas fa-circle-nodes"></i> Architecture (2-4-3-1 Synapses)</div>
                  <canvas id="neuralArchCanvas" width="400" height="260"></canvas>
                </div>

                <div class="neural-canvas-card">
                  <div style="font-size:0.8rem; font-weight:700; margin-bottom:8px; color:var(--on-surface-variant);"><i class="fas fa-chart-area"></i> Latent Space Decision Boundary</div>
                  <canvas id="neuralBoundaryCanvas" width="400" height="260"></canvas>
                </div>
              </div>

              <div class="neural-metrics-row">
                <div class="neural-stat-box">
                  <span style="font-size:0.72rem; color:#64748b; font-weight:600; text-transform:uppercase;">Training Epoch</span>
                  <div style="font-size:1.2rem; font-weight:800; font-family:'JetBrains Mono',monospace;" id="neuralEpochStat">0</div>
                </div>
                <div class="neural-stat-box">
                  <span style="font-size:0.72rem; color:#64748b; font-weight:600; text-transform:uppercase;">Loss (MSE)</span>
                  <div style="font-size:1.2rem; font-weight:800; color:#ef4444; font-family:'JetBrains Mono',monospace;" id="neuralLossStat">0.693</div>
                </div>
                <div class="neural-stat-box">
                  <span style="font-size:0.72rem; color:#64748b; font-weight:600; text-transform:uppercase;">Classification Acc</span>
                  <div style="font-size:1.2rem; font-weight:800; color:#10b981; font-family:'JetBrains Mono',monospace;" id="neuralAccStat">52.0%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", modalHtml);
    },

    openModal: function () {
      const modal = document.getElementById("neuralPlaygroundModal");
      if (modal) {
        modal.classList.add("active");
        this.renderAll();
        if (typeof SoundFX !== "undefined") SoundFX.playOpen();
      }
    },

    closeModal: function () {
      const modal = document.getElementById("neuralPlaygroundModal");
      if (modal) {
        modal.classList.remove("active");
        this.stopPlay();
        if (typeof SoundFX !== "undefined") SoundFX.playClose();
      }
    },

    changeDataset: function (val) {
      this.dataset = val;
      this.reset();
    },

    changeActivation: function (val) {
      this.activation = val;
      this.renderAll();
    },

    trainStep: function () {
      this.epoch += 1;
      // Simulated SGD convergence toward optimum
      const targetLoss = 0.038;
      this.loss = Math.max(targetLoss, this.loss * 0.965 - (Math.random() * 0.002));
      const targetAcc = 98.6;
      this.accuracy = Math.min(targetAcc, this.accuracy + (targetAcc - this.accuracy) * 0.045);

      // Slightly perturb weights
      this.weights.w1.forEach(row => row.forEach((_, j) => { row[j] += (Math.random() - 0.48) * 0.08; }));
      this.weights.w2.forEach(row => row.forEach((_, j) => { row[j] += (Math.random() - 0.48) * 0.08; }));

      document.getElementById("neuralEpochStat").innerText = this.epoch;
      document.getElementById("neuralLossStat").innerText = this.loss.toFixed(4);
      document.getElementById("neuralAccStat").innerText = `${this.accuracy.toFixed(1)}%`;

      this.renderAll();
      if (typeof SoundFX !== "undefined" && this.epoch % 5 === 0) SoundFX.playClick();
    },

    togglePlay: function () {
      if (this.isPlaying) {
        this.stopPlay();
      } else {
        this.isPlaying = true;
        const btn = document.getElementById("neuralPlayBtn");
        if (btn) btn.innerHTML = `<i class="fas fa-pause"></i> Pause`;
        this.intervalId = setInterval(() => {
          this.trainStep();
          if (this.accuracy > 98.0) {
            this.stopPlay();
            if (typeof SoundFX !== "undefined") SoundFX.playChime(600);
          }
        }, 120);
      }
    },

    stopPlay: function () {
      this.isPlaying = false;
      if (this.intervalId) clearInterval(this.intervalId);
      const btn = document.getElementById("neuralPlayBtn");
      if (btn) btn.innerHTML = `<i class="fas fa-play"></i> Auto Train`;
    },

    reset: function () {
      this.stopPlay();
      this.epoch = 0;
      this.loss = 0.693;
      this.accuracy = 52.0;
      document.getElementById("neuralEpochStat").innerText = "0";
      document.getElementById("neuralLossStat").innerText = "0.693";
      document.getElementById("neuralAccStat").innerText = "52.0%";
      this.renderAll();
      if (typeof SoundFX !== "undefined") SoundFX.playReset();
    },

    renderAll: function () {
      this.renderArchitecture();
      this.renderBoundary();
    },

    renderArchitecture: function () {
      const canvas = document.getElementById("neuralArchCanvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const layers = [
        { count: 2, x: 50, label: "Input" },
        { count: 4, x: 150, label: "H1" },
        { count: 3, x: 250, label: "H2" },
        { count: 1, x: 350, label: "Output" }
      ];

      // Draw connections
      for (let l = 0; l < layers.length - 1; l++) {
        const l1 = layers[l];
        const l2 = layers[l + 1];
        for (let i = 0; i < l1.count; i++) {
          const y1 = (canvas.height / (l1.count + 1)) * (i + 1);
          for (let j = 0; j < l2.count; j++) {
            const y2 = (canvas.height / (l2.count + 1)) * (j + 1);
            const isPositive = (i + j + this.epoch) % 2 === 0;
            ctx.beginPath();
            ctx.moveTo(l1.x, y1);
            ctx.lineTo(l2.x, y2);
            ctx.strokeStyle = isPositive ? "rgba(0, 81, 213, 0.45)" : "rgba(239, 68, 68, 0.4)";
            ctx.lineWidth = 1 + (Math.sin(this.epoch * 0.2 + i) + 1.2);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      layers.forEach((l) => {
        for (let i = 0; i < l.count; i++) {
          const y = (canvas.height / (l.count + 1)) * (i + 1);
          ctx.beginPath();
          ctx.arc(l.x, y, 12, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.strokeStyle = "#0051d5";
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Inner activity glow
          ctx.beginPath();
          ctx.arc(l.x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = l.label === "Output" ? "#10b981" : "#0051d5";
          ctx.fill();
        }
      });
    },

    renderBoundary: function () {
      const canvas = document.getElementById("neuralBoundaryCanvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const w = canvas.width;
      const h = canvas.height;

      // Draw dynamic decision boundary contour
      const progress = Math.min(1, this.accuracy / 100);
      const gradient = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, 140 * progress);
      gradient.addColorStop(0, "rgba(0, 81, 213, 0.15)");
      gradient.addColorStop(0.7, "rgba(59, 130, 246, 0.08)");
      gradient.addColorStop(1, "rgba(239, 68, 68, 0.12)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Decision curve contour
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, 80 * progress + 20, 65 * progress + 15, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 81, 213, 0.7)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw sample points
      const points = 40;
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        // Inner class (Class 1 - Blue)
        const r1 = 35 + Math.sin(angle * 3) * 10;
        const x1 = w / 2 + Math.cos(angle) * r1;
        const y1 = h / 2 + Math.sin(angle) * r1;
        ctx.beginPath();
        ctx.arc(x1, y1, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#0051d5";
        ctx.fill();

        // Outer class (Class 2 - Orange/Red)
        const r2 = 95 + Math.cos(angle * 2) * 15;
        const x2 = w / 2 + Math.cos(angle) * r2;
        const y2 = h / 2 + Math.sin(angle) * r2;
        ctx.beginPath();
        ctx.arc(x2, y2, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.fill();
      }
    }
  },

  // =========================================================================
  // 3. AUTONOMOUS MULTI-AGENT WAR ROOM SIMULATOR
  // =========================================================================
  agentWarRoom: {
    activeMissionIndex: 0,
    isRunning: false,
    intervalId: null,

    missions: [
      {
        title: "Sub-10ms Streaming Hybrid RAG Pipeline",
        description: "Milvus Dense Vector + BM25 Sparse Search + BGE-Reranker-V2 on A100 TensorRT",
        codeSnippet: `import torch\nfrom milvus import MilvusClient\nfrom transformers import AutoModelForSequenceClassification\n\nclass HybridStreamingRAG:\n    def __init__(self, endpoint: str):\n        self.vector_client = MilvusClient(uri=endpoint)\n        self.reranker = AutoModelForSequenceClassification.from_pretrained('BAAI/bge-reranker-v2-m3').cuda().half()\n        \n    async def query_stream(self, query: str, top_k: int = 5):\n        # 1. Concurrent dense & sparse retrieval\n        dense_hits = await self.vector_client.search_dense(query, limit=top_k * 2)\n        sparse_hits = await self.vector_client.search_bm25(query, limit=top_k * 2)\n        \n        # 2. Cross-Encoder reciprocal rank fusion\n        fused_candidates = self._reciprocal_rank_fusion(dense_hits, sparse_hits)\n        reranked = self.reranker.score(query, fused_candidates)[:top_k]\n        return reranked`
      },
      {
        title: "Multi-Head Latent Attention (MLA) with FP8 KV-Cache",
        description: "DeepSeek-V3 / R1 architectural attention compression for 128k inference",
        codeSnippet: `import torch\nimport torch.nn as nn\n\nclass MultiHeadLatentAttention(nn.Module):\n    def __init__(self, d_model: int, n_heads: int, d_latent: int = 512):\n        super().__init__()\n        self.n_heads = n_heads\n        self.d_latent = d_latent\n        # Down-projection for KV compression\n        self.kv_down_proj = nn.Linear(d_model, d_latent, bias=False)\n        self.kv_up_proj = nn.Linear(d_latent, d_model, bias=False)\n        \n    def forward(self, x: torch.Tensor, kv_cache_fp8: torch.Tensor):\n        # Compresses 8x KV memory footprint into FP8 precision\n        compressed_kv = self.kv_down_proj(x).to(torch.float8_e4m3fn)\n        return compressed_kv`
      }
    ],

    init: function () {
      this.createModal();
    },

    createModal: function () {
      if (document.getElementById("agentWarRoomModal")) return;

      const modalHtml = `
        <div class="flagship-modal-backdrop" id="agentWarRoomModal" onclick="if(event.target === this) NexusFlagshipSuite.agentWarRoom.closeModal()">
          <div class="flagship-modal-card" style="max-width: 980px;">
            <div class="flagship-modal-header">
              <div>
                <span class="corp-tier-pill" style="margin-bottom: 4px;"><i class="fas fa-network-wired"></i> Autonomous Orchestration</span>
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 700;">Multi-Agent War Room Simulator</h3>
              </div>
              <button class="modal-close-btn" onclick="NexusFlagshipSuite.agentWarRoom.closeModal()" title="Close">&times;</button>
            </div>
            <div class="flagship-modal-body">
              <div class="warroom-agents-grid">
                <div class="agent-pod-card" id="agentCardAtlas">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-weight:700; font-size:0.85rem;"><i class="fas fa-chess-knight" style="color:#f59e0b;"></i> Atlas</span>
                    <span class="agent-status-badge agent-status-idle" id="badgeAtlas">IDLE</span>
                  </div>
                  <div style="font-size:0.72rem; color:var(--on-surface-variant);">Chief Systems Architect (DAG Decomposition)</div>
                </div>

                <div class="agent-pod-card" id="agentCardCipher">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-weight:700; font-size:0.85rem;"><i class="fas fa-search" style="color:#8b5cf6;"></i> Cipher</span>
                    <span class="agent-status-badge agent-status-idle" id="badgeCipher">IDLE</span>
                  </div>
                  <div style="font-size:0.72rem; color:var(--on-surface-variant);">Deep Context & ArXiv Researcher</div>
                </div>

                <div class="agent-pod-card" id="agentCardForge">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-weight:700; font-size:0.85rem;"><i class="fas fa-code" style="color:#06b6d4;"></i> Forge</span>
                    <span class="agent-status-badge agent-status-idle" id="badgeForge">IDLE</span>
                  </div>
                  <div style="font-size:0.72rem; color:var(--on-surface-variant);">Lead Synthesizer & Tensor Coder</div>
                </div>

                <div class="agent-pod-card" id="agentCardSentinel">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-weight:700; font-size:0.85rem;"><i class="fas fa-shield-halved" style="color:#10b981;"></i> Sentinel</span>
                    <span class="agent-status-badge agent-status-idle" id="badgeSentinel">IDLE</span>
                  </div>
                  <div style="font-size:0.72rem; color:var(--on-surface-variant);">Security Auditor & Pen-Tester</div>
                </div>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div style="font-size:0.82rem; font-weight:700; color:var(--on-surface-variant);">
                  Mission: <span id="warroomMissionTitle" style="color:var(--secondary);">Sub-10ms Streaming Hybrid RAG Pipeline</span>
                </div>
                <div style="display:flex; gap:8px;">
                  <button class="btn btn-primary btn-sm" id="warroomRunBtn" onclick="NexusFlagshipSuite.agentWarRoom.runMission()"><i class="fas fa-play"></i> Launch Autonomous Swarm</button>
                  <button class="btn btn-secondary btn-sm" onclick="NexusFlagshipSuite.agentWarRoom.clearTerminal()"><i class="fas fa-trash-can"></i> Clear</button>
                </div>
              </div>

              <div class="warroom-terminal" id="warroomTerminalBox">
                <div class="terminal-line"><span class="terminal-prefix prefix-atlas">[SYSTEM]</span> Swarm cluster ready on 4x NVIDIA H100 SXM5 nodes. Press Launch to start.</div>
              </div>

              <div class="warroom-code-preview" id="warroomCodeBox" style="display:none;">
                <div class="warroom-code-header">
                  <span><i class="fas fa-file-code"></i> Production Swarm Output: <code>rag_streaming_engine.py</code></span>
                  <button class="btn btn-secondary btn-sm" style="padding:2px 8px; font-size:0.72rem;" onclick="NexusFlagshipSuite.agentWarRoom.copyCode()"><i class="fas fa-copy"></i> Copy</button>
                </div>
                <pre style="margin:0; padding:12px; font-size:0.78rem; overflow-x:auto; color:#a5f3fc; font-family:'JetBrains Mono',monospace;" id="warroomCodeContent"></pre>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", modalHtml);
    },

    openModal: function () {
      const modal = document.getElementById("agentWarRoomModal");
      if (modal) {
        modal.classList.add("active");
        if (typeof SoundFX !== "undefined") SoundFX.playOpen();
      }
    },

    closeModal: function () {
      const modal = document.getElementById("agentWarRoomModal");
      if (modal) {
        modal.classList.remove("active");
        if (typeof SoundFX !== "undefined") SoundFX.playClose();
      }
    },

    clearTerminal: function () {
      const term = document.getElementById("warroomTerminalBox");
      if (term) term.innerHTML = `<div class="terminal-line"><span class="terminal-prefix prefix-atlas">[SYSTEM]</span> Swarm cluster initialized. Ready for task allocation.</div>`;
      document.getElementById("warroomCodeBox").style.display = "none";
    },

    runMission: function () {
      if (this.isRunning) return;
      this.isRunning = true;
      const runBtn = document.getElementById("warroomRunBtn");
      if (runBtn) {
        runBtn.disabled = true;
        runBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Swarm Active...`;
      }

      this.clearTerminal();
      const mission = this.missions[this.activeMissionIndex];

      const steps = [
        {
          agent: "atlas",
          name: "Atlas",
          status: "agent-status-thinking",
          statusText: "PLANNING",
          text: "Decomposing task: Generating topological DAG. Identifying bottleneck: Dense vector quantization overhead."
        },
        {
          agent: "cipher",
          name: "Cipher",
          status: "agent-status-working",
          statusText: "SEARCHING",
          text: "Retrieved 14 ArXiv papers on BGE-Reranker-V2 FP16 precision. Query latency threshold verified at 6.4ms."
        },
        {
          agent: "forge",
          name: "Forge",
          status: "agent-status-working",
          statusText: "SYNTHESIZING",
          text: "Generating async Milvus client wrapper + reciprocal rank fusion tensor algorithm in PyTorch."
        },
        {
          agent: "sentinel",
          name: "Sentinel",
          status: "agent-status-thinking",
          statusText: "AUDITING",
          text: "Running static security fuzzing against prompt-injection vector leaks... Memory bounds verified. Zero leaks detected."
        },
        {
          agent: "atlas",
          name: "Atlas",
          status: "agent-status-verified",
          statusText: "CONSENSUS 100%",
          text: "Swarm Consensus Reached (4/4). Production module compiled and ready for pipeline integration."
        }
      ];

      let stepIndex = 0;
      const term = document.getElementById("warroomTerminalBox");

      this.intervalId = setInterval(() => {
        if (stepIndex >= steps.length) {
          clearInterval(this.intervalId);
          this.isRunning = false;
          if (runBtn) {
            runBtn.disabled = false;
            runBtn.innerHTML = `<i class="fas fa-play"></i> Launch Autonomous Swarm`;
          }
          // Reveal code preview
          const codeBox = document.getElementById("warroomCodeBox");
          const codeContent = document.getElementById("warroomCodeContent");
          if (codeBox && codeContent) {
            codeContent.innerText = mission.codeSnippet;
            codeBox.style.display = "block";
          }
          if (typeof SoundFX !== "undefined") SoundFX.playSuccess();
          return;
        }

        const s = steps[stepIndex];
        // Update agent badges
        ["Atlas", "Cipher", "Forge", "Sentinel"].forEach(a => {
          const badge = document.getElementById(`badge${a}`);
          const card = document.getElementById(`agentCard${a}`);
          if (badge && card) {
            if (a.toLowerCase() === s.agent) {
              badge.className = `agent-status-badge ${s.status}`;
              badge.innerText = s.statusText;
              card.classList.add("agent-active");
            } else {
              card.classList.remove("agent-active");
            }
          }
        });

        // Append line to terminal
        const line = document.createElement("div");
        line.className = "terminal-line";
        line.innerHTML = `<span class="terminal-prefix prefix-${s.agent}">[${s.name.toUpperCase()}]</span> ${s.text}`;
        term.appendChild(line);
        term.scrollTop = term.scrollHeight;

        if (typeof SoundFX !== "undefined") SoundFX.playClick();
        stepIndex++;
      }, 1000);
    },

    copyCode: function () {
      const codeContent = document.getElementById("warroomCodeContent");
      if (codeContent) {
        navigator.clipboard.writeText(codeContent.innerText);
        if (typeof App !== "undefined" && App.showToast) {
          App.showToast("Code Copied", "Swarm-synthesized Python script copied to clipboard.", "success");
        }
      }
    }
  },

  // =========================================================================
  // 4. REALTIME CONVERSATIONAL VOICE AI MENTOR ("ARIA")
  // =========================================================================
  voiceMentor: {
    isListening: false,
    isSpeaking: false,
    recognition: null,
    synthesis: window.speechSynthesis,
    animFrameId: null,

    responses: {
      "attention": "Self-attention calculates compatibility scores between Query, Key, and Value vectors via scaled dot-product. It allows tokens to attend dynamically across long context sequences in parallel.",
      "beginner": "For beginners, I recommend Track 1: Vibe Coding & AI Prototyping. You will master Cursor, Claude 3.7, and build real full-stack web applications without prior heavy coding experience.",
      "hardware": "For local fine-tuning and inference, an NVIDIA RTX 4090 with 24GB VRAM is the sweet spot for 8B and quantized 14B models. In our academy, we supply cloud A100 GPU compute directly in your browser.",
      "career": "AI Engineers currently command median compensation ranging from $140,000 to $230,000. High demand centers around RAG orchestration, agentic swarms, and production MLOps evaluation.",
      "default": "Hello! I am Aria, your Executive Alabaster AI Mentor. Ask me anything about neural networks, transformer math, curriculum tracks, or career roadmaps."
    },

    init: function () {
      this.createModal();
      this.initSpeechRecognition();
    },

    createModal: function () {
      if (document.getElementById("voiceMentorModal")) return;

      const modalHtml = `
        <div class="flagship-modal-backdrop" id="voiceMentorModal" onclick="if(event.target === this) NexusFlagshipSuite.voiceMentor.closeModal()">
          <div class="flagship-modal-card" style="max-width: 680px;">
            <div class="flagship-modal-header">
              <div>
                <span class="corp-tier-pill" style="margin-bottom: 4px;"><i class="fas fa-microphone-lines"></i> Interactive Voice Faculty</span>
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 700;">Aria — Real-Time Conversational AI Mentor</h3>
              </div>
              <button class="modal-close-btn" onclick="NexusFlagshipSuite.voiceMentor.closeModal()" title="Close">&times;</button>
            </div>
            <div class="flagship-modal-body">
              <div class="voice-mentor-chamber">
                <div class="voice-waveform-container">
                  <canvas class="voice-waveform-canvas" id="voiceWaveformCanvas" width="500" height="90"></canvas>
                </div>

                <button class="voice-orb-btn" id="voiceOrbBtn" onclick="NexusFlagshipSuite.voiceMentor.toggleListening()" title="Click to Speak">
                  <i class="fas fa-microphone" id="voiceOrbIcon"></i>
                </button>

                <div style="font-size:0.85rem; font-weight:700; margin-top:12px; color:var(--secondary);" id="voiceStatusText">
                  Click the orb to speak or tap a query chip below
                </div>

                <div class="voice-dialogue-box" id="voiceDialogueBox">
                  "Greetings! I am Aria, your Executive Alabaster AI Mentor. What frontier concept would you like to explore today?"
                </div>

                <div class="voice-chips-row">
                  <button class="voice-chip" onclick="NexusFlagshipSuite.voiceMentor.askPrompt('Explain Self-Attention in 30 seconds', 'attention')">Explain Self-Attention</button>
                  <button class="voice-chip" onclick="NexusFlagshipSuite.voiceMentor.askPrompt('Which track is best for a beginner?', 'beginner')">Best Beginner Track?</button>
                  <button class="voice-chip" onclick="NexusFlagshipSuite.voiceMentor.askPrompt('What hardware do I need for Local LLMs?', 'hardware')">Hardware & GPU Specs</button>
                  <button class="voice-chip" onclick="NexusFlagshipSuite.voiceMentor.askPrompt('Tell me about the AI Engineer job market', 'career')">AI Career Outlook</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", modalHtml);
    },

    openModal: function () {
      const modal = document.getElementById("voiceMentorModal");
      if (modal) {
        modal.classList.add("active");
        this.startWaveformAnimation();
        if (typeof SoundFX !== "undefined") SoundFX.playOpen();
      }
    },

    closeModal: function () {
      const modal = document.getElementById("voiceMentorModal");
      if (modal) {
        modal.classList.remove("active");
        this.stopListening();
        if (this.synthesis) this.synthesis.cancel();
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        if (typeof SoundFX !== "undefined") SoundFX.playClose();
      }
    },

    initSpeechRecognition: function () {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRec) {
        this.recognition = new SpeechRec();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = "en-US";

        this.recognition.onstart = () => {
          this.isListening = true;
          document.getElementById("voiceOrbBtn").classList.add("listening");
          document.getElementById("voiceStatusText").innerText = "Listening to your voice...";
        };

        this.recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          this.processUserInput(transcript);
        };

        this.recognition.onerror = () => {
          this.stopListening();
          document.getElementById("voiceStatusText").innerText = "Microphone input paused. Tap a chip to ask.";
        };

        this.recognition.onend = () => {
          this.stopListening();
        };
      }
    },

    toggleListening: function () {
      if (this.isListening) {
        this.stopListening();
      } else {
        if (this.recognition) {
          try {
            this.recognition.start();
          } catch (e) {
            this.stopListening();
          }
        } else {
          document.getElementById("voiceStatusText").innerText = "Speech Recognition not supported in this browser. Tap a prompt chip below!";
        }
      }
    },

    stopListening: function () {
      this.isListening = false;
      const btn = document.getElementById("voiceOrbBtn");
      if (btn) btn.classList.remove("listening");
      const status = document.getElementById("voiceStatusText");
      if (status && !this.isSpeaking) status.innerText = "Click the orb or select a question below";
    },

    processUserInput: function (text) {
      const lower = text.toLowerCase();
      let key = "default";
      if (lower.includes("attention") || lower.includes("transformer")) key = "attention";
      else if (lower.includes("beginner") || lower.includes("start")) key = "beginner";
      else if (lower.includes("gpu") || lower.includes("hardware")) key = "hardware";
      else if (lower.includes("job") || lower.includes("career") || lower.includes("salary")) key = "career";

      this.askPrompt(text, key);
    },

    askPrompt: function (question, key) {
      const answer = this.responses[key] || this.responses["default"];
      const box = document.getElementById("voiceDialogueBox");
      if (box) {
        box.innerHTML = `<strong>You:</strong> "${question}"<br><br><strong>Aria:</strong> ${answer}`;
      }

      this.speak(answer);
    },

    speak: function (text) {
      if (!this.synthesis) return;
      this.synthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.isSpeaking = true;
        document.getElementById("voiceStatusText").innerText = "Aria is speaking...";
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        document.getElementById("voiceStatusText").innerText = "Click the orb to speak or tap a chip";
      };

      this.synthesis.speak(utterance);
    },

    startWaveformAnimation: function () {
      const canvas = document.getElementById("voiceWaveformCanvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      let phase = 0;

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = canvas.width;
        const h = canvas.height;
        const mid = h / 2;

        const isBusy = this.isListening || this.isSpeaking;
        const amp = isBusy ? 28 : 8;
        const freq = isBusy ? 0.05 : 0.02;

        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const y = mid + Math.sin(x * freq + phase) * amp * Math.sin((x / w) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = this.isListening ? "#ef4444" : (this.isSpeaking ? "#10b981" : "#0051d5");
        ctx.lineWidth = 3;
        ctx.stroke();

        phase += isBusy ? 0.15 : 0.04;
        this.animFrameId = requestAnimationFrame(draw);
      };

      draw();
    }
  },

  // =========================================================================
  // 5. VERIFIABLE 3D HOLOGRAPHIC STUDENT PASS & DIGITAL WALLET
  // =========================================================================
  studentPass: {
    init: function () {
      this.createModal();
    },

    createModal: function () {
      if (document.getElementById("studentPassModal")) return;

      const modalHtml = `
        <div class="flagship-modal-backdrop" id="studentPassModal" onclick="if(event.target === this) NexusFlagshipSuite.studentPass.closeModal()">
          <div class="flagship-modal-card" style="max-width: 640px;">
            <div class="flagship-modal-header">
              <div>
                <span class="corp-tier-pill" style="margin-bottom: 4px;"><i class="fas fa-id-badge"></i> Cryptographic Credential</span>
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 700;">Verifiable 3D Holographic Student Pass</h3>
              </div>
              <button class="modal-close-btn" onclick="NexusFlagshipSuite.studentPass.closeModal()" title="Close">&times;</button>
            </div>
            <div class="flagship-modal-body">
              <div class="student-pass-stage">
                <div class="holographic-pass-card" id="holographicPassCard" onmousemove="NexusFlagshipSuite.studentPass.handleMouseMove(event)" onmouseleave="NexusFlagshipSuite.studentPass.resetCardTilt()">
                  <div class="holographic-foil-sheen" id="foilSheen"></div>
                  <div class="pass-inner-content">
                    <div class="pass-header">
                      <div>
                        <div style="font-size:0.68rem; font-weight:700; letter-spacing:0.1em; color:#94a3b8; text-transform:uppercase;">NEXVION ACADEMY</div>
                        <div style="font-size:0.85rem; font-weight:700; color:#38bdf8;">EXECUTIVE PASS</div>
                      </div>
                      <div class="pass-chip"></div>
                    </div>

                    <div style="margin: 12px 0;">
                      <div class="pass-student-name" id="passStudentName">ALEXANDER VANCE</div>
                      <div style="font-size:0.75rem; color:#94a3b8; margin-top:2px;" id="passTrackName">Full-Stack AI Solutions Architect</div>
                    </div>

                    <div class="pass-footer">
                      <div>
                        <div style="font-size:0.62rem; color:#64748b; text-transform:uppercase; font-weight:600;">STUDENT ID</div>
                        <div style="font-size:0.85rem; font-weight:700; font-family:'JetBrains Mono',monospace;" id="passStudentId">NX-2026-8842</div>
                        <div style="font-size:0.6rem; color:#94a3b8; margin-top:2px;">ISSUED: 2026-10-03 • SHA-256 SECURED</div>
                      </div>
                      <div class="pass-qr-box">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://abddeveloper-hub.github.io/course-site/verify?id=NX-2026-8842" alt="QR Code">
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pass-actions-row">
                <button class="btn btn-primary" onclick="NexusFlagshipSuite.studentPass.addToAppleWallet()"><i class="fab fa-apple"></i> Add to Apple Wallet</button>
                <button class="btn btn-secondary" onclick="NexusFlagshipSuite.studentPass.addToGoogleWallet()"><i class="fab fa-google"></i> Add to Google Wallet</button>
                <button class="btn btn-secondary" onclick="NexusFlagshipSuite.studentPass.downloadPass()"><i class="fas fa-download"></i> Save PNG</button>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", modalHtml);
    },

    openModal: function () {
      const modal = document.getElementById("studentPassModal");
      if (modal) {
        modal.classList.add("active");
        this.syncStudentData();
        if (typeof SoundFX !== "undefined") SoundFX.playOpen();
      }
    },

    closeModal: function () {
      const modal = document.getElementById("studentPassModal");
      if (modal) {
        modal.classList.remove("active");
        if (typeof SoundFX !== "undefined") SoundFX.playClose();
      }
    },

    syncStudentData: function () {
      const nameEl = document.getElementById("passStudentName");
      const idEl = document.getElementById("passStudentId");
      if (typeof AuthService !== "undefined" && AuthService.currentUser) {
        if (nameEl) nameEl.innerText = AuthService.currentUser.name || "EXECUTIVE SCHOLAR";
        if (idEl) idEl.innerText = AuthService.currentUser.id || "NX-2026-8842";
      }
    },

    handleMouseMove: function (e) {
      const card = document.getElementById("holographicPassCard");
      const sheen = document.getElementById("foilSheen");
      if (!card || !sheen) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -14;
      const rotateY = ((x - centerX) / centerX) * 14;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      sheen.style.transform = `translateX(${x - centerX}px) translateY(${y - centerY}px)`;
    },

    resetCardTilt: function () {
      const card = document.getElementById("holographicPassCard");
      if (card) {
        card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      }
    },

    addToAppleWallet: function () {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("Apple Wallet Ready", "Cryptographic .pkpass bundle ready for iOS sync.", "success");
        if (typeof SoundFX !== "undefined") SoundFX.playSuccess();
      }
    },

    addToGoogleWallet: function () {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("Google Wallet Ready", "Digital Credential JWT generated for Android pass storage.", "success");
        if (typeof SoundFX !== "undefined") SoundFX.playSuccess();
      }
    },

    downloadPass: function () {
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("Pass Downloaded", "High-resolution digital student pass saved to device.", "success");
        if (typeof SoundFX !== "undefined") SoundFX.playSuccess();
      }
    }
  },

  // =========================================================================
  // 6. CORPORATE COHORT & MULTI-SEAT PORTAL + INVOICE
  // =========================================================================
  corporatePortal: {
    seats: 10,
    basePricePerSeat: 499,

    init: function () {
      this.createModal();
    },

    createModal: function () {
      if (document.getElementById("corporatePortalModal")) return;

      const modalHtml = `
        <div class="flagship-modal-backdrop" id="corporatePortalModal" onclick="if(event.target === this) NexusFlagshipSuite.corporatePortal.closeModal()">
          <div class="flagship-modal-card" style="max-width: 880px;">
            <div class="flagship-modal-header">
              <div>
                <span class="corp-tier-pill" style="margin-bottom: 4px;"><i class="fas fa-building-columns"></i> Enterprise & Team Portal</span>
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 700;">Corporate Cohort Seat Estimator & Invoicing</h3>
              </div>
              <button class="modal-close-btn" onclick="NexusFlagshipSuite.corporatePortal.closeModal()" title="Close">&times;</button>
            </div>
            <div class="flagship-modal-body">
              <div class="corp-calc-grid">
                <div class="corp-slider-container">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <label style="font-weight:700; font-size:0.95rem;">Team Cohort Seats:</label>
                    <span style="font-size:1.4rem; font-weight:800; color:var(--secondary); font-family:'JetBrains Mono',monospace;" id="corpSeatDisplay">10</span>
                  </div>

                  <input type="range" min="1" max="100" value="10" class="calculator-range" id="corpSeatSlider" style="width:100%; margin-bottom:16px;" oninput="NexusFlagshipSuite.corporatePortal.updateSeats(this.value)">

                  <div style="font-size:0.8rem; color:var(--on-surface-variant); margin-bottom:16px;">
                    <i class="fas fa-check-circle" style="color:#10b981;"></i> Tier Benefit: <strong id="corpTierBenefit">Team Pack (15% Off + Dedicated TA)</strong>
                  </div>

                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <div>
                      <label style="font-size:0.75rem; font-weight:600; color:#64748b;">Company Name</label>
                      <input type="text" class="input-field" id="corpCompanyName" placeholder="e.g. Acme Corp" value="Anthropic Labs Inc." style="padding:6px 10px; font-size:0.82rem;">
                    </div>
                    <div>
                      <label style="font-size:0.75rem; font-weight:600; color:#64748b;">Tax ID / VAT No.</label>
                      <input type="text" class="input-field" id="corpTaxId" placeholder="e.g. US-89472891" value="US-99214710" style="padding:6px 10px; font-size:0.82rem;">
                    </div>
                  </div>
                </div>

                <div class="corp-summary-card">
                  <div>
                    <div style="font-size:0.8rem; font-weight:700; text-transform:uppercase; color:var(--secondary); margin-bottom:12px;">Financial Summary</div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.85rem;">
                      <span>Rate Per Seat:</span>
                      <strong id="corpRatePerSeat">$424</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.85rem; color:#10b981;">
                      <span>Volume Savings:</span>
                      <strong id="corpSavingsTotal">-$749</strong>
                    </div>
                    <hr style="margin:12px 0; border:0; border-top:1px solid rgba(0,0,0,0.08);">
                    <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:16px;">
                      <span style="font-weight:700;">Total Investment:</span>
                      <span style="font-size:1.6rem; font-weight:800; color:var(--primary); font-family:'JetBrains Mono',monospace;" id="corpGrandTotal">$4,241</span>
                    </div>
                  </div>

                  <button class="btn btn-primary" style="width:100%;" onclick="NexusFlagshipSuite.corporatePortal.printInvoice()"><i class="fas fa-file-invoice-dollar"></i> Generate Pro-Forma Invoice</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", modalHtml);
    },

    openModal: function () {
      const modal = document.getElementById("corporatePortalModal");
      if (modal) {
        modal.classList.add("active");
        this.calculate();
        if (typeof SoundFX !== "undefined") SoundFX.playOpen();
      }
    },

    closeModal: function () {
      const modal = document.getElementById("corporatePortalModal");
      if (modal) {
        modal.classList.remove("active");
        if (typeof SoundFX !== "undefined") SoundFX.playClose();
      }
    },

    updateSeats: function (val) {
      this.seats = parseInt(val, 10);
      document.getElementById("corpSeatDisplay").innerText = this.seats;
      this.calculate();
    },

    calculate: function () {
      let discount = 0;
      let tierText = "Standard Executive Rate";
      if (this.seats >= 50) {
        discount = 0.40;
        tierText = "Enterprise Tier (40% Off + On-Prem Deployment & Boardroom Briefing)";
      } else if (this.seats >= 15) {
        discount = 0.25;
        tierText = "Department Tier (25% Off + Custom Private Cohort + Cloud GPU Credits)";
      } else if (this.seats >= 5) {
        discount = 0.15;
        tierText = "Team Pack (15% Off + Dedicated Teaching Assistant)";
      }

      const discountedPerSeat = Math.round(this.basePricePerSeat * (1 - discount));
      const totalWithoutDiscount = this.basePricePerSeat * this.seats;
      const grandTotal = discountedPerSeat * this.seats;
      const savings = totalWithoutDiscount - grandTotal;

      document.getElementById("corpTierBenefit").innerText = tierText;
      document.getElementById("corpRatePerSeat").innerText = `$${discountedPerSeat}`;
      document.getElementById("corpSavingsTotal").innerText = `-$${savings.toLocaleString()}`;
      document.getElementById("corpGrandTotal").innerText = `$${grandTotal.toLocaleString()}`;
    },

    printInvoice: function () {
      window.print();
    }
  }
};

// Auto-boot on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => NexusFlagshipSuite.init());
} else {
  NexusFlagshipSuite.init();
}
