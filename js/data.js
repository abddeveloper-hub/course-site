// AI Nexus Academy - Platform Data & Configuration

const ACADEMY_DATA = {
  academyName: "AI Nexus Academy",
  tagline: "Empowering the Next Generation of AI Innovators & Leaders",
  contactEmail: "abddeveloper@gmail.com",
  contactPhones: ["+91 9844691633", "+91 9061106019", "+91 9061106009"],
  contactPhone: "+91 9844691633 / +91 9061106019 / +91 9061106009",
  
  // 1. Pure AI Course Tracks & Specializations (4 Tiers)
  courses: [
    {
      id: "ai-beginners",
      code: "AI-101",
      tier: "Low Tier (Foundation)",
      title: "Vibe Coding Softwares & AI-Assisted App Development",
      category: "Vibe Coding & AI Software Tools",
      level: "Beginner",
      badge: "🌱 Low Tier · Vibe Coding Softwares",
      duration: "4 Weeks (32 Hours)",
      format: "Live Interactive AI Cohort",
      price: 1500,
      originalPrice: 2200,
      rating: 4.9,
      reviewCount: 340,
      icon: "fa-magic",
      gradient: "linear-gradient(135deg, #00f0ff 0%, #0072ff 100%)",
      accentColor: "#00f0ff",
      description: "Master the art of Vibe Coding: build complete websites, web applications, and software tools purely with AI prompts using Cursor AI, Windsurf, Lovable, Bolt.new, and v0.dev without manual syntax coding.",
      highlights: [
        "Vibe Coding Foundations: Cursor AI, Windsurf IDE & Natural Language Code Generation",
        "AI Full-Stack App Builders: Instant generation with Lovable, Bolt.new & v0.dev",
        "AI Coding Agents: Multi-file project generation with Replit Agent & Claude 3.5 Sonnet",
        "Debugging with AI: ChatGPT Canvas, GitHub Copilot & Rapid AI Prototyping"
      ],
      syllabus: [
        { week: "Week 1", title: "Vibe Coding Setup: Cursor AI, Windsurf & Natural Language Development" },
        { week: "Week 2", title: "AI-Powered UI & App Builders: v0.dev, Lovable & Bolt.new Workflows" },
        { week: "Week 3", title: "Multi-File Project Architecture with Replit Agent & Claude Artifacts" },
        { week: "Week 4", title: "Capstone: Building & Shipping a Live SaaS App Purely via Vibe Coding" }
      ],
      prerequisites: "Zero coding experience required. Designed for creators, founders, and absolute beginners."
    },
    {
      id: "applied-ml-ds",
      code: "AI-201",
      tier: "Mid Tier (Professional)",
      title: "Cloud Hosting, Deployment & Software Integration",
      category: "Cloud Hosting, Production Deployment & DevOps",
      level: "Intermediate",
      badge: "⭐ Mid Tier · Hosting & Deployment",
      duration: "8 Weeks (64 Hours)",
      format: "Live AI Cohort + Cloud GPU Mentorship",
      price: 2500,
      originalPrice: 3500,
      rating: 4.95,
      reviewCount: 520,
      icon: "fa-cloud-upload-alt",
      gradient: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
      accentColor: "#a855f7",
      description: "Take your vibe-coded and custom applications live to the world: learn modern cloud hosting (Vercel, Netlify, Render, Railway), database setups (Supabase, Firebase), custom domain routing, SSL, and software integration.",
      highlights: [
        "1-Click Production Hosting & Deployment: Vercel, Netlify, Render & Railway",
        "Cloud Databases & Backend Setup: Supabase, Firebase & Managed PostgreSQL",
        "Custom Domain Setup, DNS Management, SSL Certificates & CDN Acceleration",
        "Modern Software Stacks: Docker Containers, Environment Configs & GitHub CI/CD"
      ],
      syllabus: [
        { week: "Week 1-2", title: "Cloud Hosting Platforms: Deploying Next.js, React & Node on Vercel & Render" },
        { week: "Week 3-4", title: "Cloud Database Hosting: Supabase, Firebase, Realtime DB & PostgreSQL" },
        { week: "Week 5-6", title: "Custom Domains, SSL, Environment Secrets & Production Security" },
        { week: "Week 7-8", title: "Capstone: Deploying a Scalable Multi-Service Production Web System" }
      ],
      prerequisites: "Basic computer literacy and understanding of web pages."
    },
    {
      id: "genai-agents",
      code: "AI-301",
      tier: "High Tier (Advanced)",
      title: "API Architecture, Backend Services & AI Engine APIs",
      category: "REST APIs, Backend Services & AI Engine APIs",
      level: "Advanced",
      badge: "🔥 High Tier · APIs & Backend Integration",
      duration: "10 Weeks (80 Hours)",
      format: "Live AI Lab + 1-on-1 AI Architecture Reviews",
      price: 3500,
      originalPrice: 4800,
      rating: 4.98,
      reviewCount: 710,
      icon: "fa-network-wired",
      gradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
      accentColor: "#ec4899",
      description: "Connect software to external intelligence and services using APIs: master REST APIs, OpenAI & Claude APIs, Google Gemini, Webhooks, FastAPI backends, vector search APIs (Pinecone), and payment gateway integrations.",
      highlights: [
        "RESTful API Architecture: Building Async APIs with Python FastAPI & Node.js",
        "AI Engine API Integrations: OpenAI GPT-4o, Anthropic Claude 3.5, Gemini & DeepSeek",
        "Vector Search & Retrieval APIs: Pinecone, ChromaDB & Webhook Automations",
        "Authentication APIs, Secure Token Auth & Stripe/UPI Payment Gateway APIs"
      ],
      syllabus: [
        { week: "Week 1-2", title: "API Fundamentals: JSON Payloads, Headers & Python FastAPI Endpoints" },
        { week: "Week 3-4", title: "Direct AI Engine API Integration (OpenAI, Claude, Gemini & DeepSeek)" },
        { week: "Week 5-7", title: "Vector DB APIs (Pinecone), Webhooks & Third-Party Software Connections" },
        { week: "Week 8-10", title: "Capstone: Building a Production API-Driven AI SaaS Application" }
      ],
      prerequisites: "Basic programming concepts or completion of Tier 1 & 2."
    },
    {
      id: "fullstack-ai-engineer",
      code: "AI-401",
      tier: "Highest Tier (Masterclass)",
      title: "Advanced AI Architecture, Autonomous Agents & MLOps",
      category: "Autonomous AI Agents, Enterprise RAG & Cloud MLOps",
      level: "All Levels to AI Pro",
      badge: "🚀 Highest Tier · Advanced AI & Agents",
      duration: "14 Weeks (120 Hours)",
      format: "Intensive Live AI Bootcamp + Career Placement",
      price: 5000,
      originalPrice: 6800,
      rating: 5.0,
      reviewCount: 430,
      icon: "fa-microchip",
      gradient: "linear-gradient(135deg, #10b981 0%, #00f0ff 100%)",
      accentColor: "#10b981",
      description: "Advance to cutting-edge AI engineering: architect autonomous multi-agent swarms (CrewAI, LangGraph), enterprise RAG with hybrid search, local model serving (Ollama/vLLM), and scalable cloud GPU MLOps pipelines.",
      highlights: [
        "Autonomous Multi-Agent AI Swarms with CrewAI, LangGraph & Tool Calling",
        "Enterprise RAG Architecture: Vector DBs, Hybrid Search, Chunking & Rerankers",
        "Local & Cloud LLM Serving: Fine-tuning, Ollama, vLLM on Cloud GPUs (A100)",
        "Production MLOps, Containerization, Agent Guardrails & 1-on-1 Career Placement"
      ],
      syllabus: [
        { week: "Week 1-4", title: "Advanced LLM Architecture, Prompt Optimization & Local Models (Ollama)" },
        { week: "Week 5-8", title: "Enterprise RAG Pipelines & High-Precision Hybrid Search" },
        { week: "Week 9-11", title: "Autonomous Multi-Agent Swarms (CrewAI & LangGraph) in Production" },
        { week: "Week 12-14", title: "Grand Capstone: Full-Scale Autonomous AI Enterprise System & Placement" }
      ],
      prerequisites: "Open to all motivated learners. Includes progressive foundations."
    }
  ],

  // 2. Available Batches with Live Capacity
  batches: [
    {
      id: "batch-weekend-am",
      name: "Weekend Cohort - Morning",
      schedule: "Sat & Sun | 09:00 AM - 01:00 PM EST",
      mode: "Live Interactive Zoom + Recording Access",
      startDate: "Sept 05, 2026",
      maxSeats: 30,
      enrolledSeats: 0,
      status: "Open Enrollment"
    },
    {
      id: "batch-weekday-pm",
      name: "Weekday Cohort - Evening",
      schedule: "Tue & Thu | 07:00 PM - 10:00 PM EST",
      mode: "Live Interactive Zoom + Recording Access",
      startDate: "Sept 08, 2026",
      maxSeats: 30,
      enrolledSeats: 0,
      status: "Open Enrollment"
    },
    {
      id: "batch-hybrid-flex",
      name: "Hybrid Self-Paced + Weekly Office Hours",
      schedule: "Flexible Hours + Sunday Live Mentor Sync (11 AM EST)",
      mode: "On-Demand Video Modules + Weekly Live Lab",
      startDate: "Instant Access Upon Enrollment",
      maxSeats: 50,
      enrolledSeats: 0,
      status: "Open Enrollment"
    }
  ],

  // 3. Add-on Options for Customizer Wizard (4B)
  addons: [
    {
      id: "addon-gpu",
      name: "Dedicated Cloud GPU Lab Pass (A100/H100 Credits)",
      price: 499,
      description: "50 hours of cloud GPU compute for training models without needing high-end local hardware."
    },
    {
      id: "addon-mentorship",
      name: "3x 1-on-1 VIP Mentor Strategy Sessions",
      price: 799,
      description: "Direct 45-minute private code & project review sessions with senior AI engineers."
    },
    {
      id: "addon-career",
      name: "AI Portfolio & Career Placement Accelerator",
      price: 999,
      description: "AI resume tailoring, LinkedIn optimization, mock tech interview, and hiring partner referrals."
    }
  ],

  // 4. Promo Vouchers (3C)
  vouchers: {
    "FUTUREAI20": { discountPercent: 20, description: "20% Early Bird AI Innovator Discount" },
    "STUDENT50": { discountPercent: 50, description: "50% University / Student Scholarship Voucher" },
    "LAUNCH100": { flatDiscount: 500, description: "₹500 Flat Launch Special Voucher" }
  },

  // 5. Initial Registrations (Starting at 0)
  initialStudents: [],

  // 6. Testimonials
  testimonials: [
    {
      name: "Marcus Vance",
      role: "AI Product Specialist at TechVentures",
      text: "The AI for Beginners track completely transformed how our business team operates. We automated 15+ hours of repetitive research weekly using custom GPTs and Zapier.",
      avatar: "MV",
      rating: 5
    },
    {
      name: "Dr. Priya Sharma",
      role: "ML Researcher & Lead Engineer",
      text: "The GenAI & Agents curriculum is the most up-to-date program anywhere. We built actual multi-agent systems and RAG pipelines that landed me senior AI offers.",
      avatar: "PS",
      rating: 5
    },
    {
      name: "Liam O'Connor",
      role: "Full-Stack AI Developer",
      text: "From zero neural network experience to deploying an end-to-end LLM application on cloud GPUs. The instructor mentorship was world-class.",
      avatar: "LO",
      rating: 5
    }
  ],

  // 7. Initial Capstone Projects (Starting at 0)
  initialCapstones: [],

  // 8. Initial Mentorship Messages (Starting at 0)
  initialMessages: []
};

