// AI Nexus Academy - Student Hub Portal (Feature 5A)

const StudentHub = {
  countdownInterval: null,

  init: function() {
    this.render();
    this.startLiveCountdown();
  },

  render: function() {
    const student = StorageService.getCurrentStudent();
    const container = document.getElementById('studentHubContent');
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
    IDCardGenerator.renderCard(student, 'hubStudentIdCardSlot');

    // Render Milestone Progress Tracker & Certificate Status
    const certProgressCard = document.getElementById('hubCertProgressCard');
    if (certProgressCard) {
      if (student.certificateAllotted) {
        certProgressCard.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
            <h4 style="font-size:1.1rem; color:#0f172a;"><i class="fas fa-award" style="color:#1a73e8; margin-right:8px;"></i> Official Google-Grade AI Certificate</h4>
            <span class="status-badge status-confirmed"><i class="fas fa-check-circle"></i> Issued & Authorized by Admin</span>
          </div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:14px;">Credential Serial: <strong style="color:#1a73e8; font-family:var(--font-mono);">${student.certificateId || 'G-NEX-2026'}</strong> &bull; Honors: <strong style="color:#059669;">${student.certificateGrade || 'Distinction'}</strong></div>
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
    AICertificateGenerator.renderCertificate(student, 'hubCertificateEmbedSlot');

    // Render Faculty Mentorship Chat Stream
    if (typeof MessagingPortal !== 'undefined') {
      MessagingPortal.renderStudentChat('studentMentorshipChatContainer', student.id);
    }

    // Render Capstone Project Submission & Status Desk
    if (typeof CapstonePortal !== 'undefined') {
      CapstonePortal.renderStudentCapstoneDesk('studentCapstoneDeskContainer', student.id);
    }

    // Update Hub Details
    const hubStudentName = document.getElementById('hubStudentName');
    const hubTrackTitle = document.getElementById('hubTrackTitle');
    const hubBatchName = document.getElementById('hubBatchName');
    const hubStatusBadge = document.getElementById('hubStatusBadge');
    const hubEnrolledDate = document.getElementById('hubEnrolledDate');

    if (hubStudentName) hubStudentName.textContent = student.fullName;
    if (hubTrackTitle) hubTrackTitle.textContent = student.trackTitle;
    if (hubBatchName) hubBatchName.textContent = student.batchName;
    if (hubEnrolledDate) hubEnrolledDate.textContent = `Enrolled on ${student.registeredAt}`;

    if (hubStatusBadge) {
      hubStatusBadge.textContent = student.status || "Confirmed";
      hubStatusBadge.className = `status-badge ${
        student.status === 'Confirmed' ? 'status-confirmed' :
        student.status === 'Payment Verified' ? 'status-payment' :
        student.status === 'Pending' ? 'status-pending' : 'status-waitlisted'
      }`;
    }
  },

  // Live countdown to next class session
  startLiveCountdown: function() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);

    // Target: Upcoming Sunday at 9:00 AM EST (or 2 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(9, 0, 0, 0);

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        document.getElementById('cdDays').textContent = '00';
        document.getElementById('cdHours').textContent = '00';
        document.getElementById('cdMinutes').textContent = '00';
        document.getElementById('cdSeconds').textContent = '00';
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const dEl = document.getElementById('cdDays');
      const hEl = document.getElementById('cdHours');
      const mEl = document.getElementById('cdMinutes');
      const sEl = document.getElementById('cdSeconds');

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
      if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    };

    updateTimer();
    this.countdownInterval = setInterval(updateTimer, 1000);
  },

  // Launch mock live classroom
  joinLiveSession: function() {
    const student = StorageService.getCurrentStudent();
    if (!student) return;
    
    App.showToast(
      "Connecting to Live Class...",
      `Authenticating Student ID: ${student.id}. Launching Zoom / Meet secure room...`,
      "info"
    );

    setTimeout(() => {
      window.open('https://meet.google.com', '_blank');
    }, 1200);
  },

  // Download Starter Resources
  downloadResource: function(type) {
    let title = "";
    let content = "";

    if (type === 'syllabus') {
      title = "AI_Nexus_Complete_Curriculum_Syllabus.txt";
      content = `=====================================================
AI NEXUS ACADEMY - OFFICIAL MASTER CURRICULUM
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
    } else if (type === 'python-guide') {
      title = "Python_and_GPU_Setup_Guide.txt";
      content = `=====================================================
AI NEXUS ACADEMY - PYTHON & GPU SETUP GUIDE
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

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    App.showToast("Resource Downloaded", `Saved ${title}`, "success");
  }
};
