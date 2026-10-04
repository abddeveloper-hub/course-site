// NEXVION AI ACADEMY - Student Hub Portal (Feature 5A)

const StudentHub = {
  countdownInterval: null,

  init: function () {
    this.render();
    this.startLiveCountdown();
  },

  render: function () {
    const student = StorageService.getCurrentStudent();
    const container = document.getElementById("studentHubContent");
    if (!container) return;

    if (!student) {
      container.innerHTML = `
        <div class="glass-panel" style="padding:60px 20px; text-align:center; max-width:600px; margin:0 auto;">
          <i class="fas fa-user-graduate" style="font-size:3.5rem; color:var(--neon-cyan); margin-bottom:20px;"></i>
          <h3 style="font-size:1.6rem; margin-bottom:12px;">No Active Enrollment Found</h3>
          <p style="color:var(--text-muted); margin-bottom:24px;">You haven't registered for an AI course yet. Browse our cutting-edge AI tracks and enroll in just a few minutes!</p>
          <button class="btn btn-primary" onclick="App.showView('register')">
            <i class="fas fa-sparkles"></i> Enroll in AI Course
          </button>
        </div>
      `;
      return;
    }

    // Render Digital ID Card inside the student hub sidebar
    IDCardGenerator.renderCard(student, "hubStudentIdCardSlot");

    // Render Course Video Lectures & Lab Recordings (Feature 5B)
    this.renderCourseVideos(student);

    // Render Milestone Progress Tracker & Certificate Status
    const certProgressCard = document.getElementById("hubCertProgressCard");
    if (certProgressCard) {
      if (student.certificateAllotted) {
        certProgressCard.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
            <h4 style="font-size:1.1rem; color:#0f172a;"><i class="fas fa-award" style="color:#1a73e8; margin-right:8px;"></i> Official Google-Grade AI Certificate</h4>
            <span class="status-badge status-confirmed"><i class="fas fa-check-circle"></i> Issued & Authorized by Admin</span>
          </div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:14px;">Credential Serial: <strong style="color:#1a73e8; font-family:var(--font-mono);">${student.certificateId || "G-NEX-2026"}</strong> &bull; Honors: <strong style="color:#059669;">${student.certificateGrade || "Distinction"}</strong></div>
          <div class="batch-capacity-bar" style="height:10px; margin-bottom:16px;">
            <div class="batch-capacity-fill" style="width: 100%; background:linear-gradient(90deg, #1a73e8, #34a853);"></div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div style="font-size:0.85rem; color:#15803d; font-weight:600;">
              <i class="fas fa-certificate" style="color:#fbbc04; margin-right:6px;"></i> Official Certificate Authorized & Released by Administration
            </div>
            <button class="btn btn-primary btn-sm" onclick="App.openStudentHubCertificate()">
              <i class="fas fa-award"></i> View & Print My Official Certificate
            </button>
          </div>
        `;
      } else {
        certProgressCard.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
            <h4 style="font-size:1.1rem; color:#0f172a;"><i class="fas fa-award" style="color:#1a73e8; margin-right:8px;"></i> Official Google-Grade AI Certificate</h4>
            <span class="status-badge status-pending"><i class="fas fa-clock"></i> Pending Admin Issuance</span>
          </div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:14px;">Enrolled on ${student.registeredAt} &bull; Status: <span style="color:#0284c7; font-weight:700;">Active Cohort Scholar</span></div>
          <div class="batch-capacity-bar" style="height:10px; margin-bottom:16px;">
            <div class="batch-capacity-fill" style="width: 50%; background:linear-gradient(90deg, #0284c7, #f59e0b);"></div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div style="font-size:0.85rem; color:#64748b;">
              <i class="fas fa-info-circle" style="color:#0284c7; margin-right:6px;"></i> Certificate will be authorized and provided by Academy Administration upon Capstone evaluation.
            </div>
            <button class="btn btn-secondary btn-sm" disabled style="opacity:0.75; cursor:not-allowed;" title="Admin has not yet allotted your certificate">
              <i class="fas fa-lock"></i> Pending Admin Issuance
            </button>
          </div>
        `;
      }
    }

    // Render Official Google Professional Certificate inside the student hub (guarded)
    AICertificateGenerator.renderCertificate(student, "hubCertificateEmbedSlot");

    // Render Faculty Mentorship Chat Stream
    if (typeof MessagingPortal !== "undefined") {
      MessagingPortal.renderStudentChat("studentMentorshipChatContainer", student.id);
    }

    // Render Capstone Project Submission & Status Desk
    if (typeof CapstonePortal !== "undefined") {
      CapstonePortal.renderStudentCapstoneDesk("studentCapstoneDeskContainer", student.id);
    }

    // Update Hub Details
    const hubStudentName = document.getElementById("hubStudentName");
    const hubTrackTitle = document.getElementById("hubTrackTitle");
    const hubBatchName = document.getElementById("hubBatchName");
    const hubStatusBadge = document.getElementById("hubStatusBadge");
    const hubEnrolledDate = document.getElementById("hubEnrolledDate");

    if (hubStudentName) hubStudentName.textContent = student.fullName;
    if (hubTrackTitle) hubTrackTitle.textContent = student.trackTitle;
    if (hubBatchName) hubBatchName.textContent = student.batchName;
    if (hubEnrolledDate) hubEnrolledDate.textContent = `Enrolled on ${student.registeredAt}`;

    if (hubStatusBadge) {
      hubStatusBadge.textContent = student.status || "Confirmed";
      hubStatusBadge.className = `status-badge ${
        student.status === "Confirmed"
          ? "status-confirmed"
          : student.status === "Payment Verified"
            ? "status-payment"
            : student.status === "Pending"
              ? "status-pending"
              : "status-waitlisted"
      }`;
    }
  },

  // Live countdown to next class session
  startLiveCountdown: function () {
    if (this.countdownInterval) clearInterval(this.countdownInterval);

    // Target: Upcoming Sunday at 9:00 AM EST (or 2 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(9, 0, 0, 0);

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        document.getElementById("cdDays").textContent = "00";
        document.getElementById("cdHours").textContent = "00";
        document.getElementById("cdMinutes").textContent = "00";
        document.getElementById("cdSeconds").textContent = "00";
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const dEl = document.getElementById("cdDays");
      const hEl = document.getElementById("cdHours");
      const mEl = document.getElementById("cdMinutes");
      const sEl = document.getElementById("cdSeconds");

      if (dEl) dEl.textContent = String(days).padStart(2, "0");
      if (hEl) hEl.textContent = String(hours).padStart(2, "0");
      if (mEl) mEl.textContent = String(minutes).padStart(2, "0");
      if (sEl) sEl.textContent = String(seconds).padStart(2, "0");
    };

    updateTimer();
    this.countdownInterval = setInterval(updateTimer, 1000);
  },

  // Launch mock live classroom
  joinLiveSession: function () {
    const student = StorageService.getCurrentStudent();
    if (!student) return;

    App.showToast(
      "Connecting to Live Class...",
      `Authenticating Student ID: ${student.id}. Launching Zoom / Meet secure room...`,
      "info"
    );

    setTimeout(() => {
      window.open("https://meet.google.com", "_blank");
    }, 1200);
  },

  // Download Starter Resources
  downloadResource: function (type) {
    let title = "";
    let content = "";

    if (type === "syllabus") {
      title = "Nexvion_AI_Complete_Curriculum_Syllabus.txt";
      content = `=====================================================
NEXVION AI ACADEMY - OFFICIAL MASTER CURRICULUM
=====================================================
Track 1: Vibe Coding Softwares & AI-Assisted App Development (AI-101) - Low Tier (₹1,500)
- Week 1: Vibe Coding Setup: Cursor AI, Windsurf & Natural Language Development
- Week 2: AI-Powered UI & App Builders: v0.dev, Lovable & Bolt.new Workflows
- Week 3: Multi-File Project Architecture with Replit Agent & Claude Artifacts
- Week 4: Capstone: Building & Shipping a Live SaaS App Purely via Vibe Coding

Track 2: Cloud Hosting, Deployment & Software Integration (AI-201) - Mid Tier (₹2,500)
- Week 1-2: Cloud Hosting Platforms: Deploying Next.js, React & Node on Vercel & Render
- Week 3-4: Cloud Database Hosting: Supabase, Firebase, Realtime DB & PostgreSQL
- Week 5-6: Custom Domains, SSL, Environment Secrets & Production Security
- Week 7-8: Capstone: Deploying a Scalable Multi-Service Production Web System

Track 3: API Architecture, Backend Services & AI Engine APIs (AI-301) - High Tier (₹3,500)
- Week 1-2: API Fundamentals: JSON Payloads, Headers & Python FastAPI Endpoints
- Week 3-4: Direct AI Engine API Integration (OpenAI, Claude, Gemini & DeepSeek)
- Week 5-7: Vector DB APIs (Pinecone), Webhooks & Third-Party Software Connections
- Week 8-10: Capstone: Building a Production API-Driven AI SaaS Application

Track 4: Advanced AI Architecture, Autonomous Agents & MLOps (AI-401) - Highest Tier (₹5,000)
- Week 1-4: Advanced LLM Architecture, Prompt Optimization & Local Models (Ollama)
- Week 5-8: Enterprise RAG Pipelines & High-Precision Hybrid Search
- Week 9-11: Autonomous Multi-Agent Swarms (CrewAI & LangGraph) in Production
- Week 12-14: Grand Capstone: Full-Scale Autonomous AI Enterprise System & Placement
`;
    } else if (type === "python-guide") {
      title = "Python_and_GPU_Setup_Guide.txt";
      content = `=====================================================
NEXVION AI ACADEMY - PYTHON & GPU SETUP GUIDE
=====================================================
Step 1: Install Python 3.11+
Download from python.org and ensure "Add Python to PATH" is checked.

Step 2: Create a Virtual Environment
$ python -m venv ai_env
$ source ai_env/bin/activate (Mac/Linux) or ai_env\\Scripts\\activate (Windows)

Step 3: Install Essential AI Libraries
$ pip install numpy pandas scikit-learn torch torchvision openai langchain chromadb

Step 4: Verify GPU Acceleration (CUDA)
python -c "import torch; print('CUDA Available:', torch.cuda.is_available())"

Step 5: Access Cloud GPU Lab (A100/H100)
Log in with your Student ID credentials at: https://lab.ainexus.edu
`;
    } else {
      title = "AI_Cheatsheet_and_Tools.txt";
      content = `=====================================================
TOP AI TOOLS & CHEATSHEET 2026
=====================================================
- LLMs: OpenAI GPT-4o, Claude 3.5 Sonnet, Llama 3.1 70B
- Vector Databases: Pinecone, ChromaDB, Weaviate, Qdrant
- Multi-Agent Orchestrators: CrewAI, LangGraph, AutoGen
- Embeddings: text-embedding-3-small, BAAI/bge-large-en
`;
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    App.showToast("Resource Downloaded", `Saved ${title}`, "success");
  },

  activeVideoId: null,

  // Render on-demand course videos & lab recordings
  renderCourseVideos: function (student) {
    const container = document.getElementById("hubCourseVideosSection");
    if (!container) return;

    let allMedia = [];
    if (typeof StorageService !== "undefined" && StorageService.getMedia) {
      allMedia = StorageService.getMedia();
    } else {
      try {
        const raw = localStorage.getItem("nexus_admin_media");
        if (raw) allMedia = JSON.parse(raw);
      } catch (e) {}
    }

    let allVideos = (allMedia || []).filter((m) => m.type === "video");

    if (allVideos.length === 0) {
      allVideos = [
        {
          id: "med-2",
          title: "Foundations of Large Language Models & Deep Transformers",
          type: "video",
          url: "https://www.youtube.com/embed/kCc8FmEb1nY",
          category: "Lecture Preview",
          track: "Vibe Coding & AI Prototyping",
          caption: "Comprehensive lecture walkthrough on self-attention mechanisms, latent embedding spaces, and zero-shot prompting.",
          date: "2026-10-02",
          size: "Stream HD",
        },
        {
          id: "med-4",
          title: "Autonomous Multi-Agent Swarm Live Orchestration Screencast",
          type: "video",
          url: "https://www.youtube.com/embed/bZQun8Y4L2A",
          category: "Lab Demo",
          track: "Multi-Agent Swarms & Enterprise RAG",
          caption: "Live demonstration of 4 autonomous agents compiling distributed vector pipelines and auto-debugging code.",
          date: "2026-10-03",
          size: "Stream 4K",
        },
      ];
    }

    const studentTrack = (student.trackTitle || "").toLowerCase();
    let trackVideos = allVideos.filter((v) => {
      if (!v.track || v.track === "All Tracks") return true;
      const vt = v.track.toLowerCase();
      if (studentTrack.includes("vibe") && vt.includes("vibe")) return true;
      if (studentTrack.includes("cloud") && vt.includes("cloud")) return true;
      if (studentTrack.includes("api") && vt.includes("api")) return true;
      if ((studentTrack.includes("agent") || studentTrack.includes("swarm")) && (vt.includes("agent") || vt.includes("swarm"))) return true;
      if (studentTrack.includes("literacy") && vt.includes("vibe")) return true;
      return false;
    });

    const isFiltered = trackVideos.length > 0;
    const displayVideos = isFiltered ? trackVideos : allVideos;

    let completedVideos = [];
    try {
      const stored = localStorage.getItem(`nexus_completed_videos_${student.id}`);
      if (stored) completedVideos = JSON.parse(stored);
    } catch (e) {}

    if (!this.activeVideoId || !displayVideos.some((v) => v.id === this.activeVideoId)) {
      this.activeVideoId = displayVideos[0].id;
    }

    const activeVideo = displayVideos.find((v) => v.id === this.activeVideoId) || displayVideos[0];
    const completedCount = displayVideos.filter((v) => completedVideos.includes(v.id)).length;
    const progressPercent = Math.round((completedCount / displayVideos.length) * 100);
    const isCurrentCompleted = completedVideos.includes(activeVideo.id);

    let embedHtml = "";
    if (activeVideo.url.includes("youtube.com/embed/")) {
      embedHtml = `<iframe src="${activeVideo.url}?rel=0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" class="hub-video-iframe"></iframe>`;
    } else if (activeVideo.url.includes("youtube.com/watch?v=")) {
      const vidId = activeVideo.url.split("v=")[1].split("&")[0];
      embedHtml = `<iframe src="https://www.youtube.com/embed/${vidId}?rel=0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" class="hub-video-iframe"></iframe>`;
    } else if (activeVideo.url.includes("youtu.be/")) {
      const vidId = activeVideo.url.split("youtu.be/")[1].split("?")[0];
      embedHtml = `<iframe src="https://www.youtube.com/embed/${vidId}?rel=0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" class="hub-video-iframe"></iframe>`;
    } else {
      embedHtml = `
        <video controls class="hub-video-element" poster="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80">
          <source src="${activeVideo.url}">
          Your browser does not support HTML5 video streaming.
        </video>
      `;
    }

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <span class="section-tag" style="margin-bottom:0; font-size:0.75rem; background:rgba(2, 132, 199, 0.1); color:#0284c7; border-color:rgba(2, 132, 199, 0.3);">
              <i class="fas fa-play-circle"></i> On-Demand Curriculum Video Vault
            </span>
            <span class="badge" style="background:#059669; color:#fff; font-size:0.7rem; font-weight:800;">
              ${displayVideos.length} Modules Available
            </span>
          </div>
          <h3 style="font-size:1.35rem; font-weight:800; color:var(--ink-primary); margin:0;">
            Course Lectures & Lab Screencasts
          </h3>
          <div style="font-size:0.85rem; color:var(--ink-secondary); margin-top:2px;">
            Enrolled Track: <strong style="color:var(--secondary);">${student.trackTitle || "AI Specialization"}</strong>
          </div>
        </div>

        <div style="text-align:right;">
          <div style="font-size:0.85rem; font-weight:700; color:var(--ink-primary); margin-bottom:4px;">
            Progress: <span style="color:#0284c7;">${completedCount}/${displayVideos.length} Modules</span> (${progressPercent}%)
          </div>
          <div class="batch-capacity-bar" style="width:160px; height:8px; margin:0 0 0 auto;">
            <div class="batch-capacity-fill" style="width:${progressPercent}%; background:linear-gradient(90deg, #0284c7, #10b981);"></div>
          </div>
        </div>
      </div>

      <!-- Main Cinema Screen -->
      <div class="hub-video-cinema-wrap" id="hubVideoCinemaWrap">
        <div class="hub-video-player-frame">
          ${embedHtml}
        </div>
        <div class="hub-video-meta-bar">
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; flex-wrap:wrap;">
              <span class="badge" style="background:rgba(2, 132, 199, 0.15); color:#0284c7; font-size:0.72rem; font-weight:700;">
                <i class="fas fa-bookmark"></i> ${activeVideo.category || "Lecture Module"}
              </span>
              <span class="badge" style="background:rgba(15, 23, 42, 0.08); color:var(--ink-secondary); font-size:0.72rem;">
                <i class="fas fa-calendar-alt"></i> ${activeVideo.date || "Cohort 2026"}
              </span>
              <span class="badge" style="background:rgba(16, 185, 129, 0.12); color:#059669; font-size:0.72rem; font-weight:700;">
                <i class="fas fa-tv"></i> ${activeVideo.size || "1080p Stream"}
              </span>
            </div>
            <h4 style="font-size:1.15rem; font-weight:800; color:var(--ink-primary); margin:0 0 6px 0;">
              ${activeVideo.title}
            </h4>
            <p style="font-size:0.88rem; color:var(--ink-secondary); line-height:1.55; margin:0;">
              ${activeVideo.caption || "Official course curriculum module recorded by Nexvion AI Academy faculty."}
            </p>
          </div>
          <div style="display:flex; align-items:center; gap:10px; flex-shrink:0;">
            <button class="btn ${isCurrentCompleted ? "btn-secondary" : "btn-primary"} btn-sm" onclick="StudentHub.toggleVideoCompletion('${activeVideo.id}')" style="font-size:0.825rem; font-weight:700; border-radius:999px;">
              <i class="fas ${isCurrentCompleted ? "fa-check-circle" : "fa-circle"}"></i> ${isCurrentCompleted ? "Completed" : "Mark as Completed"}
            </button>
          </div>
        </div>
      </div>

      <!-- Playlist Video Modules -->
      <div style="margin-top:22px;">
        <h5 style="font-size:0.95rem; font-weight:800; color:var(--ink-primary); margin-bottom:12px; display:flex; align-items:center; gap:6px;">
          <i class="fas fa-list-ul" style="color:#0284c7;"></i> Course Video Modules (${displayVideos.length})
        </h5>
        <div class="hub-video-playlist-grid">
          ${displayVideos.map((v, idx) => {
            const isSelected = v.id === activeVideo.id;
            const isDone = completedVideos.includes(v.id);
            return `
              <div class="hub-video-card ${isSelected ? "active" : ""}" onclick="StudentHub.playVideo('${v.id}')">
                <div class="hub-video-card-thumb">
                  <div class="hub-video-card-thumb-overlay">
                    <i class="fas ${isSelected ? "fa-volume-up" : "fa-play"}"></i>
                  </div>
                  <span class="hub-video-card-mod-badge">Module 0${idx + 1}</span>
                  ${isDone ? `<span class="hub-video-card-done-badge" title="Completed"><i class="fas fa-check"></i></span>` : ""}
                </div>
                <div class="hub-video-card-info">
                  <div class="hub-video-card-title">${v.title}</div>
                  <div class="hub-video-card-sub">${v.track} &bull; ${v.size || "HD Video"}</div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  },

  playVideo: function (videoId) {
    this.activeVideoId = videoId;
    const student = StorageService.getCurrentStudent();
    if (student) {
      this.renderCourseVideos(student);
      const wrap = document.getElementById("hubVideoCinemaWrap");
      if (wrap) wrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  },

  toggleVideoCompletion: function (videoId) {
    const student = StorageService.getCurrentStudent();
    if (!student) return;

    let completedVideos = [];
    try {
      const stored = localStorage.getItem(`nexus_completed_videos_${student.id}`);
      if (stored) completedVideos = JSON.parse(stored);
    } catch (e) {}

    if (completedVideos.includes(videoId)) {
      completedVideos = completedVideos.filter((id) => id !== videoId);
      App.showToast("Progress Updated", "Marked module as in-progress.", "info");
    } else {
      completedVideos.push(videoId);
      App.showToast("Module Completed! 🎉", "Great work advancing through your curriculum.", "success");
      if (typeof SoundFX !== "undefined") SoundFX.playSuccess();
    }

    localStorage.setItem(`nexus_completed_videos_${student.id}`, JSON.stringify(completedVideos));
    this.renderCourseVideos(student);
  },
};
