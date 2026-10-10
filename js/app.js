/**
 * NEXVION AI — Interactive Application Logic
 * Premium Micro-interactions, FAQ Accordion, Particle Canvas, Modals & Video Mockup
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar & Active Section Tracking
  initNavbar();

  // 2. Ambient Particle Canvas in Hero
  initParticleCanvas();

  // 3. Mobile Navigation Drawer
  initMobileNav();

  // 4. Hero Live AI Terminal Streaming Simulator
  initPromptSimulator();

  // 5. Course Inside Video Mockup Tabs
  initMockupTabs();

  // 6. Interactive FAQ Accordion
  initFaqAccordion();

  // 7. Conceptual Modals (Join Course & Login)
  initModals();

  // 8. Smooth Scrolling for Internal Links
  initSmoothScroll();

  // 9. Course Curriculum Accordion (Module Expand/Collapse & Toggle All)
  initCurriculumAccordion();

  // 10. Sync Global Authentication & Registration State
  syncGlobalAuthState();

  // 11. Hero Text Interactive Parallax Micro-Motion
  initHeroMotion();
});

/* --------------------------------------------------------------------------
   1. Sticky Navbar & Active Section Tracking
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        handleScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Ambient Particle Canvas in Hero
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
  const TINTS = {
    violet: [139, 92, 246],
    indigo: [99, 102, 241],
    cyan: [56, 189, 248]
  };

  // 3D camera constants. Particles live inside a cube of half-size `range`,
  // sit in front of a camera at CAM and are projected with FOCAL.
  const CAM = 1180;
  const FOCAL = 760;
  const CONNECT_DIST = 132;

  const rand = (min, max) => Math.random() * (max - min) + min;

  let width = 0;
  let height = 0;
  let cx = 0;
  let cy = 0;
  let range = 600;
  let particles = [];

  const seedParticle = () => {
    const roll = Math.random();
    return {
      x: rand(-1, 1) * range,
      y: rand(-1, 1) * range,
      z: rand(-1, 1) * range,
      vx: rand(-0.16, 0.16),
      vy: rand(-0.16, 0.16),
      vz: rand(-0.24, 0.24),
      size: rand(0.9, 2.4),
      tint: roll > 0.84 ? 'cyan' : roll > 0.68 ? 'indigo' : 'violet'
    };
  };

  const seedAll = () => {
    const target = isMobile ? 14 : width > 768 ? 58 : 26;
    particles = [];
    for (let i = 0; i < target; i++) particles.push(seedParticle());
  };

  const resize = () => {
    width = canvas.offsetWidth || canvas.clientWidth || 0;
    height = canvas.offsetHeight || canvas.clientHeight || 0;
    if (!width || !height) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cx = width / 2;
    cy = height / 2;
    range = Math.max(width, height) * 0.52;
    return true;
  };

  if (!resize()) return;
  seedAll();

  // Camera rotation + pointer-driven tilt (radians).
  let baseRy = 0;
  let cameraRy = 0;
  let cameraRx = -0.14;
  let pointerRy = 0;
  let pointerRx = 0;
  let targetPointerRy = 0;
  let targetPointerRx = 0;

  const projected = new Array(particles.length);

  const updateParticle = (p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;

    // Toroidal wrap — the boundary fade below hides every wrap seam.
    if (p.x > range) p.x -= range * 2;
    else if (p.x < -range) p.x += range * 2;
    if (p.y > range) p.y -= range * 2;
    else if (p.y < -range) p.y += range * 2;
    if (p.z > range) p.z -= range * 2;
    else if (p.z < -range) p.z += range * 2;
  };

  const project = (p, cosY, sinY, cosX, sinX) => {
    // Rotate the world around Y, then around X.
    const rx = p.x * cosY - p.z * sinY;
    const rz = p.x * sinY + p.z * cosY;
    const ry = p.y * cosX - rz * sinX;
    const rz2 = p.y * sinX + rz * cosX;

    const denom = CAM + rz2;
    if (denom < 140) return null; // behind the camera — skip entirely

    const k = FOCAL / denom;

    // Fade the outer shell of the cube so wrapping is never visible.
    const maxAbs = Math.max(Math.abs(p.x), Math.abs(p.y), Math.abs(p.z));
    const boundary = Math.min((1 - maxAbs / range) / 0.22, 1);
    if (boundary <= 0) return null;

    const depth = Math.min(Math.max((k - 0.55) / 0.75, 0), 1);
    const alpha = boundary * (0.12 + depth * 0.5);

    return {
      sx: cx + rx * k,
      sy: cy + ry * k,
      size: p.size * (0.55 + k * 0.75),
      alpha: alpha,
      tint: p.tint
    };
  };

  const drawFrame = () => {
    ctx.clearRect(0, 0, width, height);

    const cosY = Math.cos(cameraRy);
    const sinY = Math.sin(cameraRy);
    const cosX = Math.cos(cameraRx);
    const sinX = Math.sin(cameraRx);

    for (let i = 0; i < particles.length; i++) {
      projected[i] = project(particles[i], cosY, sinY, cosX, sinX);
    }

    // Depth-sorted connections between nearby nodes.
    for (let i = 0; i < projected.length; i++) {
      const a = projected[i];
      if (!a) continue;

      for (let j = i + 1; j < projected.length; j++) {
        const b = projected[j];
        if (!b) continue;

        const dx = a.sx - b.sx;
        const dy = a.sy - b.sy;
        const distSq = dx * dx + dy * dy;
        if (distSq > CONNECT_DIST * CONNECT_DIST) continue;

        const alpha = (1 - Math.sqrt(distSq) / CONNECT_DIST) * 0.2 * Math.min(a.alpha, b.alpha) * 3;
        if (alpha <= 0.004) continue;

        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }
    }

    // Glowing nodes.
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      if (!p) continue;

      const rgb = TINTS[p.tint];
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${p.alpha.toFixed(3)})`;
      if (!isMobile) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.45)`;
      }
      ctx.fill();
    }

    if (!isMobile) {
      ctx.shadowBlur = 0;
    }
  };

  if (reducedMotion) {
    // One still frame, no animation loop, no pointer tracking.
    cameraRy = 0.5;
    drawFrame();
    window.addEventListener('resize', () => {
      if (resize()) {
        seedAll();
        projected.length = particles.length;
        drawFrame();
      }
    }, { passive: true });
    return;
  }

  let animationFrameId = null;
  let loopRunning = false;

  const render = () => {
    if (!loopRunning) return;
    baseRy += 0.0011;
    pointerRy += (targetPointerRy - pointerRy) * 0.06;
    pointerRx += (targetPointerRx - pointerRx) * 0.06;
    cameraRy = baseRy + pointerRy;
    cameraRx = -0.14 + pointerRx;

    for (let i = 0; i < particles.length; i++) updateParticle(particles[i]);

    drawFrame();
    animationFrameId = requestAnimationFrame(render);
  };

  const startLoop = () => {
    if (loopRunning) return;
    loopRunning = true;
    animationFrameId = requestAnimationFrame(render);
  };

  const stopLoop = () => {
    loopRunning = false;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  // Pause loop when canvas is out of viewport to save mobile CPU/GPU
  let isCanvasInView = true;
  if ('IntersectionObserver' in window) {
    const canvasObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isCanvasInView = entry.isIntersecting;
        if (isCanvasInView && !document.hidden) {
          startLoop();
        } else {
          stopLoop();
        }
      });
    }, { threshold: 0.02 });
    canvasObserver.observe(canvas);
  } else {
    startLoop();
  }

  if (!isMobile) {
    window.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetPointerRy = ((e.clientX - rect.left) / rect.width - 0.5) * 0.5;
      targetPointerRx = ((e.clientY - rect.top) / rect.height - 0.5) * 0.32;
    }, { passive: true });
  }

  window.addEventListener('resize', () => {
    if (resize()) {
      seedAll();
      projected.length = particles.length;
    }
  }, { passive: true });

  // Pause the loop whenever the tab is hidden to save battery.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden || !isCanvasInView) {
      stopLoop();
    } else {
      startLoop();
    }
  });
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    toggleBtn.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    toggleBtn.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    isOpen ? closeDrawer() : openDrawer();
  });

  backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   4. Hero Live AI Terminal Streaming Simulator
   -------------------------------------------------------------------------- */
