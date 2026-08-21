// AI Nexus Academy - Gamified Achievements & Milestone XP Controller

const AchievementsPortal = {
  currentStudent: null,
  totalXP: 3850,
  currentLevel: 4,
  streakDays: 12,
  claimedQuests: {},

  badgesData: [
    {
      id: "prompt-master",
      title: "Prompt Architect",
      tier: "AI-101",
      icon: "fas fa-magic",
      color: "#0284c7",
      bgGrad: "linear-gradient(135deg, #0284c7, #38bdf8)",
      desc: "Mastered advanced Chain-of-Thought (CoT), few-shot prompting, and persona system scaffolding.",
      criteria: "Complete Week 1 prompt engineering labs and score >90% on benchmark.",
      unlocked: true,
      unlockedDate: "August 12, 2026",
      hash: "NX-BADGE-101-9482",
      xp: 500
    },
    {
      id: "cloud-shipper",
      title: "Production Shipper",
      tier: "AI-201",
      icon: "fas fa-cloud-upload-alt",
      color: "#6366f1",
      bgGrad: "linear-gradient(135deg, #6366f1, #a855f7)",
      desc: "Successfully deployed containerized Docker AI services with SSL termination and CI/CD pipelines.",
      criteria: "Deploy a live fullstack AI application to Render/Vercel with secret environment variable shielding.",
      unlocked: true,
      unlockedDate: "August 14, 2026",
      hash: "NX-BADGE-201-8319",
      xp: 750
    },
    {
      id: "vector-pioneer",
      title: "Vector DB Pioneer",
      tier: "AI-301",
      icon: "fas fa-database",
      color: "#059669",
      bgGrad: "linear-gradient(135deg, #059669, #34d399)",
      desc: "Architected enterprise RAG pipelines with Pinecone semantic search, dense embeddings, and FastAPI.",
      criteria: "Construct a 10,000+ vector embedding database with cosine similarity retrieval latency < 40ms.",
      unlocked: true,
      unlockedDate: "August 16, 2026",
      hash: "NX-BADGE-301-7104",
      xp: 1000
    },
    {
      id: "swarm-commander",
      title: "Swarm Commander",
      tier: "AI-401",
      icon: "fas fa-robot",
      color: "#7c3aed",
      bgGrad: "linear-gradient(135deg, #7c3aed, #db2777)",
      desc: "Engineered autonomous multi-agent swarms with CrewAI & LangGraph DAGs handling self-delegation.",
      criteria: "Deploy 4+ collaborating autonomous agents in a production workflow with zero infinite loops.",
      unlocked: true,
      unlockedDate: "August 17, 2026",
      hash: "NX-BADGE-401-6621",
      xp: 1200
    },
    {
      id: "zero-hallucination",
      title: "Guardrail Sentinel",
      tier: "Specialty",
      icon: "fas fa-shield-alt",
      color: "#e11d48",
      bgGrad: "linear-gradient(135deg, #e11d48, #fb7185)",
      desc: "Implemented strict anti-hallucination guardrails, PII masking, and adversarial injection defense.",
      criteria: "Achieve 0.0% hallucination score on 50 adversarial benchmark evaluation suites.",
      unlocked: false,
      unlockedDate: "Locked",
      hash: "NX-BADGE-SEC-LOCKED",
      xp: 800
    },
    {
      id: "deans-distinction",
      title: "Dean's Honors Laureate",
      tier: "Graduation",
      icon: "fas fa-award",
      color: "#d97706",
      bgGrad: "linear-gradient(135deg, #d97706, #fbbf24)",
      desc: "Graduated top 5% of cohort with approved faculty capstone project and verified thesis defense.",
      criteria: "Faculty Capstone evaluation score exceeding 95/100 points.",
      unlocked: false,
      unlockedDate: "Locked",
      hash: "NX-BADGE-DEAN-LOCKED",
      xp: 2000
    },
    {
      id: "active-scholar",
      title: "Research Fellow",
      tier: "Community",
      icon: "fas fa-comments",
      color: "#0284c7",
      bgGrad: "linear-gradient(135deg, #0284c7, #06b6d4)",
      desc: "Attended 10+ live faculty office hours and assisted peer scholars in Discord code review rooms.",
      criteria: "Participate in 10+ mentor chat office hours and submit 3 peer code reviews.",
      unlocked: true,
      unlockedDate: "August 15, 2026",
      hash: "NX-BADGE-COM-5192",
      xp: 400
    },
    {
      id: "early-adopter",
      title: "Inaugural Pioneer 2026",
      tier: "Honorary",
      icon: "fas fa-star",
      color: "#f59e0b",
      bgGrad: "linear-gradient(135deg, #f59e0b, #fbbf24)",
      desc: "One of the first 1,000 foundational scholars admitted into the global AI Nexus Academy program.",
      criteria: "Registered during the inaugural 2026 Global AI Cohort launch.",
      unlocked: true,
      unlockedDate: "August 10, 2026",
      hash: "NX-BADGE-FOUNDER-100",
      xp: 500
    }
  ],

  questsData: [
    {
      id: "quest-1",
      title: "Run Multi-Agent Swarm Simulation",
      desc: "Launch the 4-agent autonomous legal analysis or SEO swarm in the Nexus AI Lab.",
      xp: 300,
      icon: "fas fa-flask",
      color: "#7c3aed",
      link: "ai-lab.html",
      linkText: "Open AI Lab"
    },
    {
      id: "quest-2",
      title: "Optimize 3 Enterprise System Prompts",
      desc: "Use the Prompt Optimizer to generate Chain-of-Thought guardrailed system prompts.",
      xp: 250,
      icon: "fas fa-magic",
      color: "#0284c7",
      link: "ai-lab.html",
      linkText: "Optimize Prompts"
    },
    {
      id: "quest-3",
      title: "Submit Graduation Capstone Milestone",
      desc: "Post your GitHub repository and live demo URL to the Capstone desk in Student Hub.",
      xp: 800,
      icon: "fas fa-graduation-cap",
      color: "#059669",
      link: "index.html#student-hub",
      linkText: "Go to Student Hub"
    },
    {
      id: "quest-4",
      title: "Join Faculty Discord Mentorship Room",
      desc: "Connect with Dr. Sarah Sterling and Academy peers for 24/7 technical problem solving.",
      xp: 150,
      icon: "fab fa-discord",
      color: "#5865F2",
      link: "https://discord.com",
      linkText: "Join Discord"
    }
  ],

  leaderboardData: [
    { rank: 1, name: "Marcus Vance", track: "AI-401 Multi-Agent", xp: 5420, level: 6, streak: 28, badge: "🥇 Grandmaster" },
    { rank: 2, name: "Dr. Elena Rostova", track: "AI-301 Vector APIs", xp: 4890, level: 5, streak: 21, badge: "🥈 Principal" },
    { rank: 3, name: "Alex Rivera (You)", track: "AI-401 Multi-Agent", xp: 3850, level: 4, streak: 12, badge: "🥉 Scholar Lead", isCurrent: true },
    { rank: 4, name: "Kenji Takahashi", track: "AI-201 Cloud Ops", xp: 3600, level: 4, streak: 15, badge: "⚡ Senior" },
    { rank: 5, name: "Priya Sharma", track: "AI-101 Vibe Coding", xp: 3250, level: 4, streak: 19, badge: "🌱 Pioneer" },
    { rank: 6, name: "David Kim", track: "AI-401 Multi-Agent", xp: 2950, level: 3, streak: 9, badge: "🤖 Architect" }
  ],

  init: function() {
    this.loadStudent();
    this.loadClaimedQuests();
    this.renderStats();
    this.renderBadges('all');
    this.renderQuests();
    this.renderLeaderboard();
  },

  loadStudent: function() {
    try {
      const stored = localStorage.getItem('AI_ACADEMY_STUDENT');
      if (stored) {
        this.currentStudent = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not parse student from localStorage", e);
    }

    if (!this.currentStudent) {
      this.currentStudent = {
        fullName: "Alex Rivera",
        studentId: "NEX-2026-8492",
        track: "AI-401: Advanced AI Architecture & MLOps",
        avatar: "AR"
      };
    }

    // Update Student UI Header
    const nameEl = document.getElementById('achieveStudentName');
    const idEl = document.getElementById('achieveStudentId');
    const trackEl = document.getElementById('achieveStudentTrack');
    const avatarEl = document.getElementById('achieveStudentAvatar');

    if (nameEl) nameEl.textContent = this.currentStudent.fullName || "Alex Rivera";
    if (idEl) idEl.textContent = this.currentStudent.studentId || "NEX-2026-8492";
    if (trackEl) trackEl.textContent = this.currentStudent.track || "AI-401: Advanced AI Architecture";
    if (avatarEl) {
      const initials = (this.currentStudent.fullName || "Alex Rivera")
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(p => p[0].toUpperCase())
        .join('') || "AI";
      avatarEl.textContent = initials;
    }
  },

  loadClaimedQuests: function() {
    try {
      const stored = localStorage.getItem('AI_ACADEMY_CLAIMED_QUESTS');
      if (stored) {
        this.claimedQuests = JSON.parse(stored);
      }
    } catch (e) {}

    // Add extra XP from claimed quests
    Object.keys(this.claimedQuests).forEach(qId => {
      const q = this.questsData.find(item => item.id === qId);
      if (q && !this.claimedQuests[qId].counted) {
        this.totalXP += q.xp;
        this.claimedQuests[qId].counted = true;
      }
    });

    this.calculateLevel();
  },

  calculateLevel: function() {
    // 1,000 XP per level
    this.currentLevel = Math.floor(this.totalXP / 1000) + 1;
  },

  renderStats: function() {
    const xpEl = document.getElementById('totalXPCount');
    const levelEl = document.getElementById('currentLevelDisplay');
    const levelTitleEl = document.getElementById('levelRankTitle');
    const streakEl = document.getElementById('streakDaysCount');
    const unlockedEl = document.getElementById('unlockedBadgesCount');
    const progressFill = document.getElementById('levelProgressBar');
    const progressPercent = document.getElementById('levelProgressPercent');

    const unlockedCount = this.badgesData.filter(b => b.unlocked).length;

    if (xpEl) xpEl.textContent = this.totalXP.toLocaleString();
    if (levelEl) levelEl.textContent = `Lvl ${this.currentLevel}`;
    if (streakEl) streakEl.textContent = `${this.streakDays} Days`;
    if (unlockedEl) unlockedEl.textContent = `${unlockedCount} / ${this.badgesData.length}`;

    // Rank Title Mapping
    const ranks = {
      1: "AI Apprentice Scholar",
      2: "Neural Practitioner",
      3: "Applied AI Engineer",
      4: "Senior Swarm Architect",
      5: "Principal AI Scientist",
      6: "Nexus Grandmaster Fellow"
    };

    if (levelTitleEl) {
      levelTitleEl.textContent = ranks[this.currentLevel] || "Nexus Grandmaster";
    }

    // Progress within current level (e.g. 3,850 => 850 / 1000 = 85%)
    const xpIntoLevel = this.totalXP % 1000;
    const pct = Math.min(100, Math.round((xpIntoLevel / 1000) * 100));

    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressPercent) progressPercent.textContent = `${xpIntoLevel} / 1,000 XP (${pct}% to Level ${this.currentLevel + 1})`;
  },

  filterBadges: function(filter) {
    document.querySelectorAll('.badge-filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    this.renderBadges(filter);
  },

  renderBadges: function(filter = 'all') {
    const container = document.getElementById('badgesGridContainer');
    if (!container) return;

    let filtered = this.badgesData;
    if (filter === 'unlocked') {
      filtered = this.badgesData.filter(b => b.unlocked);
    } else if (filter === 'locked') {
      filtered = this.badgesData.filter(b => !b.unlocked);
    } else if (filter === 'tier') {
      filtered = this.badgesData.filter(b => b.tier.startsWith('AI-'));
    }

    container.innerHTML = filtered.map(b => `
      <div class="hologram-badge-card ${b.unlocked ? 'unlocked' : 'locked'}" onclick="AchievementsPortal.openBadgeModal('${b.id}')">
        <div class="badge-icon-wrap" style="background: ${b.unlocked ? b.bgGrad : '#e2e8f0'}; color: ${b.unlocked ? '#ffffff' : '#94a3b8'};">
          <i class="${b.icon}"></i>
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span class="status-badge ${b.unlocked ? 'status-confirmed' : 'status-pending'}" style="font-size:0.68rem; padding:2px 8px;">
            ${b.unlocked ? '<i class="fas fa-check"></i> UNLOCKED' : '<i class="fas fa-lock"></i> LOCKED'}
          </span>
          <span style="font-size:0.75rem; font-weight:800; font-family:var(--font-mono); color:${b.color};">+${b.xp} XP</span>
        </div>

        <h4 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin-bottom:6px;">${b.title}</h4>
        <p style="font-size:0.8rem; color:#64748b; line-height:1.45; margin-bottom:12px; flex:1;">${b.desc}</p>
        
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:10px; font-size:0.725rem; color:#64748b;">
          <span>Category: <strong style="color:#0f172a;">${b.tier}</strong></span>
          <span style="color:#0284c7; font-weight:700;">View Details &rarr;</span>
        </div>
      </div>
    `).join('');
  },

  openBadgeModal: function(badgeId) {
    const badge = this.badgesData.find(b => b.id === badgeId);
    if (!badge) return;

    const modal = document.getElementById('badgeDetailModal');
    const content = document.getElementById('badgeModalBody');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="text-align:center; margin-bottom:20px;">
        <div style="width:72px; height:72px; border-radius:20px; background:${badge.unlocked ? badge.bgGrad : '#e2e8f0'}; color:${badge.unlocked ? '#ffffff' : '#94a3b8'}; display:inline-flex; align-items:center; justify-content:center; font-size:2rem; box-shadow:0 8px 24px rgba(0,0,0,0.12); margin-bottom:12px;">
          <i class="${badge.icon}"></i>
        </div>
        <h3 style="font-size:1.4rem; font-weight:900; color:#0f172a; margin-bottom:4px;">${badge.title}</h3>
        <span class="status-badge ${badge.unlocked ? 'status-confirmed' : 'status-pending'}" style="font-size:0.75rem; padding:4px 12px;">
          ${badge.unlocked ? `Unlocked on ${badge.unlockedDate}` : 'Locked Milestone'}
        </span>
      </div>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:20px; font-size:0.875rem;">
        <div style="font-weight:700; color:#0f172a; margin-bottom:4px;"><i class="fas fa-info-circle" style="color:#0284c7; margin-right:6px;"></i> Description:</div>
        <p style="color:#475569; margin-bottom:12px; line-height:1.5;">${badge.desc}</p>
        
        <div style="font-weight:700; color:#0f172a; margin-bottom:4px;"><i class="fas fa-tasks" style="color:#7c3aed; margin-right:6px;"></i> Unlock Requirement:</div>
        <p style="color:#475569; margin-bottom:12px; line-height:1.5;">${badge.criteria}</p>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #e2e8f0; padding-top:10px; font-family:var(--font-mono); font-size:0.75rem; color:#64748b;">
          <span>Verification Serial: <strong style="color:#0284c7;">${badge.hash}</strong></span>
          <span>Reward: <strong style="color:#059669;">+${badge.xp} XP</strong></span>
        </div>
      </div>

      <div style="display:flex; gap:10px;">
        ${badge.unlocked ? `
          <button class="btn btn-primary" style="flex:1; justify-content:center;" onclick="AchievementsPortal.shareBadge('${badge.title}')">
            <i class="fab fa-linkedin"></i> Share on LinkedIn
          </button>
          <button class="btn btn-secondary" style="flex:1; justify-content:center;" onclick="AchievementsPortal.downloadBadgePass('${badge.title}', '${badge.hash}')">
            <i class="fas fa-download"></i> Save Badge
          </button>
        ` : `
          <a href="ai-lab.html" class="btn btn-primary" style="width:100%; justify-content:center;">
            <i class="fas fa-play"></i> Launch AI Lab to Unlock
          </a>
        `}
      </div>
    `;

    modal.classList.add('active');
  },

  closeModal: function() {
    const modal = document.getElementById('badgeDetailModal');
    if (modal) modal.classList.remove('active');
  },

  shareBadge: function(badgeTitle) {
    const text = `🎉 I just earned the "${badgeTitle}" credential at AI Nexus Academy! Mastering Generative AI, Multi-Agent Swarms & Vector RAG. #AINexus #GenerativeAI #AIArchitecture`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  },

  downloadBadgePass: function(badgeTitle, hash) {
    const content = `=====================================================
AI NEXUS ACADEMY - OFFICIAL BADGE CREDENTIAL
=====================================================
Scholar Name      : ${this.currentStudent.fullName}
Student ID        : ${this.currentStudent.studentId}
Badge Earned      : ${badgeTitle}
Credential Hash   : ${hash}
Issued By         : AI Nexus Research Faculty
Status            : Active & Cryptographically Verified
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `AI-Nexus-Badge-${hash}.txt`;
    link.click();

    this.showToast("Badge Saved 📥", `Digital credential for ${badgeTitle} downloaded.`, "success");
  },

  renderQuests: function() {
    const container = document.getElementById('questsListContainer');
    if (!container) return;

    container.innerHTML = this.questsData.map(q => {
      const isClaimed = !!this.claimedQuests[q.id];
      return `
        <div class="quest-item-card ${isClaimed ? 'claimed' : ''}">
          <div class="quest-icon" style="background:${q.color}15; color:${q.color}; border:1px solid ${q.color}40;">
            <i class="${q.icon}"></i>
          </div>
          <div class="quest-details">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:2px;">
              <h4 style="font-size:0.95rem; font-weight:800; color:#0f172a;">${q.title}</h4>
              <span class="status-badge status-confirmed" style="font-size:0.7rem; font-family:var(--font-mono); padding:1px 6px;">+${q.xp} XP</span>
            </div>
            <p style="font-size:0.8rem; color:#64748b; margin-bottom:0;">${q.desc}</p>
          </div>
          <div class="quest-action">
            ${isClaimed ? `
              <span class="status-badge status-confirmed" style="padding:6px 12px; font-size:0.8rem;">
                <i class="fas fa-check-circle"></i> CLAIMED
              </span>
            ` : `
              <button class="btn btn-primary btn-sm" onclick="AchievementsPortal.claimQuest('${q.id}')">
                <i class="fas fa-gift"></i> Claim XP
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');
  },

  claimQuest: function(questId) {
    if (this.claimedQuests[questId]) return;

    const quest = this.questsData.find(q => q.id === questId);
    if (!quest) return;

    this.claimedQuests[questId] = { claimedAt: new Date().toISOString(), counted: true };
    localStorage.setItem('AI_ACADEMY_CLAIMED_QUESTS', JSON.stringify(this.claimedQuests));

    this.totalXP += quest.xp;
    this.calculateLevel();

    this.triggerConfetti();
    this.renderStats();
    this.renderQuests();

    this.showToast("Quest Completed! 🎉", `Earned +${quest.xp} XP! Total XP: ${this.totalXP.toLocaleString()}`, "success");
  },

  renderLeaderboard: function() {
    const container = document.getElementById('leaderboardListContainer');
    if (!container) return;

    // Update current user XP in leaderboard
    const currentUserRow = this.leaderboardData.find(item => item.isCurrent);
    if (currentUserRow) {
      currentUserRow.xp = this.totalXP;
      currentUserRow.level = this.currentLevel;
    }

    container.innerHTML = this.leaderboardData.map(user => `
      <div class="leaderboard-row ${user.isCurrent ? 'current-user-row' : ''}">
        <div class="lb-rank">
          ${user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
        </div>
        <div class="lb-avatar" style="background:var(--grad-primary); color:#ffffff;">
          ${user.name.split(' ').map(p=>p[0]).slice(0,2).join('')}
        </div>
        <div class="lb-info">
          <div style="font-weight:800; font-size:0.9rem; color:#0f172a;">${user.name}</div>
          <div style="font-size:0.75rem; color:#64748b;">${user.track} &bull; <span style="color:#e11d48; font-weight:700;">🔥 ${user.streak}d streak</span></div>
        </div>
        <div class="lb-score">
          <div style="font-weight:800; color:#0284c7; font-family:var(--font-mono); font-size:0.95rem;">${user.xp.toLocaleString()} XP</div>
          <div style="font-size:0.7rem; color:#64748b; font-weight:700;">Level ${user.level}</div>
        </div>
      </div>
    `).join('');
  },

  triggerConfetti: function() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#0284c7', '#7c3aed', '#059669', '#f59e0b', '#ec4899', '#3b82f6'];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        r: Math.random() * 6 + 4,
        d: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
        tiltAngle: 0,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12 - 4
      });
    }

    let animationFrame;
    let ticks = 0;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 1 + p.r / 2) / 2 + p.vy;
        p.x += p.vx;
        p.vy += 0.15; // gravity
        p.tilt = Math.sin(p.tiltAngle) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
      });

      ticks++;
      if (ticks < 120) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    render();
  },

  showToast: function(title, msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${msg}</div>
      </div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
};
