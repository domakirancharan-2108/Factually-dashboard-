/**
 * Vaagdevi College of Engineering - CSM Department Dashboard
 * Main Application Orchestrator, Registration Approval & Erase Handlers
 */

const App = {
  init() {
    this.bindEvents();
    this.setupTheme();
    window.Dashboard.init();
  },

  bindEvents() {
    // Auth changed event
    window.addEventListener('vce:auth-changed', () => {
      window.Dashboard.renderCurrentView();
    });

    // Login Form Submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const ident = document.getElementById('login-identifier').value;
        const pass = document.getElementById('login-password').value;
        const remember = document.getElementById('login-remember')?.checked;

        const res = window.vceAuth.login(ident, pass, remember);
        if (res.success) {
          App.showToast(`Welcome, ${res.user.name}!`, 'success');
          if (window.confetti) confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } else {
          App.showToast(res.message, res.isPending ? 'warning' : 'danger');
        }
      });
    }

    // Principal Password Auth Form
    const formPrincipalAuth = document.getElementById('formPrincipalAuth');
    if (formPrincipalAuth) {
      formPrincipalAuth.addEventListener('submit', (e) => {
        e.preventDefault();
        const pass = document.getElementById('principal-master-password').value;
        const res = window.vceAuth.enterAsPrincipal(pass);
        if (res.success) {
          App.closeModal('modalPrincipalAuth');
          App.showToast(res.message, 'success');
          document.getElementById('principal-master-password').value = '';
          if (window.confetti) confetti({ particleCount: 80, spread: 60 });
        } else {
          App.showToast(res.message, 'danger');
        }
      });
    }

    // Self-Registration Form Submit (Strict Formats & Approval Notification)
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pass = document.getElementById('reg-password').value;
        const confirmPass = document.getElementById('reg-confirm-password').value;

        if (pass !== confirmPass) {
          App.showToast('Passwords do not match. Please re-enter your password correctly.', 'warning');
          return;
        }

        const userData = {
          name: document.getElementById('reg-name').value,
          email: document.getElementById('reg-email').value,
          username: document.getElementById('reg-username').value,
          password: pass,
          confirmPassword: confirmPass,
          role: document.getElementById('reg-role').value,
          designation: document.getElementById('reg-designation').value,
          employeeId: document.getElementById('reg-empid').value,
          subject: document.getElementById('reg-subject').value,
          phone: document.getElementById('reg-phone').value
        };

        const res = window.vceAuth.register(userData, false);
        if (res.success) {
          App.showToast(res.message, 'info');
          App.switchAuthTab('login');
          document.getElementById('login-identifier').value = userData.email;
          registerForm.reset();
        } else {
          App.showToast(res.message, 'danger');
        }
      });
    }

    // Add Staff Modal Form (Direct addition by Principal/HOD auto-approved)
    const formAddStaff = document.getElementById('formAddStaff');
    if (formAddStaff) {
      formAddStaff.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = window.vceAuth.getCurrentUser();
        const roleVal = document.getElementById('staff-add-role').value;
        
        if (user.role === 'hod' && roleVal !== 'faculty') {
          App.showToast('HOD can only add Faculty members.', 'danger');
          return;
        }

        const staffData = {
          name: document.getElementById('staff-add-name').value,
          email: document.getElementById('staff-add-email').value,
          username: document.getElementById('staff-add-username').value,
          password: document.getElementById('staff-add-password').value || 'password123',
          confirmPassword: document.getElementById('staff-add-password').value || 'password123',
          role: roleVal,
          designation: document.getElementById('staff-add-designation').value,
          employeeId: document.getElementById('staff-add-empid').value,
          subject: document.getElementById('staff-add-subject').value,
          phone: document.getElementById('staff-add-phone').value
        };

        const res = window.vceAuth.register(staffData, true);
        if (res.success) {
          App.showToast(`${staffData.name} added and activated as ${staffData.role.toUpperCase()}`, 'success');
          App.closeModal('modalAddStaff');
          formAddStaff.reset();
          window.Dashboard.renderCurrentView();
        } else {
          App.showToast(res.message, 'danger');
        }
      });
    }

    // Change Principal Master Password Form Submit (Principal Page Only)
    const formChangePrincipalPassword = document.getElementById('formChangePrincipalPassword');
    if (formChangePrincipalPassword) {
      formChangePrincipalPassword.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentPass = document.getElementById('principal-current-password').value;
        const newPass = document.getElementById('principal-new-password').value;
        const confirmPass = document.getElementById('principal-confirm-new-password').value;

        const res = window.vceAuth.changePrincipalPassword(currentPass, newPass, confirmPass);
        if (res.success) {
          App.showToast(res.message, 'success');
          App.closeModal('modalChangePrincipalPassword');
          formChangePrincipalPassword.reset();
          if (window.confetti) confetti({ particleCount: 70, spread: 60 });
        } else {
          App.showToast(res.message, 'danger');
        }
      });
    }

    // Edit Own Profile Form Submit (Available for all users: Faculty, HOD, Principal)
    const formEditOwnProfile = document.getElementById('formEditOwnProfile');
    if (formEditOwnProfile) {
      formEditOwnProfile.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentUser = window.vceAuth.getCurrentUser();
        if (!currentUser) {
          App.showToast('Please sign in to update your profile.', 'danger');
          return;
        }

        const name = document.getElementById('myprofile-name').value;
        const email = document.getElementById('myprofile-email').value;
        const username = document.getElementById('myprofile-username').value;
        const designation = document.getElementById('myprofile-designation').value;
        const employeeId = document.getElementById('myprofile-empid').value;
        const qualification = document.getElementById('myprofile-qualification')?.value || '';
        const subject = document.getElementById('myprofile-subject').value;
        const phone = document.getElementById('myprofile-phone').value;
        const teachingWorkload = document.getElementById('myprofile-workload').value;
        const avatar = document.getElementById('myprofile-avatar').value;

        // 1. Validate Full Name
        if (!name || !name.trim()) {
          App.showToast('Full Name is required.', 'warning');
          return;
        }
        const cleanName = name.trim().toUpperCase();

        // 2. Validate Email format & uniqueness
        const cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail.endsWith('@vaagdevi.edu.in') && !cleanEmail.endsWith('@vaagdevi.eddu.in')) {
          App.showToast('Invalid College Email. Email must end with "@vaagdevi.edu.in".', 'warning');
          return;
        }
        const existingByEmail = window.vceDB.getUserByEmail(cleanEmail);
        if (existingByEmail && existingByEmail.id !== currentUser.id) {
          App.showToast('This College Email ID is already registered to another user.', 'danger');
          return;
        }

        // 3. Validate Username
        const cleanUsername = username.trim();
        if (/[A-Z]/.test(cleanUsername)) {
          App.showToast('Username must NOT contain capital letters (lowercase & numbers only).', 'warning');
          return;
        }
        const usernameRegex = /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]+$/;
        if (!usernameRegex.test(cleanUsername)) {
          App.showToast('Username must combine lowercase letters and numbers (e.g. ramesh106).', 'warning');
          return;
        }
        const existingByUsername = window.vceDB.getUserByUsername(cleanUsername);
        if (existingByUsername && existingByUsername.id !== currentUser.id) {
          App.showToast('This Username is already taken by another account.', 'danger');
          return;
        }

        // 4. Validate Employee ID (6 Digits & Unique)
        const cleanEmpId = employeeId.toString().trim();
        if (!/^\d{6}$/.test(cleanEmpId)) {
          App.showToast('Invalid Employee ID: Must be exactly 6 digit numbers.', 'warning');
          return;
        }
        const allUsers = window.vceDB.getAllUsersRaw();
        const isEmpIdTaken = allUsers.some(u => u.id !== currentUser.id && u.employeeId === cleanEmpId);
        if (isEmpIdTaken) {
          App.showToast(`Employee ID "${cleanEmpId}" is already assigned to another staff member.`, 'danger');
          return;
        }

        const updateData = {
          name: cleanName,
          email: cleanEmail,
          username: cleanUsername,
          designation: designation,
          employeeId: cleanEmpId,
          qualification: qualification,
          subject: subject,
          phone: phone,
          teachingWorkload: teachingWorkload,
          avatar: avatar || currentUser.avatar
        };

        // 5. Optional Password Change verification
        const currentPass = document.getElementById('myprofile-current-pass').value;
        const newPass = document.getElementById('myprofile-new-pass').value;
        const confirmPass = document.getElementById('myprofile-confirm-new-pass').value;

        if (newPass || currentPass || confirmPass) {
          const dbUser = window.vceDB.getUserById(currentUser.id) || currentUser;
          const actualPass = (currentUser.role === 'principal' ? window.vceDB.getPrincipalPassword() : dbUser.password);

          if (!currentPass || currentPass !== actualPass) {
            App.showToast('Incorrect Current Password. Please verify your current password.', 'danger');
            return;
          }
          if (!newPass || newPass.length < 6) {
            App.showToast('New password must be at least 6 characters long.', 'warning');
            return;
          }
          if (newPass !== confirmPass) {
            App.showToast('New password and confirmation do not match.', 'warning');
            return;
          }
          updateData.password = newPass;
          if (currentUser.role === 'principal') {
            window.vceDB.updatePrincipalPassword(newPass);
          }
        }

        const res = window.vceDB.updateUser(currentUser.id, updateData, currentUser);
        if (res.success) {
          const updatedUser = Object.assign({}, currentUser, res.user);
          window.vceAuth.saveSession(updatedUser, true);
          App.showToast(`Profile updated successfully for ${cleanName}!`, 'success');
          App.closeModal('modalEditOwnProfile');
          window.Dashboard.updateUserHeader(updatedUser);
          window.Dashboard.renderCurrentView();
          if (window.confetti) confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } else {
          App.showToast(res.message, 'danger');
        }
      });
    }

    // Edit Staff / Faculty Modal Form (Principal or HOD updating faculty info)
    const formEditStaff = document.getElementById('formEditStaff');
    if (formEditStaff) {
      formEditStaff.addEventListener('submit', (e) => {
        e.preventDefault();
        const actor = window.vceAuth.getCurrentUser();
        const userId = document.getElementById('staff-edit-id').value;
        const targetUser = window.vceDB.getUserById(userId);

        if (!targetUser) {
          App.showToast('User not found.', 'danger');
          return;
        }

        if (actor.role === 'hod' && targetUser.role !== 'faculty') {
          App.showToast('HOD can only edit Faculty accounts.', 'danger');
          return;
        }

        const updateData = {
          name: document.getElementById('staff-edit-name').value,
          email: document.getElementById('staff-edit-email').value,
          username: document.getElementById('staff-edit-username').value,
          designation: document.getElementById('staff-edit-designation').value,
          employeeId: document.getElementById('staff-edit-empid').value,
          qualification: document.getElementById('staff-edit-qualification')?.value || '',
          subject: document.getElementById('staff-edit-subject').value,
          phone: document.getElementById('staff-edit-phone').value,
          teachingWorkload: document.getElementById('staff-edit-workload').value
        };

        if (actor.role === 'principal') {
          updateData.role = document.getElementById('staff-edit-role').value;
        }

        const passInput = document.getElementById('staff-edit-password').value;
        if (passInput && passInput.trim().length > 0) {
          updateData.password = passInput.trim();
        }

        const res = window.vceDB.updateUser(userId, updateData, actor);
        if (res.success) {
          App.showToast(`Updated faculty information for ${res.user.name}`, 'success');
          App.closeModal('modalEditStaff');
          window.Dashboard.renderCurrentView();
        } else {
          App.showToast(res.message, 'danger');
        }
      });
    }

    // Forgot Password Request OTP
    const btnSendOtp = document.getElementById('btn-send-otp');
    if (btnSendOtp) {
      btnSendOtp.addEventListener('click', () => {
        const email = document.getElementById('forgot-email').value;
        if (!email) {
          App.showToast('Please enter your registered college email address.', 'warning');
          return;
        }
        const res = window.vceAuth.requestPasswordResetOtp(email);
        if (res.success) {
          document.getElementById('forgot-step-1').classList.add('hidden');
          document.getElementById('forgot-step-2').classList.remove('hidden');
          document.getElementById('forgot-user-greeting').innerText = `Hello ${res.userName}, enter the 6-digit OTP sent to ${email}`;
          document.getElementById('simulated-otp-display').innerHTML = `
            <div class="otp-simulation-box">
              <i class="fa-solid fa-envelope-open-text text-maroon"></i>
              <div>
                <strong>Simulated College Email Server:</strong><br>
                Your VCE Security OTP is: <span class="otp-code font-mono">${res.otp}</span>
              </div>
            </div>
          `;
          App.showToast(`OTP generated: ${res.otp}`, 'info');
        } else {
          App.showToast(res.message, 'danger');
        }
      });
    }

    // Forgot Password Submit Reset
    const btnResetPass = document.getElementById('btn-reset-password');
    if (btnResetPass) {
      btnResetPass.addEventListener('click', () => {
        const email = document.getElementById('forgot-email').value;
        const otp = document.getElementById('forgot-otp').value;
        const newPass = document.getElementById('forgot-new-pass').value;
        const confirmPass = document.getElementById('forgot-confirm-pass').value;

        if (!otp || !newPass) {
          App.showToast('Please enter the OTP and a new password.', 'warning');
          return;
        }
        if (newPass !== confirmPass) {
          App.showToast('Passwords do not match. Please re-type.', 'warning');
          return;
        }

        const res = window.vceAuth.verifyOtpAndResetPassword(email, otp, newPass);
        if (res.success) {
          App.showToast(res.message, 'success');
          App.closeModal('modalForgotPassword');
          App.switchAuthTab('login');
          if (window.confetti) confetti({ particleCount: 70 });
        } else {
          App.showToast(res.message, 'danger');
        }
      });
    }

    // Modal Add Activity Form
    const formAddActivity = document.getElementById('formAddActivity');
    if (formAddActivity) {
      formAddActivity.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = window.vceAuth.getCurrentUser();
        const actData = {
          facultyId: user.id,
          facultyName: user.name,
          category: document.getElementById('act-category').value,
          title: document.getElementById('act-title').value,
          organizer: document.getElementById('act-organizer').value,
          duration: document.getElementById('act-duration').value,
          startDate: document.getElementById('act-date').value,
          credits: document.getElementById('act-credits').value,
          status: user.role === 'faculty' ? 'Pending HOD Approval' : 'Approved'
        };

        window.vceDB.addFacultyActivity(actData);
        App.showToast('Activity submitted successfully!', 'success');
        App.closeModal('modalAddActivity');
        formAddActivity.reset();
        window.Dashboard.renderTab('faculty-activities');
      });
    }

    // Modal Add Publication Form
    const formAddPublication = document.getElementById('formAddPublication');
    if (formAddPublication) {
      formAddPublication.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = window.vceAuth.getCurrentUser();
        const pubData = {
          facultyId: user.id,
          title: document.getElementById('pub-title').value,
          authors: document.getElementById('pub-authors').value,
          journal: document.getElementById('pub-journal').value,
          indexing: document.getElementById('pub-indexing').value,
          impactFactor: document.getElementById('pub-impact').value,
          citations: document.getElementById('pub-citations').value,
          doi: document.getElementById('pub-doi').value,
          year: document.getElementById('pub-year').value,
          month: document.getElementById('pub-month').value,
          link: document.getElementById('pub-link').value || '#'
        };

        window.vceDB.addPublication(pubData);
        App.showToast('Research Publication added!', 'success');
        App.closeModal('modalAddPublication');
        formAddPublication.reset();
        window.Dashboard.renderTab('publications');
      });
    }

    // Modal Add Achievement Form
    const formAddAchievement = document.getElementById('formAddAchievement');
    if (formAddAchievement) {
      formAddAchievement.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = window.vceAuth.getCurrentUser();
        const achData = {
          studentName: document.getElementById('ach-student').value,
          rollNumber: document.getElementById('ach-roll').value,
          year: document.getElementById('ach-year').value,
          competition: document.getElementById('ach-comp').value,
          achievement: document.getElementById('ach-award').value,
          projectTitle: document.getElementById('ach-title').value,
          mentorFaculty: document.getElementById('ach-mentor').value || user.name,
          category: document.getElementById('ach-category').value
        };

        window.vceDB.addStudentAchievement(achData);
        App.showToast('Student Achievement recorded!', 'success');
        App.closeModal('modalAddAchievement');
        formAddAchievement.reset();
        window.Dashboard.renderTab('student-achievements');
      });
    }

    // Modal Add Event Form
    const formAddEvent = document.getElementById('formAddEvent');
    if (formAddEvent) {
      formAddEvent.addEventListener('submit', (e) => {
        e.preventDefault();
        const evtData = {
          title: document.getElementById('evt-title').value,
          category: document.getElementById('evt-cat').value,
          date: document.getElementById('evt-date').value,
          venue: document.getElementById('evt-venue').value,
          coordinator: document.getElementById('evt-coord').value,
          budget: document.getElementById('evt-budget').value,
          description: document.getElementById('evt-desc').value
        };

        window.vceDB.addEvent(evtData);
        App.showToast('Department Event registered!', 'success');
        App.closeModal('modalAddEvent');
        formAddEvent.reset();
        window.Dashboard.renderTab('events');
      });
    }

    // Modal Add Grant Form
    const formAddGrant = document.getElementById('formAddGrant');
    if (formAddGrant) {
      formAddGrant.addEventListener('submit', (e) => {
        e.preventDefault();
        const grtData = {
          title: document.getElementById('grt-title').value,
          fundingAgency: document.getElementById('grt-agency').value,
          sanctionAmount: document.getElementById('grt-amount').value,
          principalInvestigator: document.getElementById('grt-pi').value,
          duration: document.getElementById('grt-dur').value,
          sanctionOrderNo: document.getElementById('grt-order').value,
          utilizationPercentage: document.getElementById('grt-util').value
        };

        window.vceDB.addResearchGrant(grtData);
        App.showToast('Research Grant logged!', 'success');
        App.closeModal('modalAddGrant');
        formAddGrant.reset();
        window.Dashboard.renderTab('research-grants');
      });
    }

    // Modal Add Placement Form
    const formAddPlacement = document.getElementById('formAddPlacement');
    if (formAddPlacement) {
      formAddPlacement.addEventListener('submit', (e) => {
        e.preventDefault();
        const offerData = {
          student: document.getElementById('plc-student').value,
          company: document.getElementById('plc-company').value,
          role: document.getElementById('plc-role').value,
          ctc: document.getElementById('plc-ctc').value
        };

        window.vceDB.addPlacementOffer(offerData);
        App.showToast('Placement offer recorded!', 'success');
        App.closeModal('modalAddPlacement');
        formAddPlacement.reset();
        window.Dashboard.renderTab('placements');
      });
    }

    // Modal Edit NBA Form
    const formEditNba = document.getElementById('formEditNba');
    if (formEditNba) {
      formEditNba.addEventListener('submit', (e) => {
        e.preventDefault();
        const critId = document.getElementById('editNbaCritId').value;
        const marks = document.getElementById('editNbaObtained').value;
        const status = document.getElementById('editNbaStatus').value;

        window.vceDB.updateNbaCriterion(critId, marks, status);
        App.showToast(`Criterion ${critId} marks updated to ${marks}`, 'success');
        App.closeModal('modalEditNba');
        window.Dashboard.renderTab('accreditation');
      });
    }

    // Modal Book Lab Form
    const formBookLab = document.getElementById('formBookLab');
    if (formBookLab) {
      formBookLab.addEventListener('submit', (e) => {
        e.preventDefault();
        const labId = document.getElementById('book-lab-id').value;
        const faculty = document.getElementById('book-faculty').value;
        const batch = document.getElementById('book-batch').value;
        const time = document.getElementById('book-time').value;

        window.vceDB.updateLabUtilization(labId, 85, `In Session (${batch} - ${time})`, faculty);
        App.showToast(`Lab slot booked by ${faculty}`, 'success');
        App.closeModal('modalBookLab');
        window.Dashboard.renderTab('laboratories');
      });
    }
  },

  // --- Registration Approval Handlers ---
  approveUserRegistration(userId, name, role) {
    const actor = window.vceAuth.getCurrentUser();
    const res = window.vceDB.approveRegistration(userId, actor);
    if (res.success) {
      App.showToast(res.message, 'success');
      if (window.confetti) confetti({ particleCount: 60 });
      window.Dashboard.renderCurrentView();
    } else {
      App.showToast(res.message, 'danger');
    }
  },

  rejectUserRegistration(userId, name, role) {
    const actor = window.vceAuth.getCurrentUser();
    const confirmReject = window.confirm(`Are you sure you want to reject and permanently erase the registration for:\n"${name}" (${role.toUpperCase()})?`);
    if (confirmReject) {
      const res = window.vceDB.rejectRegistration(userId, actor);
      if (res.success) {
        App.showToast(res.message, 'info');
        window.Dashboard.renderCurrentView();
      } else {
        App.showToast(res.message, 'danger');
      }
    }
  },

  // --- Strict Erase Actions with RBAC ---
  erasePublication(pubId) {
    const actor = window.vceAuth.getCurrentUser();
    if (window.confirm('Are you sure you want to permanently erase this research publication?')) {
      const res = window.vceDB.deletePublication(pubId, actor);
      if (res.success) {
        App.showToast(res.message, 'success');
        window.Dashboard.renderTab('publications');
      } else {
        App.showToast(res.message, 'danger');
      }
    }
  },

  eraseFacultyActivity(actId) {
    const actor = window.vceAuth.getCurrentUser();
    if (window.confirm('Are you sure you want to erase this faculty activity?')) {
      const res = window.vceDB.deleteActivity(actId, actor);
      if (res.success) {
        App.showToast(res.message, 'success');
        window.Dashboard.renderTab('faculty-activities');
      } else {
        App.showToast(res.message, 'danger');
      }
    }
  },

  eraseStudentAchievement(achId) {
    const actor = window.vceAuth.getCurrentUser();
    if (window.confirm('Are you sure you want to erase this student achievement?')) {
      const res = window.vceDB.deleteAchievement(achId, actor);
      if (res.success) {
        App.showToast(res.message, 'success');
        window.Dashboard.renderTab('student-achievements');
      } else {
        App.showToast(res.message, 'danger');
      }
    }
  },

  eraseResearchGrant(grtId) {
    const actor = window.vceAuth.getCurrentUser();
    if (window.confirm('Are you sure you want to erase this research grant proposal? (Principal Only)')) {
      const res = window.vceDB.deleteGrant(grtId, actor);
      if (res.success) {
        App.showToast(res.message, 'success');
        window.Dashboard.renderTab('research-grants');
      } else {
        App.showToast(res.message, 'danger');
      }
    }
  },

  erasePlacement(plcId) {
    const actor = window.vceAuth.getCurrentUser();
    if (window.confirm('Are you sure you want to erase this placement offer?')) {
      const res = window.vceDB.deletePlacement(plcId, actor);
      if (res.success) {
        App.showToast(res.message, 'success');
        window.Dashboard.renderTab('placements');
      } else {
        App.showToast(res.message, 'danger');
      }
    }
  },

  eraseEvent(evtId) {
    const actor = window.vceAuth.getCurrentUser();
    if (window.confirm('Are you sure you want to erase this department event?')) {
      const res = window.vceDB.deleteEvent(evtId, actor);
      if (res.success) {
        App.showToast(res.message, 'success');
        window.Dashboard.renderTab('events');
      } else {
        App.showToast(res.message, 'danger');
      }
    }
  },

  // Open Principal Password Modal
  openPrincipalPasswordModal() {
    this.openModal('modalPrincipalAuth');
    const pwdInput = document.getElementById('principal-master-password');
    if (pwdInput) {
      pwdInput.value = '';
      setTimeout(() => pwdInput.focus(), 150);
    }
  },

  openAddStaffModal() {
    const user = window.vceAuth.getCurrentUser();
    this.openModal('modalAddStaff');
    const roleSelect = document.getElementById('staff-add-role');
    const form = document.getElementById('formAddStaff');
    if (form) form.reset();

    if (user && user.role === 'hod') {
      if (roleSelect) roleSelect.innerHTML = `<option value="faculty" selected>Faculty Member</option>`;
    } else {
      if (roleSelect) {
        roleSelect.innerHTML = `
          <option value="faculty" selected>Faculty Member</option>
          <option value="hod">Head of Department (HOD)</option>
        `;
      }
    }
  },

  openEditOwnProfileModal() {
    const user = window.vceAuth.getCurrentUser();
    if (!user) {
      App.showToast('Please sign in to edit your profile.', 'warning');
      return;
    }

    const dbUser = window.vceDB.getUserById(user.id) || user;
    const prof = window.vceDB.getFacultyProfileById(user.id) || {};

    const idInput = document.getElementById('myprofile-id');
    const nameInput = document.getElementById('myprofile-name');
    const emailInput = document.getElementById('myprofile-email');
    const usernameInput = document.getElementById('myprofile-username');
    const empidInput = document.getElementById('myprofile-empid');
    const desigInput = document.getElementById('myprofile-designation');
    const qualInput = document.getElementById('myprofile-qualification');
    const phoneInput = document.getElementById('myprofile-phone');
    const subjInput = document.getElementById('myprofile-subject');
    const workloadInput = document.getElementById('myprofile-workload');

    if (idInput) idInput.value = dbUser.id;
    if (nameInput) nameInput.value = dbUser.name || '';
    if (emailInput) emailInput.value = dbUser.email || '';
    if (usernameInput) usernameInput.value = dbUser.username || '';
    if (empidInput) empidInput.value = dbUser.employeeId || '';
    if (desigInput) desigInput.value = dbUser.designation || 'Assistant Professor';
    if (qualInput) qualInput.value = dbUser.qualification || prof.qualification || 'M.Tech (CSE)';
    if (phoneInput) phoneInput.value = dbUser.phone || '+91 98480 00000';
    if (subjInput) subjInput.value = dbUser.subject || 'Artificial Intelligence & Expert Systems';
    if (workloadInput) workloadInput.value = dbUser.teachingWorkload || prof.teachingWorkload || '16 hrs/week';

    const avatarUrl = dbUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(dbUser.name || 'User')}`;
    const avatarInput = document.getElementById('myprofile-avatar');
    const avatarPreview = document.getElementById('myprofile-avatar-preview');
    const avatarUrlInput = document.getElementById('myprofile-avatar-url');

    if (avatarInput) avatarInput.value = avatarUrl;
    if (avatarPreview) avatarPreview.src = avatarUrl;
    if (avatarUrlInput) {
      avatarUrlInput.value = '';
      avatarUrlInput.classList.add('hidden');
    }

    // Reset password fields
    const curPass = document.getElementById('myprofile-current-pass');
    const newPass = document.getElementById('myprofile-new-pass');
    const confPass = document.getElementById('myprofile-confirm-new-pass');
    const passFields = document.getElementById('myprofile-password-fields');
    const chevron = document.getElementById('myprofile-pass-chevron');

    if (curPass) curPass.value = '';
    if (newPass) newPass.value = '';
    if (confPass) confPass.value = '';
    if (passFields) passFields.classList.add('hidden');
    if (chevron) chevron.className = 'fa-solid fa-chevron-down text-xs text-muted';

    this.openModal('modalEditOwnProfile');
  },

  toggleChangePasswordSection() {
    const fields = document.getElementById('myprofile-password-fields');
    const chevron = document.getElementById('myprofile-pass-chevron');
    if (fields) {
      fields.classList.toggle('hidden');
      if (chevron) {
        if (fields.classList.contains('hidden')) {
          chevron.className = 'fa-solid fa-chevron-down text-xs text-muted';
        } else {
          chevron.className = 'fa-solid fa-chevron-up text-xs text-muted';
        }
      }
    }
  },

  generateNewMyAvatar() {
    const seeds = ['Felix', 'Aneka', 'Mason', 'Jack', 'Avery', 'Kieran', 'Alex', 'Taylor', 'Jordan', 'Morgan', 'Suresh', 'Prakash', 'Ananya', 'Vikram'];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)] + Math.floor(Math.random() * 9999);
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(randomSeed)}`;
    const avatarInput = document.getElementById('myprofile-avatar');
    const avatarPreview = document.getElementById('myprofile-avatar-preview');
    if (avatarInput) avatarInput.value = newAvatar;
    if (avatarPreview) avatarPreview.src = newAvatar;
  },

  toggleAvatarUrlInput() {
    const urlInput = document.getElementById('myprofile-avatar-url');
    if (urlInput) {
      urlInput.classList.toggle('hidden');
      if (!urlInput.classList.contains('hidden')) {
        urlInput.focus();
      }
    }
  },

  previewCustomAvatar(url) {
    if (url && url.trim().length > 5) {
      const trimmed = url.trim();
      const avatarInput = document.getElementById('myprofile-avatar');
      const avatarPreview = document.getElementById('myprofile-avatar-preview');
      if (avatarInput) avatarInput.value = trimmed;
      if (avatarPreview) avatarPreview.src = trimmed;
    }
  },

  openChangePrincipalPasswordModal() {
    const user = window.vceAuth.getCurrentUser();
    if (!user || user.role !== 'principal') {
      App.showToast('Access restricted: Only College Principal can change the master password.', 'warning');
      return;
    }
    const form = document.getElementById('formChangePrincipalPassword');
    if (form) form.reset();
    this.openModal('modalChangePrincipalPassword');
  },

  openEditStaffModal(userId) {
    const actor = window.vceAuth.getCurrentUser();
    if (!actor || (actor.role !== 'principal' && actor.role !== 'hod')) {
      App.showToast('Permission Denied: Only HOD or Principal can edit faculty details.', 'danger');
      return;
    }

    const userToEdit = window.vceDB.getUserById(userId);
    if (!userToEdit) {
      App.showToast('Staff member not found.', 'danger');
      return;
    }

    if (actor.role === 'hod' && userToEdit.role !== 'faculty') {
      App.showToast('HOD can only edit Faculty information.', 'danger');
      return;
    }

    this.openModal('modalEditStaff');
    const prof = window.vceDB.getFacultyProfileById(userId) || {};

    document.getElementById('staff-edit-id').value = userToEdit.id;
    document.getElementById('staff-edit-name').value = userToEdit.name || '';
    document.getElementById('staff-edit-email').value = userToEdit.email || '';
    document.getElementById('staff-edit-username').value = userToEdit.username || '';
    document.getElementById('staff-edit-designation').value = userToEdit.designation || 'Assistant Professor';
    document.getElementById('staff-edit-empid').value = userToEdit.employeeId || '';
    document.getElementById('staff-edit-qualification').value = userToEdit.qualification || prof.qualification || 'M.Tech (CSE)';
    document.getElementById('staff-edit-subject').value = userToEdit.subject || 'Artificial Intelligence & Expert Systems';
    document.getElementById('staff-edit-phone').value = userToEdit.phone || '';
    document.getElementById('staff-edit-workload').value = userToEdit.teachingWorkload || prof.teachingWorkload || '16 hrs/week';
    document.getElementById('staff-edit-password').value = '';

    const roleContainer = document.getElementById('staff-edit-role-container');
    const roleSelect = document.getElementById('staff-edit-role');
    const modalTitle = document.getElementById('modal-edit-staff-title');

    if (modalTitle) {
      modalTitle.innerHTML = `<i class="fa-solid fa-user-pen text-maroon"></i> ${actor.role === 'principal' ? 'Edit Staff / Faculty Information' : 'Edit Faculty Information'}`;
    }

    if (actor.role === 'principal') {
      if (roleContainer) roleContainer.classList.remove('hidden');
      if (roleSelect) roleSelect.value = userToEdit.role;
    } else {
      if (roleContainer) roleContainer.classList.add('hidden');
    }
  },

  // Delete / Erase Staff Member
  deleteStaffMember(userId, name) {
    const actor = window.vceAuth.getCurrentUser();
    const target = window.vceDB.getUserById(userId);
    if (!target) return;

    if (target.role === 'hod' && actor.role !== 'principal') {
      App.showToast('Permission Denied: Only the Principal can erase HOD accounts.', 'danger');
      return;
    }

    if (target.role === 'faculty' && actor.role !== 'principal' && actor.role !== 'hod') {
      App.showToast('Permission Denied: Only HOD or Principal can erase Faculty accounts.', 'danger');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to permanently erase the account for:\n"${name}" (${target.role.toUpperCase()})?\n\nThis data will be erased permanently.`);
    if (confirmDelete) {
      const res = window.vceDB.deleteUser(userId, actor);
      if (res.success) {
        App.showToast(res.message, 'success');
        window.Dashboard.renderCurrentView();
      } else {
        App.showToast(res.message, 'danger');
      }
    }
  },

  logout() {
    window.vceAuth.logout();
    App.showToast('Logged out successfully.', 'info');
  },

  switchAuthTab(tab) {
    if (tab === 'login') {
      document.getElementById('auth-tab-login').classList.remove('hidden');
      document.getElementById('auth-tab-register').classList.add('hidden');
      document.getElementById('tab-btn-login').classList.add('active');
      document.getElementById('tab-btn-register').classList.remove('active');
    } else {
      document.getElementById('auth-tab-login').classList.add('hidden');
      document.getElementById('auth-tab-register').classList.remove('hidden');
      document.getElementById('tab-btn-login').classList.remove('active');
      document.getElementById('tab-btn-register').classList.add('active');
    }
  },

  openForgotPasswordModal() {
    this.openModal('modalForgotPassword');
    document.getElementById('forgot-step-1').classList.remove('hidden');
    document.getElementById('forgot-step-2').classList.add('hidden');
    document.getElementById('forgot-email').value = '';
    document.getElementById('forgot-otp').value = '';
    document.getElementById('forgot-new-pass').value = '';
    document.getElementById('forgot-confirm-pass').value = '';
    document.getElementById('simulated-otp-display').innerHTML = '';
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slide-in`;

    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    else if (type === 'danger') icon = 'fa-triangle-exclamation';
    else if (type === 'warning') icon = 'fa-circle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span class="toast-text">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  },

  setupTheme() {
    const saved = localStorage.getItem('vce_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('vce_theme', next);
    App.showToast(`Switched to ${next.toUpperCase()} theme`, 'info');
  },

  exportTableToCSV(tableId, filename = 'Export') {
    const table = document.getElementById(tableId);
    if (!table) {
      App.showToast('Table not found for export.', 'warning');
      return;
    }

    let csv = [];
    const rows = table.querySelectorAll('tr');
    for (let i = 0; i < rows.length; i++) {
      const row = [];
      const cols = rows[i].querySelectorAll('td, th');
      for (let j = 0; j < cols.length; j++) {
        let text = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, ' ').replace(/"/g, '""');
        row.push('"' + text.trim() + '"');
      }
      csv.push(row.join(','));
    }

    const csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    App.showToast(`Exported "${downloadLink.download}" successfully!`, 'success');
  },

  generateOfficialDossier() {
    window.print();
  },

  toggleSidebarMobile() {
    const sidebar = document.getElementById('sidebar-nav');
    if (sidebar) {
      sidebar.classList.toggle('open');
    }
  }
};

window.App = App;

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