function initPromptSimulator() {
  const promptEl = document.getElementById('simulator-prompt-text');
  const streamEl = document.getElementById('stream-tokens-text');
  const latencyEl = document.getElementById('telemetry-latency');

  if (!promptEl || !streamEl) return;

  const scenarios = [
    {
      prompt: 'Construct autonomous AI agent with memory & tool calling',
      stream: 'INITIALIZING NEXVION RUNTIME...\n> Memory Buffer: 128k context verified\n> Tool registry: WebSearch, VectorStore, CodeExec\n> Status: Agent ready. Model active.',
      latency: '14ms'
    },
    {
      prompt: 'Generate full-stack intelligent web app with Next.js & Claude',
      stream: 'ANALYZING SPECS...\n> Scaffolding reactive components\n> Wiring streaming token pipeline\n> Status: Deployed to edge edge-vion-01.',
      latency: '11ms'
    },
    {
      prompt: 'Synthesize generative multimodal pipeline for students',
      stream: 'OPTIMIZING TENSOR WEIGHTS...\n> Embedding dimensional scale: 1536d\n> Cosine similarity index primed\n> Status: Live builder experience enabled.',
      latency: '16ms'
    }
  ];

  let currentIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let pauseDuration = 0;

  const tick = () => {
    const current = scenarios[currentIdx];
    const fullText = current.stream;

    if (!isDeleting) {
      charIdx += 2;
      if (charIdx >= fullText.length) {
        charIdx = fullText.length;
        pauseDuration = 45; // wait before switching
        isDeleting = true;
      }
    } else {
      if (pauseDuration > 0) {
        pauseDuration--;
      } else {
        charIdx -= 4;
        if (charIdx <= 0) {
          charIdx = 0;
          isDeleting = false;
          currentIdx = (currentIdx + 1) % scenarios.length;
          promptEl.textContent = scenarios[currentIdx].prompt;
          if (latencyEl) latencyEl.textContent = scenarios[currentIdx].latency;
        }
      }
    }

    streamEl.textContent = fullText.substring(0, charIdx);
    setTimeout(tick, isDeleting ? 30 : 50);
  };

  promptEl.textContent = scenarios[0].prompt;
  tick();
}