// Storage helper to persist data
const StorageService = {
  init: function() {
    if (!localStorage.getItem("nexus_clean_zero_v2")) {
      localStorage.setItem("nexus_students", JSON.stringify([]));
      localStorage.removeItem("nexus_current_student");
      localStorage.setItem("nexus_capstones", JSON.stringify([]));
      localStorage.setItem("nexus_messages", JSON.stringify([]));
      localStorage.setItem("nexus_batches", JSON.stringify(ACADEMY_DATA.batches));
      localStorage.setItem("nexus_clean_zero_v2", "true");
    }
    this.getStudents();
    this.getBatches();
    this.getCapstones();
    this.getMessages();
  },

  getStudents: function() {
    const data = localStorage.getItem("nexus_students");
    let rawList = ACADEMY_DATA.initialStudents;
    if (data) {
      try {
        rawList = JSON.parse(data);
      } catch(e) {
        rawList = ACADEMY_DATA.initialStudents;
      }
    }

    // De-duplicate by unique student ID and email
    const seenIds = new Set();
    const seenEmails = new Set();
    const uniqueStudents = [];

    rawList.forEach(s => {
      if (!s || !s.id) return;
      const emailLower = (s.email || '').toLowerCase();
      if (!seenIds.has(s.id) && (!emailLower || !seenEmails.has(emailLower))) {
        seenIds.add(s.id);
        if (emailLower) seenEmails.add(emailLower);

        if (s.certificateAllotted === undefined) {
          s.certificateAllotted = s.status === 'Confirmed';
          s.certificateId = s.certificateId || `G-NEX-2026-${s.id.split('-').pop()}`;
          s.certificateGrade = s.certificateGrade || "Distinction (98%)";
          s.certificateDate = s.certificateDate || new Date().toISOString().slice(0, 10);
        }
        uniqueStudents.push(s);
      }
    });

    localStorage.setItem("nexus_students", JSON.stringify(uniqueStudents));
    return uniqueStudents;
  },
  
  saveStudent: function(student) {
    let students = this.getStudents();
    const emailLower = (student.email || '').toLowerCase();
    
    // Remove any duplicate records matching ID or Email
    students = students.filter(s => s.id !== student.id && (!emailLower || s.email.toLowerCase() !== emailLower));

    if (student.certificateAllotted === undefined) {
      student.certificateAllotted = false;
      student.certificateId = "";
      student.certificateGrade = "";
      student.certificateDate = "";
    }
    students.unshift(student);
    localStorage.setItem("nexus_students", JSON.stringify(students));
    localStorage.setItem("nexus_current_student", JSON.stringify(student));
    this.incrementBatchSeat(student.batchId);

    // Sync to Firebase Cloud Firestore & Realtime DB
    if (typeof FirebaseService !== 'undefined' && FirebaseService.isInitialized) {
      FirebaseService.saveStudentAdmission(student);
    }

    return student;
  },

  getCurrentStudent: function() {
    const data = localStorage.getItem("nexus_current_student");
    if (data) {
      try { return JSON.parse(data); } catch(e) {}
    }
    const students = this.getStudents();
    return students.length > 0 ? students[0] : null;
  },

  setCurrentStudent: function(student) {
    localStorage.setItem("nexus_current_student", JSON.stringify(student));
  },

  updateStudentStatus: function(studentId, newStatus) {
    const students = this.getStudents();
    const target = students.find(s => s.id === studentId);
    if (target) {
      target.status = newStatus;
      localStorage.setItem("nexus_students", JSON.stringify(students));
      
      const current = this.getCurrentStudent();
      if (current && current.id === studentId) {
        current.status = newStatus;
        localStorage.setItem("nexus_current_student", JSON.stringify(current));
      }
      return true;
    }
    return false;
  },

  // Allot certificate to a student by Admin
  allotCertificate: function(studentId, certDetails = {}) {
    const students = this.getStudents();
    const target = students.find(s => s.id === studentId);
    if (target) {
      target.certificateAllotted = true;
      target.certificateId = certDetails.id || `G-NEX-2026-${target.id.split('-').pop()}`;
      target.certificateGrade = certDetails.grade || "Distinction (98%)";
      target.certificateDate = certDetails.date || new Date().toISOString().slice(0, 10);
      target.status = target.status === 'Pending' ? 'Confirmed' : target.status;
      
      localStorage.setItem("nexus_students", JSON.stringify(students));

      const current = this.getCurrentStudent();
      if (current && current.id === studentId) {
        current.certificateAllotted = true;
        current.certificateId = target.certificateId;
        current.certificateGrade = target.certificateGrade;
        current.certificateDate = target.certificateDate;
        localStorage.setItem("nexus_current_student", JSON.stringify(current));
      }
      return target;
    }
    return null;
  },

  // Revoke certificate allotment
  revokeCertificate: function(studentId) {
    const students = this.getStudents();
    const target = students.find(s => s.id === studentId);
    if (target) {
      target.certificateAllotted = false;
      localStorage.setItem("nexus_students", JSON.stringify(students));

      const current = this.getCurrentStudent();
      if (current && current.id === studentId) {
        current.certificateAllotted = false;
        localStorage.setItem("nexus_current_student", JSON.stringify(current));
      }
      return true;
    }
    return false;
  },

  // Allot certificates in bulk to all students
  allotAllCertificates: function() {
    const students = this.getStudents();
    students.forEach(s => {
      s.certificateAllotted = true;
      s.certificateId = s.certificateId || `G-NEX-2026-${s.id.split('-').pop()}`;
      s.certificateGrade = s.certificateGrade || "Distinction (98%)";
      s.certificateDate = s.certificateDate || new Date().toISOString().slice(0, 10);
      s.status = "Confirmed";
    });
    localStorage.setItem("nexus_students", JSON.stringify(students));
    return students;
  },

  // ------------------------------------------------------------------------
  // CAPSTONE PROJECT PORTAL STORAGE
  // ------------------------------------------------------------------------
  getCapstones: function() {
    const data = localStorage.getItem("nexus_capstones");
    let rawList = ACADEMY_DATA.initialCapstones;
    if (data) {
      try {
        rawList = JSON.parse(data);
      } catch(e) {
        rawList = ACADEMY_DATA.initialCapstones;
      }
    }
    
    // De-duplicate capstones by ID
    const seen = new Set();
    const unique = [];
    rawList.forEach(c => {
      if (c && c.id && !seen.has(c.id)) {
        seen.add(c.id);
        unique.push(c);
      }
    });

    localStorage.setItem("nexus_capstones", JSON.stringify(unique));
    return unique;
  },

  submitCapstone: function(capstone) {
    let capstones = this.getCapstones();
    const newEntry = {
      id: `CAP-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: "Under Review",
      grade: "",
      facultyNotes: "Received by Faculty. Dr. Sarah Sterling and the academic board are reviewing your model code and architecture.",
      reviewedBy: "",
      reviewedAt: "",
      ...capstone
    };
    // De-duplicate any matching project title or ID
    capstones = capstones.filter(c => c.id !== newEntry.id && (c.projectTitle || '').toLowerCase() !== (newEntry.projectTitle || '').toLowerCase());
    capstones.unshift(newEntry);
    localStorage.setItem("nexus_capstones", JSON.stringify(capstones));
    return newEntry;
  },

  gradeCapstone: function(capstoneId, grade, notes, autoAllotCert = true) {
    const capstones = this.getCapstones();
    const target = capstones.find(c => c.id === capstoneId);
    if (target) {
      target.status = "Approved";
      target.grade = grade || "Distinction (98%)";
      target.facultyNotes = notes || "Capstone verified and approved for graduation.";
      target.reviewedBy = "Dr. Sarah Sterling";
      target.reviewedAt = new Date().toISOString().slice(0, 10);
      localStorage.setItem("nexus_capstones", JSON.stringify(capstones));

      // Auto allot Google certificate if requested
      if (autoAllotCert && target.studentId) {
        this.allotCertificate(target.studentId, {
          grade: target.grade,
          date: target.reviewedAt
        });
      }
      return target;
    }
    return null;
  },

  // ------------------------------------------------------------------------
  // MESSAGING & MENTORSHIP STORAGE
  // ------------------------------------------------------------------------
  getMessages: function(studentId) {
    const data = localStorage.getItem("nexus_messages");
    let allMsgs = ACADEMY_DATA.initialMessages;
    if (data) {
      try { allMsgs = JSON.parse(data); } catch(e) {}
    }

    // De-duplicate messages by ID
    const seen = new Set();
    const unique = [];
    allMsgs.forEach(m => {
      if (m && m.id && !seen.has(m.id)) {
        seen.add(m.id);
        unique.push(m);
      }
    });

    localStorage.setItem("nexus_messages", JSON.stringify(unique));

    if (studentId) {
      return unique.filter(m => m.studentId === studentId);
    }
    return unique;
  },

  sendMessage: function(msg) {
    let allMsgs = this.getMessages();
    const newMsg = {
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      ...msg
    };
    allMsgs = allMsgs.filter(m => m.id !== newMsg.id);
    allMsgs.push(newMsg);
    localStorage.setItem("nexus_messages", JSON.stringify(allMsgs));
    return newMsg;
  },

  getBatches: function() {
    const data = localStorage.getItem("nexus_batches");
    let rawList = ACADEMY_DATA.batches;
    if (data) {
      try {
        rawList = JSON.parse(data);
      } catch(e) {
        rawList = ACADEMY_DATA.batches;
      }
    }

    // De-duplicate batches by ID
    const seen = new Set();
    const unique = [];
    rawList.forEach(b => {
      if (b && b.id && !seen.has(b.id)) {
        seen.add(b.id);
        unique.push(b);
      }
    });

    localStorage.setItem("nexus_batches", JSON.stringify(unique));
    return unique;
  },

  saveBatch: function(batch) {
    let batches = this.getBatches();
    batches = batches.filter(b => b.id !== batch.id);
    batches.push(batch);
    localStorage.setItem("nexus_batches", JSON.stringify(batches));
    return batch;
  },

  incrementBatchSeat: function(batchId) {
    const batches = this.getBatches();
    const batch = batches.find(b => b.id === batchId);
    if (batch && batch.enrolledSeats < batch.maxSeats) {
      batch.enrolledSeats += 1;
      localStorage.setItem("nexus_batches", JSON.stringify(batches));
    }
  },

  resetToDefault: function() {
    localStorage.setItem("nexus_students", JSON.stringify([]));
    localStorage.setItem("nexus_batches", JSON.stringify(ACADEMY_DATA.batches));
    localStorage.removeItem("nexus_current_student");
    localStorage.setItem("nexus_capstones", JSON.stringify([]));
    localStorage.setItem("nexus_messages", JSON.stringify([]));
  }
};
