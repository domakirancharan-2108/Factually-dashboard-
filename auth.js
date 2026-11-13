/**
 * Vaagdevi College of Engineering - CSM Department Dashboard
 * Authentication Service with Registration Approval Enforcement & RBAC
 */

const AUTH_SESSION_KEY = 'vce_csm_auth_session_v5';

class AuthService {
  constructor() {
    this.currentUser = this.loadSession();
    this.otpStore = {};
  }

  loadSession() {
    try {
      const saved = sessionStorage.getItem(AUTH_SESSION_KEY) || localStorage.getItem(AUTH_SESSION_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Session load error:', e);
    }
    return null;
  }

  saveSession(user, remember = true) {
    this.currentUser = user;
    const json = JSON.stringify(user);
    if (remember) {
      localStorage.setItem(AUTH_SESSION_KEY, json);
    }
    sessionStorage.setItem(AUTH_SESSION_KEY, json);
    window.dispatchEvent(new CustomEvent('vce:auth-changed', { detail: user }));
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    window.dispatchEvent(new CustomEvent('vce:auth-changed', { detail: null }));
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  hasRole(...roles) {
    if (!this.currentUser) return false;
    return roles.includes(this.currentUser.role);
  }

  login(identifier, password, remember = true) {
    const trimmed = identifier ? identifier.trim() : '';
    let user = window.vceDB.getUserByEmail(trimmed);
    if (!user) {
      user = window.vceDB.getUserByUsername(trimmed);
    }

    if (!user) {
      return { 
        success: false, 
        message: 'No registered account found with this Email or Username. Please register first.' 
      };
    }

    if (user.password !== password) {
      return { 
        success: false, 
        message: 'Incorrect password. Please verify credentials or use Forgot Password.' 
      };
    }

    // Check approval status: If pending, block login until Principal / HOD approves
    if (user.status === 'pending') {
      if (user.role === 'hod') {
        return {
          success: false,
          isPending: true,
          message: '⏳ Registration Pending Approval: Your HOD registration has been submitted to the College Principal. You will be able to log in once the Principal approves your account.'
        };
      } else {
        return {
          success: false,
          isPending: true,
          message: '⏳ Registration Pending Approval: Your Faculty registration has been submitted to the HOD & Principal. You will be able to log in once verified and approved.'
        };
      }
    }

    this.saveSession(user, remember);
    window.vceDB.logAction(user.name, `Logged in successfully as ${user.role.toUpperCase()}`);
    return { success: true, user };
  }

  // Master Principal Access with Security Password: KIRANCHARAN123
  enterAsPrincipal(password) {
    const requiredPassword = window.vceDB.getPrincipalPassword();
    
    if (password !== requiredPassword) {
      return {
        success: false,
        message: 'Access Denied: Invalid Master Password for College Principal.'
      };
    }

    const principal = window.vceDB.getUserById('usr_principal_master') || {
      id: 'usr_principal_master',
      name: 'DR. K. PRAKASH',
      email: 'principal@vaagdevi.edu.in',
      username: 'principal2026',
      role: 'principal',
      status: 'approved',
      designation: 'Principal & Professor',
      department: 'College Administration & CSM Oversight',
      employeeId: '100001',
      subject: 'AI & Institutional Governance'
    };

    this.saveSession(principal, true);
    window.vceDB.logAction(principal.name, 'Principal authenticated with master password');
    return { success: true, user: principal, message: 'Welcome, Respected Principal Sir.' };
  }

  // Change Principal Master Password (only available on Principal's page)
  changePrincipalPassword(currentPassword, newPassword, confirmPassword) {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'principal') {
      return { success: false, message: 'Unauthorized: Only the College Principal can update the Master Password.' };
    }

    const currentMasterPassword = window.vceDB.getPrincipalPassword();
    if (currentPassword !== currentMasterPassword) {
      return { success: false, message: 'Incorrect Current Password: The current master password you entered is incorrect.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, message: 'Passwords do not match: New password and confirmation must be identical.' };
    }

    if (newPassword === currentPassword) {
      return { success: false, message: 'New password must be different from the current master password.' };
    }

    const res = window.vceDB.updatePrincipalPassword(newPassword);
    if (res.success) {
      currentUser.password = newPassword;
      this.saveSession(currentUser, true);
    }
    return res;
  }

  // Self-Registration with strict validation & pending approval state
  register(userData, autoApprove = false) {
    let { name, email, username, password, confirmPassword, role, designation, employeeId, subject, phone } = userData;

    // 1. Full Name in CAPITAL LETTERS
    if (!name || !name.trim()) {
      return { success: false, message: 'Full Name is required.' };
    }
    const cleanName = name.trim().toUpperCase();

    // 2. College Email ID ending with @vaagdevi.edu.in
    if (!email || !email.trim()) {
      return { success: false, message: 'College Email ID is required.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@vaagdevi.edu.in') && !cleanEmail.endsWith('@vaagdevi.eddu.in')) {
      return { 
        success: false, 
        message: 'Invalid College Email. Email must be in the format of "@vaagdevi.edu.in" (e.g. name@vaagdevi.edu.in).' 
      };
    }

    if (window.vceDB.getUserByEmail(cleanEmail)) {
      return { success: false, message: 'An account with this College Email ID already exists.' };
    }

    // 3. Username: combination of lowercase letters and numbers without capital letters
    if (!username || !username.trim()) {
      return { success: false, message: 'Username is required.' };
    }
    const cleanUsername = username.trim();
    if (/[A-Z]/.test(cleanUsername)) {
      return { 
        success: false, 
        message: 'Invalid Username: Must NOT contain any capital letters (lowercase only).' 
      };
    }
    const usernameRegex = /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]+$/;
    if (!usernameRegex.test(cleanUsername)) {
      return { 
        success: false, 
        message: 'Invalid Username format: Must be a combination of lowercase letters and numbers (e.g., suresh101, anil2026).' 
      };
    }

    if (window.vceDB.getUserByUsername(cleanUsername)) {
      return { success: false, message: 'This Username is already taken. Please choose another.' };
    }

    // 4. Employee ID: exactly 6 digits & Unique
    if (!employeeId || !employeeId.toString().trim()) {
      return { success: false, message: 'Employee ID is required.' };
    }
    const cleanEmpId = employeeId.toString().trim();
    if (!/^\d{6}$/.test(cleanEmpId)) {
      return { 
        success: false, 
        message: 'Invalid Employee ID: Must be exactly 6 digit numbers only (e.g., 108234).' 
      };
    }

    const allUsers = window.vceDB.getAllUsersRaw();
    const isEmpIdTaken = allUsers.some(u => u.employeeId === cleanEmpId);
    if (isEmpIdTaken) {
      return { 
        success: false, 
        message: `Employee ID "${cleanEmpId}" is already assigned to another staff member. Employee ID must be unique for everyone.` 
      };
    }

    // 5. Subject selection
    if (!subject || !subject.trim()) {
      return { success: false, message: 'Please select the CSM Department Subject handled.' };
    }

    // 6. Password check
    if (!password || password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match. Please re-enter the same password.' };
    }

    const assignedRole = role === 'hod' ? 'hod' : 'faculty';
    const status = autoApprove ? 'approved' : 'pending';

    const newUser = window.vceDB.addUser({
      name: cleanName,
      email: cleanEmail,
      username: cleanUsername,
      password: password,
      role: assignedRole,
      status: status,
      designation: designation || (assignedRole === 'hod' ? 'Professor & HOD' : 'Assistant Professor'),
      department: 'CSE (AI & ML) - CSM',
      employeeId: cleanEmpId,
      subject: subject.trim(),
      phone: phone || '+91 98480 00000',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`
    });

    let returnMsg = '';
    if (autoApprove) {
      returnMsg = `Account created and activated for ${cleanName} (${assignedRole.toUpperCase()})!`;
    } else if (assignedRole === 'hod') {
      returnMsg = `Registration submitted! Notification sent to the College Principal for approval. You can log in once the Principal approves.`;
    } else {
      returnMsg = `Registration submitted! Notification sent to HOD & Principal for approval. You can log in once verified and approved.`;
    }

    return { 
      success: true, 
      user: newUser, 
      isPending: !autoApprove,
      message: returnMsg
    };
  }

  // Forgot password OTP flow
  requestPasswordResetOtp(email) {
    const trimmed = email ? email.trim().toLowerCase() : '';
    const user = window.vceDB.getUserByEmail(trimmed);
    if (!user) {
      return { success: false, message: 'No registered account found with this college email address.' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpStore[trimmed] = {
      otp: otp,
      expires: Date.now() + 10 * 60 * 1000
    };

    return {
      success: true,
      otp: otp,
      userName: user.name,
      message: `Verification code generated for ${user.name}. (Simulated email sent to ${trimmed})`
    };
  }

  verifyOtpAndResetPassword(email, otp, newPassword) {
    const trimmed = email ? email.trim().toLowerCase() : '';
    const record = this.otpStore[trimmed];

    if (!record) {
      return { success: false, message: 'Please request a verification code first.' };
    }

    if (Date.now() > record.expires) {
      delete this.otpStore[trimmed];
      return { success: false, message: 'Verification code has expired. Please request a new one.' };
    }

    if (record.otp !== otp.trim()) {
      return { success: false, message: 'Invalid verification code. Please re-enter.' };
    }

    const updated = window.vceDB.updateUserPassword(trimmed, newPassword);
    if (updated) {
      delete this.otpStore[trimmed];
      return { success: true, message: 'Password reset successful! You can now log in.' };
    }

    return { success: false, message: 'Failed to update password.' };
  }
}

window.vceAuth = new AuthService();