/* --------------------------------------------------------------------------
   5. Course Inside Video Mockup Tabs
   -------------------------------------------------------------------------- */
function initMockupTabs() {
  const tabs = document.querySelectorAll('.mockup-tab');
  const codeContent = document.getElementById('mockup-code-display');

  if (!tabs.length || !codeContent) return;

  const snippets = {
    code: `<span class="code-keyword">import</span> { NexvionAgent } <span class="code-keyword">from</span> <span class="code-str">'@nexvion/ai'</span>;

<span class="code-comment">// Initialize hands-on student agent</span>
<span class="code-keyword">const</span> builderAgent = <span class="code-keyword">new</span> <span class="code-fn">NexvionAgent</span>({
  model: <span class="code-str">'claude-3-7-sonnet'</span>,
  tools: [<span class="code-str">'web_search'</span>, <span class="code-str">'terminal'</span>],
  temperature: <span class="code-keyword">0.2</span>
});

<span class="code-keyword">await</span> builderAgent.<span class="code-fn">execute</span>(<span class="code-str">'Build student AI portfolio'</span>);`,

    prompt: `<span class="code-comment">### Prompt Architecture: Zero-Shot Structured Agent</span>
<span class="code-keyword">System:</span> You are an intelligent builder assistant.
<span class="code-keyword">Objective:</span> Generate clean HTML/CSS/JS without boilerplate.
<span class="code-keyword">Format:</span> Strict JSON payload with executable tasks.`,

    terminal: `<span class="code-comment">$ nexvion build --target=production</span>
<span class="code-fn">[✔]</span> Initializing generative AI pipeline...
<span class="code-fn">[✔]</span> Connecting to vector database...
<span class="code-str">[SUCCESS]</span> Student project live at https://nexvion.app/demo`,

    notes: `<span class="code-comment">### Lesson 4.2 Key Takeaways:</span>
- Understand token latency vs cost tradeoffs.
- Implementing contextual memory with LangChain & Vector DB.
- Deploying to free cloud tiers for student portfolios.`
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab') || 'code';
      if (snippets[target]) {
        codeContent.innerHTML = snippets[target];
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Interactive FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others for a sleek single-open accordion
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Conceptual Modals (Join Course & Login)
   -------------------------------------------------------------------------- */
function initModals() {
  const joinModal = document.getElementById('modal-join');
  const loginModal = document.getElementById('modal-login');

  const openJoinBtns = document.querySelectorAll('.btn-open-join');
  const openLoginBtns = document.querySelectorAll('.btn-open-login');

  const closeBtns = document.querySelectorAll('.modal-close-btn, .modal-overlay');

  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openJoinBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // If student is already registered, go directly to student dashboard
      if (localStorage.getItem('nexvion_current_user')) {
        window.location.href = 'dashboard.html';
      } else {
        window.location.href = 'register.html';
      }
    });
  });

  openLoginBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (localStorage.getItem('nexvion_current_user')) {
        window.location.href = 'dashboard.html';
      } else {
        openModal(loginModal);
      }
    });
  });

  document.querySelectorAll('.modal-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(joinModal);
      closeModal(loginModal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(joinModal);
      closeModal(loginModal);
    }
  });

  // URL Hash Routing for Conceptual Routes (#login, #register, #join)
  const checkUrlHash = () => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#login' || hash === '#modal-login') {
      openModal(loginModal);
    } else if (hash === '#register' || hash === '#join') {
      window.location.href = 'register.html';
    }
  };

  window.addEventListener('hashchange', checkUrlHash);
  checkUrlHash();

  // Handle Join Form Submission
  const joinForm = document.getElementById('join-course-form');
  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = joinForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Securing Your Priority Spot...';
      }

      setTimeout(() => {
        joinForm.innerHTML = `
          <div style="text-align: center; padding: 20px 0;">
            <div style="font-size: 2.5rem; margin-bottom: 12px;">🎉</div>
            <h3 style="font-size: 1.3rem; color: #fff; margin-bottom: 8px;">Welcome to NEXVION AI!</h3>
            <p style="color: #94A3B8; font-size: 0.9rem; margin-bottom: 20px;">
              Your early registration has been confirmed. You will receive cohort start dates and curriculum onboarding details via email.
            </p>
            <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('modal-join').classList.remove('active'); document.body.style.overflow='';">
              Close Window
            </button>
          </div>
        `;
      }, 900);
    });
  }

  // Handle Login Form Submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const feedbackEl = document.getElementById('login-feedback');
      if (feedbackEl) {
        feedbackEl.style.display = 'block';
        feedbackEl.innerHTML = `<span style="color: #38BDF8;">[Conceptual Route Notice]</span> Student portal authentication is currently in private staging. Please use <strong>Join Course</strong> for early cohort onboarding.`;
      }
    });
  }
}

