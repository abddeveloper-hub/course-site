/**
 * NEXVION AI — Dedicated Student Registration System
 * Multi-step form management, validation, data preservation & Firebase-ready payload
 */

(function () {
  'use strict';

  // --- STATE ---
  let currentStep = 1;
  const totalSteps = 4;
  const maxVisitedStep = { value: 1 };

  // Form Data Store (preserves entered values)
  const formData = {
    // Step 1: Account
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Step 2: Profile
    dateOfBirth: '',
    country: '',
    state: '',
    city: '',
    educationLevel: '',
    institution: '',
    course: '',
    yearOfStudy: '',
    background: '',

    // Step 3: AI & Learning
    aiExperience: 'Complete Beginner',
    interests: ['AI Fundamentals', 'Generative AI', 'Prompt Engineering'],
    learningGoal: '',
    referralSource: '',
    projectGoal: '',

    // Step 4: Consent
    termsConsent: false
  };

  // --- DOM ELEMENTS ---
  const form = document.getElementById('registration-form');
  const stepperTabs = document.querySelectorAll('.step-tab');
  const stepperFill = document.getElementById('stepper-track-fill');
  const stepPanes = document.querySelectorAll('.step-pane');
  const journeyNodes = document.querySelectorAll('.journey-node');
  const successView = document.getElementById('register-success-view');

  // Input references
  const inputFullName = document.getElementById('fullName');
  const inputEmail = document.getElementById('email');
  const inputPhone = document.getElementById('phone');
  const inputPassword = document.getElementById('password');
  const inputConfirmPassword = document.getElementById('confirmPassword');

  const inputDob = document.getElementById('dateOfBirth');
  const selectCountry = document.getElementById('country');
  const inputState = document.getElementById('state');
  const inputCity = document.getElementById('city');
  const selectEducation = document.getElementById('educationLevel');
  const inputInstitution = document.getElementById('institution');
  const inputCourse = document.getElementById('course');
  const selectYear = document.getElementById('yearOfStudy');
  const selectBackground = document.getElementById('background');

  const inputAiExpHidden = document.getElementById('aiExperience');
  const expCards = document.querySelectorAll('.exp-card');
  const interestPills = document.querySelectorAll('.interest-pill');
  const selectGoal = document.getElementById('learningGoal');
  const selectReferral = document.getElementById('referralSource');
  const textareaProject = document.getElementById('projectGoal');

  const checkTerms = document.getElementById('termsConsent');

  // --- PASSWORD REQUIREMENT LIVE CHECKS ---
  const critLength = document.getElementById('crit-length');
  const critUpper = document.getElementById('crit-upper');
  const critNumber = document.getElementById('crit-number');

  function updatePasswordCriteria(val) {
    const isLenValid = val.length >= 8;
    const isUpperValid = /[A-Z]/.test(val);
    const isNumValid = /[0-9]/.test(val);

    setCriteriaState(critLength, isLenValid);
    setCriteriaState(critUpper, isUpperValid);
    setCriteriaState(critNumber, isNumValid);

    return isLenValid && isUpperValid && isNumValid;
  }

  function setCriteriaState(elem, isValid) {
    if (!elem) return;
    if (isValid) {
      elem.classList.add('valid');
      elem.querySelector('.pw-crit-icon').textContent = '✓';
    } else {
      elem.classList.remove('valid');
      elem.querySelector('.pw-crit-icon').textContent = '○';
    }
  }

  // --- PASSWORD TOGGLE BUTTONS ---
  const togglePw1 = document.getElementById('toggle-pw-1');
  const togglePw2 = document.getElementById('toggle-pw-2');

  function setupPasswordToggle(button, input) {
    if (!button || !input) return;
    button.addEventListener('click', function () {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      button.innerHTML = isPassword
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    });
  }

  setupPasswordToggle(togglePw1, inputPassword);
  setupPasswordToggle(togglePw2, inputConfirmPassword);

  if (inputPassword) {
    inputPassword.addEventListener('input', function () {
      updatePasswordCriteria(this.value);
      hideError('password');
      if (inputConfirmPassword.value) {
        if (inputConfirmPassword.value === this.value) {
          hideError('confirmPassword');
        }
      }
    });
  }

  if (inputConfirmPassword) {
    inputConfirmPassword.addEventListener('input', function () {
      if (this.value === inputPassword.value) {
        hideError('confirmPassword');
      }
    });
  }

  // --- STEP 3 INTERACTIVE SELECTIONS ---
  // Single Selection: AI Experience Cards
  expCards.forEach(card => {
    card.addEventListener('click', function () {
      expCards.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      const val = this.getAttribute('data-exp');
      formData.aiExperience = val;
      if (inputAiExpHidden) inputAiExpHidden.value = val;
    });
  });

  // Multiple Selection: What do you want to learn pills
  interestPills.forEach(pill => {
    pill.addEventListener('click', function () {
      this.classList.toggle('selected');
      const val = this.getAttribute('data-value');
      if (this.classList.contains('selected')) {
        if (!formData.interests.includes(val)) {
          formData.interests.push(val);
        }
      } else {
        formData.interests = formData.interests.filter(item => item !== val);
      }

      if (formData.interests.length > 0) {
        hideError('interests');
      }
    });
  });

  // --- INLINE ERROR HANDLING ---
  function showError(fieldId, customMessage) {
    const errorMsg = document.getElementById('err-' + fieldId);
    const inputElem = document.getElementById(fieldId);

    if (errorMsg) {
      if (customMessage) errorMsg.textContent = customMessage;
      errorMsg.classList.add('visible');
    }
    if (inputElem) {
      inputElem.classList.add('has-error');
    }
  }

  function hideError(fieldId) {
    const errorMsg = document.getElementById('err-' + fieldId);
    const inputElem = document.getElementById(fieldId);

    if (errorMsg) errorMsg.classList.remove('visible');
    if (inputElem) inputElem.classList.remove('has-error');
  }

  // Clear errors on input
  [inputFullName, inputEmail, inputPhone, inputDob, selectCountry, inputState, inputCity, selectEducation, inputInstitution, inputCourse, selectYear, selectBackground, selectGoal, selectReferral].forEach(field => {
    if (!field) return;
    const evtName = field.tagName === 'SELECT' ? 'change' : 'input';
    field.addEventListener(evtName, () => hideError(field.id));
  });

  if (checkTerms) {
    checkTerms.addEventListener('change', () => hideError('termsConsent'));
  }

  // --- VALIDATION ENGINES ---
  function validateStep1() {
    let isValid = true;

    // Full Name
    const nameVal = inputFullName ? inputFullName.value.trim() : '';
    if (!nameVal || nameVal.length < 2) {
      showError('fullName', 'Please enter your full name (at least 2 letters).');
      isValid = false;
    } else {
      hideError('fullName');
      formData.fullName = nameVal;
    }

    // Email
    const emailVal = inputEmail ? inputEmail.value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      showError('email', 'Please enter a valid email address.');
      isValid = false;
    } else {
      hideError('email');
      formData.email = emailVal;
    }

    // Phone
    const phoneVal = inputPhone ? inputPhone.value.trim() : '';
    const digitsOnly = phoneVal.replace(/[^0-9]/g, '');
    if (!phoneVal || digitsOnly.length < 7 || digitsOnly.length > 15) {
      showError('phone', 'Please enter a valid phone number (7-15 digits).');
      isValid = false;
    } else {
      hideError('phone');
      formData.phone = phoneVal;
    }

    // Password criteria
    const pwVal = inputPassword ? inputPassword.value : '';
    const pwMeets = updatePasswordCriteria(pwVal);
    if (!pwMeets) {
      showError('password', 'Password must meet all 3 requirements below.');
      isValid = false;
    } else {
      hideError('password');
      formData.password = pwVal;
    }

    // Confirm password
    const confirmVal = inputConfirmPassword ? inputConfirmPassword.value : '';
    if (!confirmVal || confirmVal !== pwVal) {
      showError('confirmPassword', 'Passwords do not match.');
      isValid = false;
    } else {
      hideError('confirmPassword');
      formData.confirmPassword = confirmVal;
    }

    return isValid;
  }

  function validateStep2() {
    let isValid = true;

    // Date of Birth
    const dobVal = inputDob ? inputDob.value : '';
    if (!dobVal) {
      showError('dateOfBirth', 'Please enter your date of birth.');
      isValid = false;
    } else {
      hideError('dateOfBirth');
      formData.dateOfBirth = dobVal;
    }

    // Country
    const countryVal = selectCountry ? selectCountry.value : '';
    if (!countryVal) {
      showError('country', 'Please select your country.');
      isValid = false;
    } else {
      hideError('country');
      formData.country = countryVal;
    }

    // State / Region
    const stateVal = inputState ? inputState.value.trim() : '';
    if (!stateVal) {
      showError('state', 'Please enter your state or region.');
      isValid = false;
    } else {
      hideError('state');
      formData.state = stateVal;
    }

    // City
    const cityVal = inputCity ? inputCity.value.trim() : '';
    if (!cityVal) {
      showError('city', 'Please enter your city.');
      isValid = false;
    } else {
      hideError('city');
      formData.city = cityVal;
    }

    // Education Level
    const eduVal = selectEducation ? selectEducation.value : '';
    if (!eduVal) {
      showError('educationLevel', 'Please select your education level.');
      isValid = false;
    } else {
      hideError('educationLevel');
      formData.educationLevel = eduVal;
    }

    // Background
    const bgVal = selectBackground ? selectBackground.value : '';
    if (!bgVal) {
      showError('background', 'Please select your current background.');
      isValid = false;
    } else {
      hideError('background');
      formData.background = bgVal;
    }

    // Institution
    const instVal = inputInstitution ? inputInstitution.value.trim() : '';
    if (!instVal) {
      showError('institution', 'Please enter your institution or college.');
      isValid = false;
    } else {
      hideError('institution');
      formData.institution = instVal;
    }

    // Course / Program
    const courseVal = inputCourse ? inputCourse.value.trim() : '';
    if (!courseVal) {
      showError('course', 'Please enter your course or program.');
      isValid = false;
    } else {
      hideError('course');
      formData.course = courseVal;
    }

    // Year of Study
    const yearVal = selectYear ? selectYear.value : '';
    if (!yearVal) {
      showError('yearOfStudy', 'Please select your year of study.');
      isValid = false;
    } else {
      hideError('yearOfStudy');
      formData.yearOfStudy = yearVal;
    }

    return isValid;
  }

  function validateStep3() {
    let isValid = true;

    // AI Experience
    const expVal = inputAiExpHidden ? inputAiExpHidden.value : formData.aiExperience;
    formData.aiExperience = expVal || 'Complete Beginner';

    // Interests (at least 1 required)
    if (formData.interests.length === 0) {
      showError('interests', 'Please select at least one learning topic.');
      isValid = false;
    } else {
      hideError('interests');
    }

    // Main Goal
    const goalVal = selectGoal ? selectGoal.value : '';
    if (!goalVal) {
      showError('learningGoal', 'Please select your primary goal.');
      isValid = false;
    } else {
      hideError('learningGoal');
      formData.learningGoal = goalVal;
    }

    // Referral Source
    const refVal = selectReferral ? selectReferral.value : '';
    if (!refVal) {
      showError('referralSource', 'Please let us know how you heard about NEXVION.');
      isValid = false;
    } else {
      hideError('referralSource');
      formData.referralSource = refVal;
    }

    // Optional project goal
    if (textareaProject) {
      formData.projectGoal = textareaProject.value.trim();
    }

    return isValid;
  }

  function validateStep4() {
    let isValid = true;

    if (!checkTerms || !checkTerms.checked) {
      showError('termsConsent', 'You must agree to the Terms & Conditions and Privacy Policy to create your account.');
      isValid = false;
    } else {
      hideError('termsConsent');
      formData.termsConsent = true;
    }

    return isValid;
  }

  // --- POPULATE REVIEW SUMMARY (Step 4) ---
  function populateReviewScreen() {
    // Account details
    const revName = document.getElementById('rev-fullName');
    const revEmail = document.getElementById('rev-email');
    const revPhone = document.getElementById('rev-phone');

    if (revName) revName.textContent = formData.fullName || '—';
    if (revEmail) revEmail.textContent = formData.email || '—';
    if (revPhone) revPhone.textContent = formData.phone || '—';

    // Academic Profile
    const revEdu = document.getElementById('rev-education');
    const revInst = document.getElementById('rev-institution');
    const revCourse = document.getElementById('rev-course');
    const revLoc = document.getElementById('rev-location');

    if (revEdu) revEdu.textContent = `${formData.educationLevel || 'Student'} • ${formData.yearOfStudy || 'Active'}`;
    if (revInst) revInst.textContent = formData.institution || '—';
    if (revCourse) revCourse.textContent = `${formData.course || 'Technology'} (${formData.background || 'Student'})`;
    if (revLoc) revLoc.textContent = `${formData.city ? formData.city + ', ' : ''}${formData.state ? formData.state + ', ' : ''}${formData.country || 'Global'}`;

    // AI Profile
    const revAiExp = document.getElementById('rev-aiExperience');
    const revTagsWrap = document.getElementById('rev-interests-tags');
    const revGoal = document.getElementById('rev-goal');

    if (revAiExp) revAiExp.textContent = formData.aiExperience;
    if (revGoal) revGoal.textContent = `${formData.learningGoal || 'Understand AI'} (via ${formData.referralSource || 'Online'})`;

    if (revTagsWrap) {
      revTagsWrap.innerHTML = '';
      if (formData.interests.length > 0) {
        formData.interests.forEach(interest => {
          const tag = document.createElement('span');
          tag.className = 'review-mini-tag';
          tag.textContent = interest;
          revTagsWrap.appendChild(tag);
        });
      } else {
        revTagsWrap.innerHTML = '<span class="review-mini-tag">AI Fundamentals</span>';
      }
    }
  }

  // --- STEP NAVIGATION ---
  function goToStep(stepNum) {
    if (stepNum < 1 || stepNum > totalSteps) return;

    // Update current step
    currentStep = stepNum;
    if (stepNum > maxVisitedStep.value) {
      maxVisitedStep.value = stepNum;
    }

    // 1. Update Panes
    stepPanes.forEach((pane, idx) => {
      if (idx + 1 === stepNum) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    // 2. Update Stepper Tabs
    stepperTabs.forEach((tab, idx) => {
      const tabStep = idx + 1;
      tab.classList.remove('active');

      if (tabStep === stepNum) {
        tab.classList.add('active');
        tab.removeAttribute('disabled');
      } else if (tabStep < stepNum || tabStep <= maxVisitedStep.value) {
        tab.classList.add('completed');
        tab.removeAttribute('disabled');
      } else {
        tab.classList.remove('completed');
        tab.setAttribute('disabled', 'true');
      }
    });

    // 3. Update Stepper Fill Line
    if (stepperFill) {
      const percentage = ((stepNum - 1) / (totalSteps - 1)) * 100;
      stepperFill.style.width = percentage + '%';
    }

    // 4. Update Left Journey Timeline
    journeyNodes.forEach((node, idx) => {
      const nodeStep = idx + 1;
      node.classList.remove('active');
      if (nodeStep === stepNum) {
        node.classList.add('active');
      } else if (nodeStep < stepNum) {
        node.classList.add('completed');
      }
    });

    // 5. If Step 4, populate the review data
    if (stepNum === 4) {
      populateReviewScreen();
    }

    // Scroll smoothly to top of form panel on mobile
    const panel = document.querySelector('.register-form-panel');
    if (panel && window.innerWidth <= 768) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // --- ATTACH EVENT LISTENERS ---

  // Next Buttons
  const btnNext1 = document.getElementById('btn-next-1');
  if (btnNext1) {
    btnNext1.addEventListener('click', function () {
      if (validateStep1()) {
        goToStep(2);
      }
    });
  }

  const btnNext2 = document.getElementById('btn-next-2');
  if (btnNext2) {
    btnNext2.addEventListener('click', function () {
      if (validateStep2()) {
        goToStep(3);
      }
    });
  }

  const btnNext3 = document.getElementById('btn-next-3');
  if (btnNext3) {
    btnNext3.addEventListener('click', function () {
      if (validateStep3()) {
        goToStep(4);
      }
    });
  }

  // Back Buttons
  document.querySelectorAll('.btn-step-back').forEach(btn => {
    btn.addEventListener('click', function () {
      const targetStep = parseInt(this.getAttribute('data-to-step'), 10);
      if (targetStep) {
        goToStep(targetStep);
      } else {
        goToStep(Math.max(1, currentStep - 1));
      }
    });
  });

  // Edit buttons in review screen
  document.querySelectorAll('.btn-review-edit').forEach(btn => {
    btn.addEventListener('click', function () {
      const targetStep = parseInt(this.getAttribute('data-edit-step'), 10);
      if (targetStep) goToStep(targetStep);
    });
  });

  // Top Stepper tab clicks
  stepperTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const targetStep = parseInt(this.getAttribute('data-step'), 10);
      if (targetStep && targetStep <= maxVisitedStep.value) {
        // Run validation if jumping ahead
        if (targetStep > currentStep) {
          if (currentStep === 1 && !validateStep1()) return;
          if (currentStep === 2 && !validateStep2()) return;
          if (currentStep === 3 && !validateStep3()) return;
        }
        goToStep(targetStep);
      }
    });
  });

  // --- FINAL FORM SUBMISSION & SUCCESS VIEW ---
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateStep4()) {
        return;
      }

      const submitBtn = document.getElementById('btn-submit-registration');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 0.8s linear infinite; margin-right: 8px;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
          </svg>
          <span>Creating Academy Account...</span>
        `;
      }

      // Generate a structured student user profile (Firebase-ready schema)
      const randomIdSuffix = Math.floor(10000 + Math.random() * 90000);
      const studentId = `NX-2026-${randomIdSuffix}`;
      const generatedUserId = `nx_usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

      const studentProfile = {
        userId: generatedUserId,
        studentId: studentId,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        educationLevel: formData.educationLevel,
        institution: formData.institution,
        course: formData.course,
        yearOfStudy: formData.yearOfStudy,
        background: formData.background,
        aiExperience: formData.aiExperience,
        interests: [...formData.interests],
        learningGoal: formData.learningGoal,
        referralSource: formData.referralSource,
        projectGoal: formData.projectGoal || '',
        role: 'student', // Default unchangeable role
        createdAt: new Date().toISOString(),
        profilePhoto: null
      };

      // In accordance with security best practices, passwords are NOT stored in the exported student profile.
      // Separate authentication object prepared for future Firebase Auth integration:
      const authCredentialReference = {
        email: formData.email,
        authProvider: 'firebase_ready_password_hash',
        verified: false,
        lastLogin: new Date().toISOString()
      };

      // Save locally to persist student session in browser
      try {
        localStorage.setItem('nexvion_current_user', JSON.stringify(studentProfile));
        localStorage.setItem('nexvion_auth_ref', JSON.stringify(authCredentialReference));

        // Maintain array of all registrations
        const existingUsers = JSON.parse(localStorage.getItem('nexvion_registered_users') || '[]');
        existingUsers.push({
          studentId: studentProfile.studentId,
          email: studentProfile.email,
          fullName: studentProfile.fullName,
          createdAt: studentProfile.createdAt
        });
        localStorage.setItem('nexvion_registered_users', JSON.stringify(existingUsers));
      } catch (err) {
        console.warn('LocalStorage save notice:', err);
      }

      // Simulate smooth network handshake (600ms)
      setTimeout(function () {
        // Hide stepper and form
        const stepper = document.getElementById('register-stepper');
        if (stepper) stepper.style.display = 'none';
        form.style.display = 'none';

        // Populate student badge preview on Success Screen
        const cardName = document.getElementById('card-student-name');
        const cardId = document.getElementById('card-student-id');
        const cardEmail = document.getElementById('card-student-email');
        const cardTrack = document.getElementById('card-student-track');

        if (cardName) cardName.textContent = studentProfile.fullName;
        if (cardId) cardId.textContent = studentProfile.studentId;
        if (cardEmail) cardEmail.textContent = studentProfile.email;
        if (cardTrack) cardTrack.textContent = studentProfile.learningGoal || 'Foundational to Production';

        // Mark Node 4 completed in left panel
        journeyNodes.forEach(n => n.classList.add('completed'));

        // Show Success View
        if (successView) {
          successView.classList.add('active');
        }

        // Scroll to top of card smoothly
        const wrapper = document.querySelector('.register-wrapper');
        if (wrapper) wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 700);
    });
  }

  // Add simple CSS spin keyframe dynamically if not present
  if (!document.getElementById('spinner-keyframes')) {
    const style = document.createElement('style');
    style.id = 'spinner-keyframes';
    style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
  }

  // --- CHECK EXISTING STUDENT REGISTRATION SESSION ---
  function checkExistingRegistration() {
    try {
      const savedUserStr = localStorage.getItem('nexvion_current_user');
      if (!savedUserStr) return false;

      const studentProfile = JSON.parse(savedUserStr);
      if (!studentProfile || !studentProfile.fullName) return false;

      const urlParams = new URLSearchParams(window.location.search);
      const paramCourse = urlParams.get('course');
      const paramBatch = urlParams.get('batch');

      // Course name mapping
      const courseNames = {
        'ai-foundations': 'AI FOUNDATIONS',
        'ai-builder': 'AI BUILDER',
        'ai-creator': 'AI CREATOR',
        'ai-architect': 'AI ARCHITECT'
      };

      // If student clicked to join a course while already registered, update their enrollment
      let courseUpdated = false;
      if (paramCourse && courseNames[paramCourse]) {
        studentProfile.enrolledCourse = courseNames[paramCourse];
        studentProfile.enrolledCourseId = paramCourse;
        if (paramBatch) studentProfile.batch = paramBatch;
        localStorage.setItem('nexvion_current_user', JSON.stringify(studentProfile));
        courseUpdated = true;
      }

      // Hide Stepper and Form
      const stepper = document.getElementById('register-stepper');
      if (stepper) stepper.style.display = 'none';
      if (form) form.style.display = 'none';

      // Populate student badge preview on Success Screen
      const cardName = document.getElementById('card-student-name');
      const cardId = document.getElementById('card-student-id');
      const cardEmail = document.getElementById('card-student-email');
      const cardTrack = document.getElementById('card-student-track');

      if (cardName) cardName.textContent = studentProfile.fullName;
      if (cardId) cardId.textContent = studentProfile.studentId || 'NX-2026-ACTIVE';
      if (cardEmail) cardEmail.textContent = studentProfile.email || 'student@nexvion.ai';
      if (cardTrack) cardTrack.textContent = studentProfile.enrolledCourse || 'AI Foundations';

      // Update titles and message on Success View
      const successTitle = document.querySelector('.success-title');
      const successTagline = document.querySelector('.success-tagline');
      const successMsg = document.querySelector('.success-message');

      const firstName = studentProfile.fullName.trim().split(' ')[0] || 'Student';

      if (successTitle) {
        successTitle.textContent = `WELCOME BACK, ${firstName.toUpperCase()} 👋`;
      }
      if (successTagline) {
        successTagline.textContent = courseUpdated
          ? `ENROLLED IN ${studentProfile.enrolledCourse.toUpperCase()}`
          : 'STUDENT ACCOUNT ALREADY ACTIVE';
      }
      if (successMsg) {
        successMsg.innerHTML = courseUpdated
          ? `Your course enrollment has been updated to <strong>${studentProfile.enrolledCourse}</strong>. You are already an authenticated Academy student (ID: <strong>${studentProfile.studentId || 'SSA-2026-ACTIVE'}</strong>) and do not need to register again.`
          : `You have already completed your Synthetic Systems Academy registration (ID: <strong>${studentProfile.studentId || 'SSA-2026-ACTIVE'}</strong>). Your curriculum access for <strong>${studentProfile.enrolledCourse || 'Compiler Engineering'}</strong> is ready in your dashboard.`;
      }

      // Mark all journey nodes completed
      journeyNodes.forEach(n => n.classList.add('completed'));

      // Append "Register a different account" reset link if not already added
      const actionsRow = document.querySelector('.success-actions-row');
      if (actionsRow && !document.getElementById('reset-session-wrap')) {
        const resetWrap = document.createElement('div');
        resetWrap.id = 'reset-session-wrap';
        resetWrap.style.cssText = 'margin-top: 18px; font-size: 0.8125rem; color: var(--text-muted); text-align: center; width: 100%;';
        resetWrap.innerHTML = `Not ${studentProfile.fullName}? <a href="javascript:void(0)" id="btn-reset-session" style="color: var(--accent-purple-light); text-decoration: underline; margin-left: 4px;">Register a different account</a>`;
        actionsRow.parentElement.appendChild(resetWrap);

        const resetBtn = document.getElementById('btn-reset-session');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            localStorage.removeItem('nexvion_current_user');
            window.location.href = 'register.html';
          });
        }
      }

      // Reveal Success View
      if (successView) {
        successView.classList.add('active');
      }

      return true; // Already registered!
    } catch (err) {
      console.warn('Error reading existing registration:', err);
      return false;
    }
  }

  // Parse URL query parameters to pre-fill selected course and batch
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const paramCourse = urlParams.get('course');
    const paramBatch = urlParams.get('batch');
    if (paramCourse) {
      formData.selectedCourseId = paramCourse;
      formData.selectedBatchId = paramBatch || 'batch-01';

      // Map course ID to intuitive initial choices
      const courseMap = {
        'ai-foundations': { name: 'AI FOUNDATIONS', goal: 'Understand AI', exp: 'Complete Beginner' },
        'ai-builder': { name: 'AI BUILDER', goal: 'Build websites', exp: 'I\'ve experimented with AI' },
        'ai-creator': { name: 'AI CREATOR', goal: 'Build apps', exp: 'Comfortable with AI tools' },
        'ai-architect': { name: 'AI ARCHITECT', goal: 'Start AI projects', exp: 'Advanced AI user' }
      };

      if (courseMap[paramCourse]) {
        const cInfo = courseMap[paramCourse];
        if (cInfo.goal && selectGoal) selectGoal.value = cInfo.goal;
        if (cInfo.exp) {
          const expCard = document.querySelector(`.exp-card[data-exp="${cInfo.exp}"]`);
          if (expCard) expCard.click();
        }
      }
    }
  } catch (e) {
    console.warn('URL param parse notice:', e);
  }

  // Check if student is already registered before showing registration form
  const isAlreadyRegistered = checkExistingRegistration();
  if (!isAlreadyRegistered) {
    // Initialize Step 1
    goToStep(1);
  }

})();

