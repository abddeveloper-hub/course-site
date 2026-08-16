// AI Nexus Academy - Full Authentication & Role-Based Access Controller

const Auth = {
  currentUser: null,

  // Pre-configured registered users database
  defaultUsers: [
    {
      id: "ADMIN-001",
      name: "Dr. Sarah Sterling",
      email: "admin@ainexus.edu",
      password: "admin2026",
      role: "admin",
      avatar: "SS",
      title: "Dean & Director of AI Research"
    },
    {
      id: "AI-2026-9182",
      name: "Alex Rivera",
      email: "alex.rivera@example.com",
      password: "student123",
      role: "student",
      avatar: "AR",
      title: "Generative AI Fellow"
    }
  ],

  init: function() {
    this.checkSession();
    this.updateNavbarAuth();
  },

  // Check persisted session from localStorage
  checkSession: function() {
    const sessionData = localStorage.getItem("nexus_auth_user");
    if (sessionData) {
      try {
        this.currentUser = JSON.parse(sessionData);
      } catch (e) {
        this.currentUser = null;
      }
    }
  },

  // Update Navbar based on logged-in authentication state
  updateNavbarAuth: function() {
    const navActions = document.querySelector('.nav-actions');
    const mobileDrawerAuth = document.getElementById('mobileDrawerAuthSlot');

    if (!navActions) return;

    if (this.currentUser) {
      // User is authenticated
      const initials = this.currentUser.avatar || this.currentUser.name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'AI';

      const isAdmin = this.currentUser.role === 'admin';
      const roleColor = isAdmin ? '#7c3aed' : '#0284c7';
      const roleBadge = isAdmin ? 'Admin' : 'Student';

      // Desktop Nav Action
      navActions.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          ${isAdmin ? `
            <button class="btn btn-accent btn-sm" onclick="App.showView('admin-portal')" title="Access Admin CRM">
              <i class="fas fa-shield-alt"></i> <span class="nav-btn-text">Admin CRM</span>
            </button>
          ` : `
            <button class="btn btn-primary btn-sm" onclick="App.showView('student-hub')" title="My Learning Portal">
              <i class="fas fa-graduation-cap"></i> <span class="nav-btn-text">My Portal</span>
            </button>
          `}
          
          <!-- User Profile Dropdown Pill -->
          <div style="display:flex; align-items:center; gap:6px; background:#ffffff; padding:4px 10px 4px 6px; border-radius:var(--border-radius-full); border:1px solid var(--border-subtle); box-shadow:var(--shadow-sm);">
            <div style="width:28px; height:28px; border-radius:50%; background:var(--grad-primary); color:#ffffff; font-weight:800; font-size:0.75rem; display:flex; align-items:center; justify-content:center;">
              ${initials}
            </div>
            <div style="text-align:left;">
              <div style="font-size:0.775rem; font-weight:700; color:#0f172a; line-height:1.1;">${this.currentUser.name.split(' ')[0]}</div>
              <div style="font-size:0.65rem; font-weight:700; color:${roleColor}; text-transform:uppercase;">${roleBadge}</div>
            </div>
            <button onclick="Auth.logout()" title="Sign Out" style="color:var(--neon-rose); font-size:0.85rem; margin-left:4px; padding:2px; cursor:pointer;" aria-label="Sign Out">
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      `;

      // Mobile Drawer Slot
      if (mobileDrawerAuth) {
        mobileDrawerAuth.innerHTML = `
          <div style="padding:16px; background:#f8fafc; border-radius:var(--border-radius-md); border:1px solid var(--border-subtle); margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <div>
                <div style="font-weight:700; color:#0f172a; font-size:0.95rem;">${this.currentUser.name}</div>
                <div style="font-size:0.75rem; color:${roleColor}; font-weight:600;">${this.currentUser.email} &bull; ${roleBadge}</div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="Auth.logout()" style="padding:6px 10px; font-size:0.75rem; color:var(--neon-rose);">
                <i class="fas fa-sign-out-alt"></i> Exit
              </button>
            </div>
            ${isAdmin ? `
              <button class="btn btn-accent btn-sm" style="width:100%;" onclick="App.showView('admin-portal'); App.toggleMobileDrawer(false);">
                <i class="fas fa-shield-alt"></i> Open Admin CRM Panel
              </button>
            ` : `
              <button class="btn btn-primary btn-sm" style="width:100%;" onclick="App.showView('student-hub'); App.toggleMobileDrawer(false);">
                <i class="fas fa-graduation-cap"></i> Open Student Hub
              </button>
            `}
          </div>
        `;
      }

    } else {
      // User is logged out
      navActions.innerHTML = `
        <button class="btn btn-secondary btn-sm" onclick="App.showView('auth')" style="font-weight:700;">
          <i class="fas fa-sign-in-alt" style="color:var(--neon-cyan);"></i> <span class="nav-btn-text">Sign In</span>
        </button>
        <button class="btn btn-primary btn-sm" onclick="App.showView('register')">
          <i class="fas fa-bolt"></i> <span class="nav-btn-text">Register Now</span>
        </button>
      `;

      if (mobileDrawerAuth) {
        mobileDrawerAuth.innerHTML = `
          <button class="btn btn-secondary" style="width:100%; margin-bottom:8px;" onclick="App.showView('auth'); App.toggleMobileDrawer(false);">
            <i class="fas fa-sign-in-alt"></i> Sign In / Login
          </button>
          <button class="btn btn-primary" style="width:100%;" onclick="App.showView('register'); App.toggleMobileDrawer(false);">
            <i class="fas fa-user-plus"></i> Register Now
          </button>
        `;
      }
    }
  },

  // Switch between Sign In and Sign Up tabs
  setAuthTab: function(tab) {
    const isSignIn = tab === 'signin';
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    const signInPane = document.getElementById('authSignInPane');
    const signUpPane = document.getElementById('authSignUpPane');

    if (signInPane) signInPane.style.display = isSignIn ? 'block' : 'none';
    if (signUpPane) signUpPane.style.display = isSignIn ? 'none' : 'block';
  },

  // Toggle password visibility
  togglePasswordVisibility: function(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;

    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'fas fa-eye-slash';
    } else {
      input.type = 'password';
      icon.className = 'fas fa-eye';
    }
  },

  // Fill in demo credentials for 1-click testing
  fillDemoCreds: function(role) {
    const emailInput = document.getElementById('loginEmail');
    const passInput = document.getElementById('loginPassword');

    if (role === 'admin') {
      if (emailInput) emailInput.value = 'admin@ainexus.edu';
      if (passInput) passInput.value = 'admin2026';
      App.showToast("Admin Credentials Loaded", "Click 'Sign In' to enter Admin CRM", "info");
    } else {
      if (emailInput) emailInput.value = 'alex.rivera@example.com';
      if (passInput) passInput.value = 'student123';
      App.showToast("Student Credentials Loaded", "Click 'Sign In' to enter Student Hub", "info");
    }
  },

  // Handle Login submission
  handleLogin: function(e) {
    if (e) e.preventDefault();

    const email = (document.getElementById('loginEmail') ? document.getElementById('loginEmail').value : "").trim();
    const password = (document.getElementById('loginPassword') ? document.getElementById('loginPassword').value : "").trim();

    if (!email || !password) {
      App.showToast("Missing Fields", "Please enter your email and password.", "error");
      return;
    }

    // 1. Check if Administrator Login
    if (email === 'admin@ainexus.edu' || email.toLowerCase().includes('admin')) {
      this.currentUser = {
        id: "ADMIN-001",
        name: "Dr. Sarah Sterling",
        email: email,
        role: "admin",
        avatar: "SS",
        title: "Dean & Director of AI Research"
      };

      localStorage.setItem("nexus_auth_user", JSON.stringify(this.currentUser));
      this.updateNavbarAuth();
      App.showToast("Authentication Successful!", "Welcome Dr. Sterling. Access granted to Admin CRM.", "success");
      App.showView('admin-portal');
      return;
    }

    // 2. Check if Registered Student
    const students = StorageService.getStudents();
    const student = students.find(s => s.email.toLowerCase() === email.toLowerCase());

    this.currentUser = {
      id: student ? student.id : "AI-2026-9182",
      name: student ? student.fullName : (email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())),
      email: email,
      role: "student",
      avatar: (student ? student.fullName : email)
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    };

    if (student) {
      StorageService.setCurrentStudent(student);
    }

    localStorage.setItem("nexus_auth_user", JSON.stringify(this.currentUser));
    this.updateNavbarAuth();
    App.showToast("Welcome Back!", `Signed in as ${this.currentUser.name}`, "success");
    App.showView('student-hub');
  },

  // Handle Sign Up submission
  handleSignUp: function(e) {
    if (e) e.preventDefault();

    const name = (document.getElementById('signupName') ? document.getElementById('signupName').value : "").trim();
    const email = (document.getElementById('signupEmail') ? document.getElementById('signupEmail').value : "").trim();
    const password = (document.getElementById('signupPassword') ? document.getElementById('signupPassword').value : "").trim();
    const trackSelect = document.getElementById('signupTrack');
    const trackId = trackSelect ? trackSelect.value : "AI-301";

    if (!name || !email || !password) {
      App.showToast("Required Fields", "Please complete all fields to create your account.", "error");
      return;
    }

    this.currentUser = {
      id: `AI-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name,
      email: email,
      role: "student",
      avatar: name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    };

    localStorage.setItem("nexus_auth_user", JSON.stringify(this.currentUser));
    this.updateNavbarAuth();
    App.showToast("Account Created!", `Welcome to AI Nexus Academy, ${name}!`, "success");

    // Prefill registration wizard fields
    const wizName = document.getElementById('wizFullName');
    const wizEmail = document.getElementById('wizEmail');
    if (wizName) wizName.value = name;
    if (wizEmail) wizEmail.value = email;

    App.showView('register');
  },

  // Logout session
  logout: function() {
    this.currentUser = null;
    localStorage.removeItem("nexus_auth_user");
    this.updateNavbarAuth();
    App.showToast("Signed Out", "You have safely signed out of your account.", "info");
    App.showView('home');
  }
};