/* --------------------------------------------------------------------------
   8. Smooth Scrolling
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.startsWith('#modal')) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. Course Curriculum Accordion (Expand/Collapse & Toggle All)
   -------------------------------------------------------------------------- */
function initCurriculumAccordion() {
  const moduleCards = document.querySelectorAll('.module-card');
  const toggleAllBtn = document.getElementById('curriculum-toggle-all');

  if (!moduleCards.length) return;

  moduleCards.forEach(card => {
    const headerBtn = card.querySelector('.module-header-btn');
    if (!headerBtn) return;

    headerBtn.addEventListener('click', () => {
      const isExpanded = card.classList.contains('expanded');
      if (isExpanded) {
        card.classList.remove('expanded');
        headerBtn.setAttribute('aria-expanded', 'false');
      } else {
        card.classList.add('expanded');
        headerBtn.setAttribute('aria-expanded', 'true');
      }
      updateToggleAllLabel();
    });
  });

  const updateToggleAllLabel = () => {
    if (!toggleAllBtn) return;
    const allExpanded = Array.from(moduleCards).every(c => c.classList.contains('expanded'));
    toggleAllBtn.textContent = allExpanded ? 'Collapse All Modules' : 'Expand All Modules';
  };

  if (toggleAllBtn) {
    toggleAllBtn.addEventListener('click', () => {
      const allExpanded = Array.from(moduleCards).every(c => c.classList.contains('expanded'));
      moduleCards.forEach(card => {
        const headerBtn = card.querySelector('.module-header-btn');
        if (allExpanded) {
          card.classList.remove('expanded');
          if (headerBtn) headerBtn.setAttribute('aria-expanded', 'false');
        } else {
          card.classList.add('expanded');
          if (headerBtn) headerBtn.setAttribute('aria-expanded', 'true');
        }
      });
      updateToggleAllLabel();
    });
  }
}

