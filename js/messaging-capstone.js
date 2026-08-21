// AI Nexus Academy - Faculty-Student Live Messaging & Capstone Review Portal
// Handles two-way mentor communications, capstone project evaluation, and auto-credentialing

const MessagingPortal = {
  // Render Student Chat Stream in Student Hub
  renderStudentChat: function(containerId, studentId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const currentStudent = studentId ? { id: studentId } : (StorageService.getCurrentStudent() || { id: "AI-2026-9182", fullName: "Alex Rivera" });
    const messages = StorageService.getMessages(currentStudent.id);

    const streamHTML = messages.map(m => {
      const isStudent = m.sender === 'student';
      return `
        <div class="chat-bubble ${isStudent ? 'student' : 'faculty'}">
          <div style="font-weight:700; font-size:0.75rem; margin-bottom:2px;">
            ${isStudent ? 'You (' + m.senderName + ')' : '<i class="fas fa-graduation-cap" style="color:#1a73e8;"></i> ' + m.senderName + ' <span style="color:#64748b; font-weight:400;">(' + (m.senderRole || 'Faculty Mentor') + ')</span>'}
          </div>
          <div>${m.text}</div>
          <div class="chat-bubble-meta">
            <span>${m.timestamp}</span>
            ${isStudent ? '<i class="fas fa-check-double" style="font-size:0.65rem;"></i>' : ''}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="mentorship-chat-box">
        <div class="chat-header">
          <div class="chat-mentor-info">
            <div class="chat-mentor-avatar">SS</div>
            <div>
              <div style="font-weight:800; font-size:0.95rem; color:#0f172a;">Dr. Sarah Sterling</div>
              <div style="font-size:0.75rem; color:#059669; display:flex; align-items:center; gap:4px;">
                <span class="pulse-dot" style="width:6px; height:6px; background:#059669;"></span> Active Faculty Lead & Academic Dean
              </div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" style="font-size:0.75rem; padding:4px 10px;" onclick="MessagingPortal.sendQuickQuestion('${currentStudent.id}')">
            <i class="fas fa-magic"></i> Quick Capstone Help
          </button>
        </div>

        <div class="chat-stream" id="chatStreamBox">
          ${messages.length > 0 ? streamHTML : '<p style="text-align:center; color:#94a3b8; padding:30px 0;">No messages yet. Send your first inquiry to Dr. Sterling below.</p>'}
        </div>

        <div class="chat-footer">
          <input type="text" class="chat-input" id="studentChatInput" placeholder="Ask Dr. Sterling about model architecture, datasets, or capstone evaluation..." onkeydown="if(event.key==='Enter') MessagingPortal.sendStudentMessage('${currentStudent.id}')">
          <button class="btn btn-primary" style="border-radius:24px; padding:10px 18px;" onclick="MessagingPortal.sendStudentMessage('${currentStudent.id}')">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;

    // Auto scroll to bottom
    const box = document.getElementById('chatStreamBox');
    if (box) box.scrollTop = box.scrollHeight;
  },

  // Student Sends Message
  sendStudentMessage: function(studentId) {
    const input = document.getElementById('studentChatInput');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';

    const currentStudent = StorageService.getCurrentStudent() || { id: studentId || "AI-2026-9182", fullName: "Alex Rivera" };

    StorageService.sendMessage({
      studentId: currentStudent.id,
      sender: "student",
      senderName: currentStudent.fullName,
      senderRole: "Student",
      text: text
    });

    this.renderStudentChat('studentMentorshipChatContainer', currentStudent.id);

    // Realistic Faculty Mentor Simulated Response
    setTimeout(() => {
      const responses = [
        "Thank you for sharing your architecture query, " + currentStudent.fullName + ". I recommend testing with a retrieval reranker (e.g. Cohere Rerank) to improve precision before submitting your capstone.",
        "Your pipeline structure looks solid! Ensure that your model evaluation metrics include F1-score and inference latency under batch loads for full distinction marks.",
        "Great progress! I've flagged your progress with the board. Once you submit your GitHub repo in the Capstone Desk, I'll review and authorize your Google Career Certificate.",
        "Noted! Make sure all environment variables and API keys are abstracted in your `.env.example` file in your repository submission."
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];

      StorageService.sendMessage({
        studentId: currentStudent.id,
        sender: "faculty",
        senderName: "Dr. Sarah Sterling",
        senderRole: "Dean of AI Research",
        text: reply
      });

      this.renderStudentChat('studentMentorshipChatContainer', currentStudent.id);
      App.showToast("New Mentor Reply 💬", "Dr. Sarah Sterling responded to your inquiry.", "info");
    }, 1200);
  },

  sendQuickQuestion: function(studentId) {
    const prompts = [
      "Hello Dr. Sterling! Could you review our vector database chunking strategy for the capstone?",
      "Hi Faculty Team! What are the minimum benchmarking requirements for Distinction honors?",
      "Hello Dr. Sterling, I have updated my PyTorch training scripts with distributed DDP. Is that sufficient for MLOps criteria?"
    ];
    const picked = prompts[Math.floor(Math.random() * prompts.length)];
    const input = document.getElementById('studentChatInput');
    if (input) {
      input.value = picked;
      this.sendStudentMessage(studentId);
    }
  },

  // Render Admin Messaging Queue
  renderAdminChatQueue: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const allMsgs = StorageService.getMessages();
    const students = StorageService.getStudents();

    // Group messages by student
    const studentIds = [...new Set(allMsgs.map(m => m.studentId))];

    container.innerHTML = studentIds.map(sid => {
      const studentMsgs = allMsgs.filter(m => m.studentId === sid);
      const studentInfo = students.find(s => s.id === sid) || { fullName: "Student " + sid, email: "student@ainexus.edu", trackTitle: "AI Specialization" };
      const lastMsg = studentMsgs[studentMsgs.length - 1];

      return `
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:14px; box-shadow:var(--shadow-sm);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg, #0284c7, #7c3aed); color:#fff; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:0.85rem;">
                ${studentInfo.fullName.split(' ').map(n=>n[0]).join('')}
              </div>
              <div>
                <strong style="color:#0f172a; font-size:0.95rem;">${studentInfo.fullName}</strong>
                <span style="font-size:0.75rem; color:#64748b; margin-left:6px;">(${sid})</span>
                <div style="font-size:0.8rem; color:#0284c7;">${studentInfo.trackTitle}</div>
              </div>
            </div>
            <span style="font-size:0.75rem; color:#64748b;">${lastMsg ? lastMsg.timestamp : ''}</span>
          </div>

          <div style="background:#f8fafc; border:1px solid #f1f5f9; border-radius:8px; padding:10px 14px; font-size:0.85rem; color:#334155; margin-bottom:12px;">
            <strong>Latest message:</strong> "${lastMsg ? lastMsg.text : 'No messages'}"
          </div>

          <div style="display:flex; gap:8px;">
            <input type="text" class="input-custom" id="adminReplyInput_${sid}" placeholder="Type faculty response..." style="font-size:0.85rem; padding:6px 12px;">
            <button class="btn btn-primary btn-sm" onclick="MessagingPortal.sendFacultyReply('${sid}')">
              <i class="fas fa-reply"></i> Reply
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  sendFacultyReply: function(studentId) {
    const input = document.getElementById(`adminReplyInput_${studentId}`);
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';

    StorageService.sendMessage({
      studentId: studentId,
      sender: "faculty",
      senderName: "Faculty Admissions & Review Board",
      senderRole: "Dean & Accreditation Staff",
      text: text
    });

    App.showToast("Reply Sent 📤", `Mentorship message sent to student (${studentId}).`, "success");
    this.renderAdminChatQueue('adminInquiriesQueueContainer');
  }
};

const CapstonePortal = {
  // Render Student Capstone Desk in Student Hub
  renderStudentCapstoneDesk: function(containerId, studentId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const currentStudent = studentId ? { id: studentId } : (StorageService.getCurrentStudent() || { id: "AI-2026-9182", fullName: "Alex Rivera", trackTitle: "Generative AI, LLMs & Autonomous AI Agents" });
    const capstones = StorageService.getCapstones();
    const studentCapstone = capstones.find(c => c.studentId === currentStudent.id);

    if (studentCapstone) {
      // Show Existing Submission Status
      const isApproved = studentCapstone.status === 'Approved';

      container.innerHTML = `
        <div class="capstone-status-card" style="border-left: 4px solid ${isApproved ? '#10b981' : '#f59e0b'};">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
            <div>
              <span class="section-tag" style="font-size:0.75rem; padding:4px 10px; margin-bottom:6px;">
                <i class="fas fa-microchip"></i> Capstone Submission #${studentCapstone.id}
              </span>
              <h3 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin-bottom:4px;">
                ${studentCapstone.projectTitle}
              </h3>
              <div style="font-size:0.85rem; color:#64748b;">
                Specialization Track: <strong style="color:#0f172a;">${studentCapstone.trackTitle}</strong>
              </div>
            </div>
            
            <div style="text-align:right;">
              <span class="status-badge ${isApproved ? 'status-confirmed' : 'status-pending'}" style="font-size:0.85rem; padding:6px 14px;">
                <i class="fas ${isApproved ? 'fa-check-circle' : 'fa-hourglass-half'}"></i> ${studentCapstone.status}
              </span>
              ${studentCapstone.grade ? `
                <div style="margin-top:6px;">
                  <span class="grade-pill"><i class="fas fa-award" style="color:#fbbc04;"></i> ${studentCapstone.grade}</span>
                </div>
              ` : ''}
            </div>
          </div>

          <p style="font-size:0.9rem; color:#334155; line-height:1.6; margin-bottom:16px;">
            ${studentCapstone.architectureSummary}
          </p>

          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:16px; background:#f8fafc; padding:12px 16px; border-radius:10px; border:1px solid #e2e8f0;">
            <div style="display:flex; align-items:center; gap:12px;">
              <a href="${studentCapstone.repoUrl}" target="_blank" class="capstone-repo-badge">
                <i class="fab fa-github"></i> View GitHub Repository
              </a>
              <span style="font-size:0.8rem; color:#64748b;">Submitted: ${studentCapstone.submittedAt}</span>
            </div>
            ${studentCapstone.reviewedBy ? `
              <div style="font-size:0.8rem; color:#059669; font-weight:700;">
                <i class="fas fa-user-check"></i> Evaluated by: ${studentCapstone.reviewedBy}
              </div>
            ` : ''}
          </div>

          <!-- Faculty Review Feedback -->
          <div style="background:${isApproved ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)'}; border:1px solid ${isApproved ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}; border-radius:12px; padding:16px; margin-bottom:16px;">
            <div style="font-weight:800; font-size:0.85rem; color:${isApproved ? '#059669' : '#d97706'}; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
              <i class="fas fa-comment-alt"></i> Faculty Reviewer Notes:
            </div>
            <div style="font-size:0.875rem; color:#334155; line-height:1.5;">
              "${studentCapstone.facultyNotes}"
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            ${isApproved ? `
              <button class="btn btn-primary" onclick="App.openStudentHubCertificate()">
                <i class="fas fa-award"></i> View Authorized Google AI Certificate
              </button>
            ` : `
              <button class="btn btn-secondary" onclick="App.showToast('Evaluation Pending', 'Dr. Sterling is currently evaluating your test suite and architecture.', 'info')">
                <i class="fas fa-sync fa-spin"></i> Evaluation in Progress
              </button>
            `}
          </div>
        </div>
      `;
    } else {
      // Show Submission Form
      container.innerHTML = `
        <div class="capstone-status-card">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:18px;">
            <div style="width:46px; height:46px; border-radius:12px; background:linear-gradient(135deg, #1a73e8, #7c3aed); color:#fff; font-size:1.3rem; display:flex; align-items:center; justify-content:center;">
              <i class="fas fa-rocket"></i>
            </div>
            <div>
              <h3 style="font-size:1.25rem; font-weight:800; color:#0f172a; margin-bottom:2px;">
                Submit Graduation Capstone Project
              </h3>
              <p style="font-size:0.85rem; color:#64748b;">
                Submit your repository and architecture documentation for faculty review and Google Certificate authorization.
              </p>
            </div>
          </div>

          <form id="studentCapstoneForm" onsubmit="CapstonePortal.handleStudentCapstoneSubmit(event, '${currentStudent.id}')">
            <div class="form-group-custom" style="margin-bottom:14px;">
              <label class="form-label-custom">Capstone Project Title *</label>
              <input type="text" class="input-custom" id="capstoneTitle" placeholder="e.g. Autonomous Multi-Agent Clinical Triage Swarm" required>
            </div>

            <div class="form-group-custom" style="margin-bottom:14px;">
              <label class="form-label-custom">GitHub / GitLab Repository URL *</label>
              <input type="url" class="input-custom" id="capstoneRepoUrl" placeholder="https://github.com/yourname/project-repo" required>
            </div>

            <div class="form-group-custom" style="margin-bottom:18px;">
              <label class="form-label-custom">Architecture & Model Summary *</label>
              <textarea class="textarea-custom" id="capstoneArchitecture" rows="3" placeholder="Describe your neural architecture, vector store, agent framework, evaluation benchmarks, and deployment setup..." required></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="width:100%; justify-content:center; background:linear-gradient(135deg, #1a73e8, #059669);">
              <i class="fas fa-paper-plane"></i> Submit Capstone for Faculty Evaluation
            </button>
          </form>
        </div>
      `;
    }
  },

  handleStudentCapstoneSubmit: function(e, studentId) {
    e.preventDefault();
    const title = document.getElementById('capstoneTitle')?.value.trim();
    const repo = document.getElementById('capstoneRepoUrl')?.value.trim();
    const arch = document.getElementById('capstoneArchitecture')?.value.trim();

    if (!title || !repo || !arch) {
      App.showToast("Missing Fields", "Please complete all capstone submission requirements.", "error");
      return;
    }

    const currentStudent = StorageService.getCurrentStudent() || { id: studentId || "AI-2026-9182", fullName: "Alex Rivera", trackTitle: "Generative AI, LLMs & Agents" };

    const newSub = StorageService.submitCapstone({
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      studentEmail: currentStudent.email || "student@ainexus.edu",
      trackTitle: currentStudent.trackTitle,
      projectTitle: title,
      repoUrl: repo,
      architectureSummary: arch
    });

    App.showToast("Capstone Submitted! 🚀", "Your project has been delivered to Dr. Sarah Sterling and the evaluation board.", "success");
    this.renderStudentCapstoneDesk('studentCapstoneDeskContainer', currentStudent.id);
  },

  // Render Admin Capstone Evaluation Table in admin.html
  renderAdminCapstoneTable: function(containerId) {
    const tbody = document.getElementById(containerId);
    if (!tbody) return;

    const capstones = StorageService.getCapstones();

    tbody.innerHTML = capstones.map(c => {
      const isApproved = c.status === 'Approved';
      return `
        <tr>
          <td><strong style="color:#0284c7; font-family:var(--font-mono); font-size:0.85rem;">${c.id}</strong></td>
          <td>
            <strong style="color:#0f172a;">${c.studentName}</strong>
            <div style="font-size:0.75rem; color:#64748b;">${c.studentId}</div>
          </td>
          <td>
            <div style="font-weight:700; color:#0f172a; font-size:0.875rem;">${c.projectTitle}</div>
            <a href="${c.repoUrl}" target="_blank" style="font-size:0.75rem; color:#1a73e8; display:inline-flex; align-items:center; gap:4px;">
              <i class="fab fa-github"></i> ${c.repoUrl.replace('https://github.com/', '')}
            </a>
          </td>
          <td><span style="font-size:0.8rem; color:#334155; font-weight:600;">${c.trackTitle}</span></td>
          <td>
            <span class="status-badge ${isApproved ? 'status-confirmed' : 'status-pending'}">
              <i class="fas ${isApproved ? 'fa-check-circle' : 'fa-clock'}"></i> ${c.status}
            </span>
          </td>
          <td>
            ${c.grade ? `<span class="grade-pill">${c.grade}</span>` : '<span style="color:#94a3b8; font-size:0.8rem;">Pending</span>'}
          </td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-primary btn-sm" style="padding:4px 8px; font-size:0.75rem; background:linear-gradient(135deg, #1a73e8, #7c3aed);" onclick="CapstonePortal.openGradeModal('${c.id}')">
                <i class="fas fa-clipboard-check"></i> ${isApproved ? 'Re-Grade' : 'Evaluate'}
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  openGradeModal: function(capstoneId) {
    const capstones = StorageService.getCapstones();
    const target = capstones.find(c => c.id === capstoneId);
    if (!target) return;

    const modalStudent = document.getElementById('gradeModalStudent');
    const modalProject = document.getElementById('gradeModalProject');
    const modalRepo = document.getElementById('gradeModalRepo');
    const modalSummary = document.getElementById('gradeModalSummary');
    const gradeSelect = document.getElementById('gradeModalScore');
    const notesInput = document.getElementById('gradeModalNotes');
    const capstoneIdInput = document.getElementById('gradeModalCapstoneId');

    if (modalStudent) modalStudent.textContent = `${target.studentName} (${target.studentId}) - ${target.trackTitle}`;
    if (modalProject) modalProject.textContent = target.projectTitle;
    if (modalRepo) {
      modalRepo.href = target.repoUrl;
      modalRepo.textContent = target.repoUrl;
    }
    if (modalSummary) modalSummary.textContent = target.architectureSummary;
    if (capstoneIdInput) capstoneIdInput.value = target.id;
    if (gradeSelect && target.grade) gradeSelect.value = target.grade;
    if (notesInput && target.facultyNotes) notesInput.value = target.facultyNotes;

    App.openModal('gradeCapstoneModal');
  },

  submitGradeCapstone: function() {
    const capstoneId = document.getElementById('gradeModalCapstoneId')?.value;
    const grade = document.getElementById('gradeModalScore')?.value || "Distinction (98%)";
    const notes = document.getElementById('gradeModalNotes')?.value.trim() || "Verified and approved by Academic Board.";
    const autoAllot = document.getElementById('gradeModalAutoCert')?.checked ?? true;

    if (!capstoneId) return;

    const updated = StorageService.gradeCapstone(capstoneId, grade, notes, autoAllot);
    if (updated) {
      App.closeModal('gradeCapstoneModal');
      App.showToast("Capstone Graded & Approved! 🎓", `${updated.projectTitle} graded ${grade}. Certificate auto-authorized.`, "success");
      this.renderAdminCapstoneTable('adminCapstonesTableBody');
      if (typeof AdminApp !== 'undefined') {
        AdminApp.renderCertificateRegistry();
        AdminApp.updateBadgeCounts();
      }
    }
  }
};