/* --------------------------------------------------------------------------
   10. Sync Global Authentication & Registration State
   -------------------------------------------------------------------------- */
function syncGlobalAuthState() {
  try {
    const savedUserStr = localStorage.getItem('nexvion_current_user');
    if (!savedUserStr) return;

    const user = JSON.parse(savedUserStr);
    if (!user || !user.fullName) return;

    // 1. Update Navbar CTA
    const navCta = document.getElementById('nav-cta-btn');
    if (navCta) {
      navCta.textContent = 'Dashboard';
      navCta.href = 'dashboard.html';
    }

    // 2. Update Login Button
    const navLogin = document.getElementById('nav-login-btn');
    if (navLogin) {
      navLogin.textContent = 'Portal';
      navLogin.href = 'dashboard.html';
    }

    // 3. Update Mobile Drawer buttons
    document.querySelectorAll('.drawer-actions a, .drawer-actions button').forEach(el => {
      const txt = el.textContent.toUpperCase();
      if (txt.includes('JOIN COURSE') || txt.includes('LOGIN')) {
        el.textContent = 'Student Dashboard';
        if (el.tagName === 'A') el.href = 'dashboard.html';
        if (el.tagName === 'BUTTON') {
          el.onclick = () => { window.location.href = 'dashboard.html'; };
        }
      }
    });

    // 4. Update Hero Primary CTA if on landing page
    const heroJoinBtn = document.querySelector('.hero-cta-group .btn-primary.btn-open-join');
    if (heroJoinBtn) {
      heroJoinBtn.innerHTML = `<span>CONTINUE LEARNING</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      heroJoinBtn.onclick = (e) => {
        e.preventDefault();
        window.location.href = 'dashboard.html';
      };
    }
  } catch (e) {
    console.warn('Auth sync notice:', e);
  }
}

/* --------------------------------------------------------------------------
   11. Hero Text Interactive Parallax Micro-Motion
   -------------------------------------------------------------------------- */
function initHeroMotion() {
  const hero = document.getElementById('hero');
  const heroContent = document.getElementById('heroTextContent');
  if (!hero || !heroContent) return;

  // Respect user preference for reduced motion or mobile/touch devices
  if (window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 768px), (pointer: coarse)').matches) return;

  const orb1 = heroContent.querySelector('.hero-ambient-orb.orb-1');
  const orb2 = heroContent.querySelector('.hero-ambient-orb.orb-2');

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let isHovered = false;
  let rafId = null;

  const update = () => {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    if (isHovered) {
      const rotY = (currentX * 0.45).toFixed(2);
      const rotX = (-currentY * 0.45).toFixed(2);
      heroContent.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;

      if (orb1) {
        orb1.style.transform = `translate(${(-currentX * 1.5).toFixed(1)}px, ${(-currentY * 1.5).toFixed(1)}px)`;
      }
      if (orb2) {
        orb2.style.transform = `translate(${(currentX * 1.8).toFixed(1)}px, ${(currentY * 1.8).toFixed(1)}px)`;
      }
      rafId = requestAnimationFrame(update);
    } else {
      if (Math.abs(currentX) > 0.04 || Math.abs(currentY) > 0.04) {
        rafId = requestAnimationFrame(update);
      } else {
        heroContent.style.transform = '';
        if (orb1) orb1.style.transform = '';
        if (orb2) orb2.style.transform = '';
        rafId = null;
      }
    }
  };

  const onMouseMove = (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX = (x / (rect.width / 2)) * 6;
    mouseY = (y / (rect.height / 2)) * 6;
    if (!rafId) {
      rafId = requestAnimationFrame(update);
    }
  };

  hero.addEventListener('mouseenter', () => {
    isHovered = true;
    if (!rafId) {
      rafId = requestAnimationFrame(update);
    }
  });

  hero.addEventListener('mousemove', onMouseMove, { passive: true });

  hero.addEventListener('mouseleave', () => {
    isHovered = false;
    mouseX = 0;
    mouseY = 0;
  });
}


