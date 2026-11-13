/**
 * Vaagdevi College of Engineering - CSM Department Dashboard
 * MongoDB Atlas Cloud-Connected Database Engine with Real-Time REST Sync
 * Cluster: department--dashboard.eibmzx4.mongodb.net
 * Database: vaagdevi_csm_db
 */

const DB_KEY = 'vce_csm_permanent_db_v6';
const PRINCIPAL_MASTER_PASSWORD = 'KIRANCHARAN123';

const CLEAN_INITIAL_DATA = {
  users: [
    {
      id: 'usr_principal_master',
      name: 'DR. K. PRAKASH',
      email: 'principal@vaagdevi.edu.in',
      username: 'principal2026',
      password: PRINCIPAL_MASTER_PASSWORD,
      role: 'principal',
      status: 'approved',
      
      designation: 'Principal & Professor',
      department: 'College Administration & CSM Oversight',
      employeeId: '100001',
      subject: 'AI & Institutional Governance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+91 94401 23456',
      joiningYear: 2012,
      qualification: 'Ph.D in Computer Science & Engineering'
    }
  ],

  facultyProfiles: [],
  facultyActivities: [],
  studentAchievements: [],
  publications: [],
  researchGrants: [],
  events: [],
  placedOffers: [],

  laboratories: [
    {
      id: 'lab_01',
      name: 'NVIDIA AI & GPU Supercomputing Center',
      code: 'CSM-LAB-101',
      location: 'Block-B, 3rd Floor (Room 302)',
      systemsCount: 40,
      hardwareSpecs: 'NVIDIA RTX 4090 24GB GPUs, Intel Core i9 14th Gen, 64GB DDR5 RAM, 2TB NVMe',
      softwareInstalled: 'CUDA 12.4, PyTorch, TensorFlow, TensorRT, Triton Server, JupyterHub',
      facultyInCharge: 'Unassigned',
      labTechnician: 'Mr. P. Srinivas (Sr. Tech)',
      utilizationRate: 0,
      currentStatus: 'Available for Sessions & Research',
      weeklyHoursUsed: 0,
      capacity: 40
    },
    {
      id: 'lab_02',
      name: 'Machine Learning & Predictive Analytics Lab',
      code: 'CSM-LAB-102',
      location: 'Block-B, 3rd Floor (Room 304)',
      systemsCount: 65,
      hardwareSpecs: 'Intel Core i7 13th Gen, 32GB RAM, NVIDIA RTX 3060 12GB, 1TB SSD',
      softwareInstalled: 'Scikit-Learn, Spark MLlib, Tableau, Anaconda Enterprise, RStudio',
      facultyInCharge: 'Unassigned',
      labTechnician: 'Mrs. K. Lavanya',
      utilizationRate: 0,
      currentStatus: 'Available for Sessions & Research',
      weeklyHoursUsed: 0,
      capacity: 65
    },
    {
      id: 'lab_03',
      name: 'Computer Vision & Robotics AI Innovation Lab',
      code: 'CSM-LAB-103',
      location: 'Block-B, 2nd Floor (Room 208 - AICTE IDEA Lab)',
      systemsCount: 35,
      hardwareSpecs: 'NVIDIA Jetson AGX Orin 64GB Dev Kits, Intel RealSense D435i, TurtleBot4, RTX 4080 rigs',
      softwareInstalled: 'ROS 2 Humble, OpenCV 4.9, YOLOv10, Open3D, Gazebo Sim',
      facultyInCharge: 'Unassigned',
      labTechnician: 'Mr. B. Ravinder',
      utilizationRate: 0,
      currentStatus: 'Available for Sessions & Research',
      weeklyHoursUsed: 0,
      capacity: 35
    },
    {
      id: 'lab_04',
      name: 'Cloud AI & Big Data Analytics Laboratory',
      code: 'CSM-LAB-104',
      location: 'Block-B, 4th Floor (Room 401)',
      systemsCount: 60,
      hardwareSpecs: 'Intel Xeon Workstations, 32GB RAM, AWS Cloud Workspaces & Azure AI Sandbox',
      softwareInstalled: 'AWS SageMaker Studio, Azure ML Studio, Hadoop, Apache Kafka, MongoDB',
      facultyInCharge: 'Unassigned',
      labTechnician: 'Mr. M. Rajesh',
      utilizationRate: 0,
      currentStatus: 'Available for Sessions & Research',
      weeklyHoursUsed: 0,
      capacity: 60
    }
  ],

  accreditation: {
    nbaTier: 'Tier-1 (Autonomous Institution)',
    nbaCycle: 'Cycle-2 Re-accreditation',
    criteria: [
      { id: 1, name: 'Vision, Mission and PEOs', maxMarks: 50, obtainedMarks: 0, status: 'Not Evaluated', lead: 'Department HOD' },
      { id: 2, name: 'Program Curriculum and Teaching-Learning', maxMarks: 100, obtainedMarks: 0, status: 'Not Evaluated', lead: 'Academic Coordinator' },
      { id: 3, name: 'Course Outcomes and Program Outcomes (CO-PO)', maxMarks: 175, obtainedMarks: 0, status: 'Not Evaluated', lead: 'OBE Committee' },
      { id: 4, name: 'Students Performance & Placement', maxMarks: 100, obtainedMarks: 0, status: 'Not Evaluated', lead: 'Placement Officer' },
      { id: 5, name: 'Faculty Information and Contributions', maxMarks: 200, obtainedMarks: 0, status: 'Not Evaluated', lead: 'Faculty Lead' },
      { id: 6, name: 'Facilities and Technical Support (Labs)', maxMarks: 80, obtainedMarks: 0, status: 'Not Evaluated', lead: 'Lab Incharge' },
      { id: 7, name: 'Continuous Improvement (CQI)', maxMarks: 75, obtainedMarks: 0, status: 'Not Evaluated', lead: 'IQAC Lead' },
      { id: 8, name: 'First Year Academics', maxMarks: 50, obtainedMarks: 0, status: 'Not Evaluated', lead: 'First Year Coordinator' },
      { id: 9, name: 'Student Support Systems & Mentorship', maxMarks: 50, obtainedMarks: 0, status: 'Not Evaluated', lead: 'Student Counselor' },
      { id: 10, name: 'Governance, Institutional Support & Financials', maxMarks: 120, obtainedMarks: 0, status: 'Not Evaluated', lead: 'Principal Office' }
    ],
    coPoAttainment: {
      po1_engineering_knowledge: 0, po2_problem_analysis: 0, po3_design_development: 0,
      po4_complex_investigations: 0, po5_modern_tool_usage: 0, po6_engineer_and_society: 0,
      po7_environment_sustainability: 0, po8_ethics: 0, po9_individual_teamwork: 0,
      po10_communication: 0, po11_project_mgmt_finance: 0, po12_life_long_learning: 0,
      pso1_ai_systems_design: 0, pso2_cloud_edge_deployment: 0
    }
  },

  auditLogs: []
};

class MemoryDatabaseService {
  constructor() {
    this.data = this.loadFromStorage();
    this.isMongoConnected = false;
    this.mongoCluster = 'department--dashboard.eibmzx4.mongodb.net';
    this.initMongoDB();
  }

  async initMongoDB() {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const health = await res.json();
        if (health.status === 'connected') {
          this.isMongoConnected = true;
          this.mongoCluster = health.cluster || this.mongoCluster;
          this.updateMongoStatusUI('connected');
          await this.syncFromMongoDB();
        } else {
          this.updateMongoStatusUI('fallback');
        }
      }
    } catch (e) {
      console.warn('MongoDB API server not responding, using localStorage cache:', e);
      this.updateMongoStatusUI('fallback');
    }
  }

  async syncFromMongoDB() {
    try {
      const res = await fetch('/api/db/sync');
      if (res.ok) {
        const payload = await res.json();
        if (payload.success && payload.data) {
          const cloudData = payload.data;
          // Merge users
          if (cloudData.users && cloudData.users.length > 0) {
            this.data.users = cloudData.users;
          }
          if (cloudData.facultyProfiles) this.data.facultyProfiles = cloudData.facultyProfiles;
          if (cloudData.facultyActivities) this.data.facultyActivities = cloudData.facultyActivities;
          if (cloudData.studentAchievements) this.data.studentAchievements = cloudData.studentAchievements;
          if (cloudData.publications) this.data.publications = cloudData.publications;
          if (cloudData.researchGrants) this.data.researchGrants = cloudData.researchGrants;
          if (cloudData.events) this.data.events = cloudData.events;
          if (cloudData.placedOffers) this.data.placedOffers = cloudData.placedOffers;
          if (cloudData.laboratories) this.data.laboratories = cloudData.laboratories;
          if (cloudData.auditLogs) this.data.auditLogs = cloudData.auditLogs;
          if (cloudData.principalMasterPassword) {
            const p = this.data.users.find(u => u.role === 'principal');
            if (p) p.password = cloudData.principalMasterPassword;
          }

          this.saveToStorage();
          window.dispatchEvent(new CustomEvent('vce:mongo-synced', { detail: { count: this.data.users.length } }));
          if (window.Dashboard && window.Dashboard.renderCurrentView) {
            window.Dashboard.renderCurrentView();
          }
        }
      }
    } catch (err) {
      console.warn('Error syncing data from MongoDB Atlas:', err);
    }
  }

  async syncToMongo(endpoint, method, body = null) {
    try {
      const opts = {
        method: method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (body) opts.body = JSON.stringify(body);
      const res = await fetch(endpoint, opts);
      return await res.json();
    } catch (e) {
      console.warn(`Failed async push to ${endpoint}:`, e);
      return { success: false, error: e.message };
    }
  }

  updateMongoStatusUI(status) {
    const badge = document.getElementById('header-mongo-badge');
    if (badge) {
      if (status === 'connected') {
        badge.className = 'mongo-badge mongo-badge-connected';
        badge.innerHTML = `<span class="mongo-dot"></span> <i class="fa-solid fa-database text-green"></i> <span>MongoDB Atlas Live</span>`;
        badge.title = `Connected to MongoDB Atlas: ${this.mongoCluster}`;
      } else {
        badge.className = 'mongo-badge mongo-badge-local';
        badge.innerHTML = `<span class="mongo-dot offline"></span> <i class="fa-solid fa-database"></i> <span>Local DB</span>`;
        badge.title = 'Running in offline / local cache mode';
      }
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(DB_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const p = parsed.users?.find(u => u.role === 'principal');
        if (p) {
          if (!p.password) {
            p.password = PRINCIPAL_MASTER_PASSWORD;
          }
          p.status = 'approved';
        }
        return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage load error, using clean default:', e);
    }
    this.saveToStorage(CLEAN_INITIAL_DATA);
    return JSON.parse(JSON.stringify(CLEAN_INITIAL_DATA));
  }

  saveToStorage(dataToSave) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(dataToSave || this.data));
    } catch (e) {
      console.warn('Failed to persist to localStorage:', e);
    }
  }

  getPrincipalPassword() {
    const p = (this.data.users || []).find(u => u.role === 'principal');
    return (p && p.password) ? p.password : PRINCIPAL_MASTER_PASSWORD;
  }

  updatePrincipalPassword(newPassword) {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }
    const p = (this.data.users || []).find(u => u.role === 'principal');
    if (!p) {
      return { success: false, message: 'Principal account not found.' };
    }
    p.password = newPassword;
    this.logAction('DR. K. PRAKASH', 'Principal Master Password was changed by College Principal');
    this.saveToStorage();
    this.syncToMongo('/api/principal-password', 'PUT', { password: newPassword });
    return { success: true, message: 'Principal Master Password updated successfully! Use your new password for all future logins.' };
  }

  // Getters
  getUsers(includePending = false) {
    const list = this.data.users || [];
    if (includePending) return list;
    return list.filter(u => u.status === 'approved' || !u.status);
  }

  getAllUsersRaw() {
    return this.data.users || [];
  }

  getUserById(id) {
    return (this.data.users || []).find(u => u.id === id);
  }

  getUserByEmail(email) {
    if (!email) return null;
    return (this.data.users || []).find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  getUserByUsername(uname) {
    if (!uname) return null;
    return (this.data.users || []).find(u => u.username.toLowerCase() === uname.trim().toLowerCase());
  }

  // Pending Registrations Workflow
  getPendingRegistrations(forRole = 'principal') {
    const all = this.data.users || [];
    if (forRole === 'principal') {
      return all.filter(u => u.status === 'pending');
    } else if (forRole === 'hod') {
      return all.filter(u => u.status === 'pending' && u.role === 'faculty');
    }
    return [];
  }

  approveRegistration(userId, actingUser) {
    if (!actingUser) return { success: false, message: 'Authentication required.' };
    const user = this.getUserById(userId);
    if (!user) return { success: false, message: 'Registration record not found.' };

    if (user.role === 'hod' && actingUser.role !== 'principal') {
      return { success: false, message: 'Permission Denied: Only the Principal can approve HOD registrations.' };
    }
    if (user.role === 'faculty' && actingUser.role !== 'principal' && actingUser.role !== 'hod') {
      return { success: false, message: 'Permission Denied: Only HOD or Principal can approve Faculty registrations.' };
    }

    user.status = 'approved';
    this.logAction(actingUser.name, `Approved registration for ${user.name} as ${user.role.toUpperCase()}`);
    this.saveToStorage();
    this.syncToMongo(`/api/users/${userId}`, 'PUT', { status: 'approved' });
    return { success: true, message: `Approved and activated account for ${user.name} (${user.role.toUpperCase()})!` };
  }

  rejectRegistration(userId, actingUser, reason = 'Application not approved') {
    if (!actingUser) return { success: false, message: 'Authentication required.' };
    const user = this.getUserById(userId);
    if (!user) return { success: false, message: 'Registration record not found.' };

    if (user.role === 'hod' && actingUser.role !== 'principal') {
      return { success: false, message: 'Permission Denied: Only the Principal can reject HOD registrations.' };
    }
    if (user.role === 'faculty' && actingUser.role !== 'principal' && actingUser.role !== 'hod') {
      return { success: false, message: 'Permission Denied: Only HOD or Principal can reject Faculty registrations.' };
    }

    const userName = user.name;
    const userRole = user.role.toUpperCase();

    this.data.users = this.data.users.filter(u => u.id !== userId);
    this.data.facultyProfiles = (this.data.facultyProfiles || []).filter(fp => fp.facultyId !== userId);

    this.logAction(actingUser.name, `Rejected and erased registration for ${userName} (${userRole})`);
    this.saveToStorage();
    this.syncToMongo(`/api/users/${userId}`, 'DELETE');
    return { success: true, message: `Registration for ${userName} was rejected and information was erased permanently.` };
  }

  getFacultyProfiles() { return this.data.facultyProfiles || []; }
  getFacultyProfileById(facultyId) {
    return (this.data.facultyProfiles || []).find(fp => fp.facultyId === facultyId);
  }

  getFacultyActivities(facultyId = null) {
    const list = this.data.facultyActivities || [];
    if (facultyId) {
      return list.filter(a => a.facultyId === facultyId);
    }
    return list;
  }

  getStudentAchievements() { return this.data.studentAchievements || []; }
  
  getPublications(facultyId = null) {
    const list = this.data.publications || [];
    if (facultyId) {
      return list.filter(p => p.facultyId === facultyId);
    }
    return list;
  }

  getResearchGrants() { return this.data.researchGrants || []; }
  getLaboratories() { return this.data.laboratories || []; }
  getEvents() { return this.data.events || []; }
  getAccreditation() { return this.data.accreditation || CLEAN_INITIAL_DATA.accreditation; }
  getAuditLogs() { return this.data.auditLogs || []; }
  
  getPlacements() {
    const offers = this.data.placedOffers || [];
    return {
      batchYear: '2025 - 2026 Batch',
      totalStudents: 180,
      eligibleStudents: Math.max(offers.length, 120),
      placedStudents: offers.length,
      placementPercentage: offers.length > 0 ? ((offers.length / Math.max(offers.length, 120)) * 100).toFixed(1) : '0.0',
      topOffers: offers
    };
  }

  getDynamicKpis() {
    const users = this.getUsers().filter(u => u.role === 'faculty' || u.role === 'hod');
    const pubs = this.getPublications();
    const grants = this.getResearchGrants();
    const totalGrantsAmount = grants.reduce((sum, g) => {
      const num = parseInt((g.sanctionAmount || '0').replace(/[^0-9]/g, '')) || 0;
      return sum + num;
    }, 0);

    const totalCitations = pubs.reduce((sum, p) => sum + (parseInt(p.citations) || 0), 0);
    const facultiesCount = users.length;
    const phdCount = users.filter(u => (u.qualification || '').toLowerCase().includes('ph.d') || (u.designation || '').toLowerCase().includes('professor')).length;
    const phdRatio = facultiesCount > 0 ? `${Math.round((phdCount / facultiesCount) * 100)}% (${phdCount}/${facultiesCount})` : '0%';

    return {
      registeredFaculties: facultiesCount,
      totalPublications: pubs.length,
      totalCitations: totalCitations,
      totalGrantsAmount: totalGrantsAmount > 0 ? `₹${(totalGrantsAmount / 100000).toFixed(2)} Lakhs` : '₹0',
      phdRatio: phdRatio,
      departmentHealthScore: facultiesCount > 0 ? Math.min(100, 60 + facultiesCount * 5 + pubs.length * 2) : 0
    };
  }

  // Delete User
  deleteUser(userId, actingUser) {
    if (!actingUser) return { success: false, message: 'Authentication required.' };

    const targetUser = this.getUserById(userId);
    if (!targetUser) return { success: false, message: 'Target user not found.' };

    if (targetUser.role === 'principal') {
      return { success: false, message: 'Cannot delete the College Principal master account.' };
    }

    if (targetUser.role === 'hod') {
      if (actingUser.role !== 'principal') {
        return { success: false, message: 'Permission Denied: Only the Principal can erase HOD accounts.' };
      }
    } else if (targetUser.role === 'faculty') {
      if (actingUser.role !== 'principal' && actingUser.role !== 'hod') {
        return { success: false, message: 'Permission Denied: Only HOD or Principal can erase Faculty accounts.' };
      }
    }

    this.data.users = this.data.users.filter(u => u.id !== userId);
    this.data.facultyProfiles = (this.data.facultyProfiles || []).filter(fp => fp.facultyId !== userId);

    this.logAction(actingUser.name, `Permanently erased user account for ${targetUser.name} (${targetUser.role.toUpperCase()})`);
    this.saveToStorage();
    this.syncToMongo(`/api/users/${userId}`, 'DELETE');
    return { success: true, message: `Account for "${targetUser.name}" (${targetUser.role.toUpperCase()}) was permanently erased.` };
  }

  // Add User
  addUser(userData) {
    const newUser = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
      ...userData
    };

    if (!this.data.users) this.data.users = [];
    this.data.users.push(newUser);

    if (newUser.role === 'faculty') {
      if (!this.data.facultyProfiles) this.data.facultyProfiles = [];
      this.data.facultyProfiles.push({
        facultyId: newUser.id,
        name: newUser.name,
        designation: newUser.designation,
        subject: newUser.subject,
        classesHandled: [newUser.subject],
        teachingWorkload: '16 hrs/week',
        qualification: userData.qualification || 'M.Tech (CSE)',
        apiScore: 50,
        appraisalScore: 80.0,
        mentorBatch: 'CSM 2026 Batch',
        kpiSummary: { publications: 0, fdpCompleted: 0, patents: 0, studentMentored: 20, avgFeedback: 4.5 }
      });
    }

    this.logAction(userData.name, `New ${userData.role.toUpperCase()} registered: ${userData.name} (Status: ${userData.status.toUpperCase()})`);
    this.saveToStorage();
    this.syncToMongo('/api/users', 'POST', newUser);
    return newUser;
  }

  // Update User
  updateUser(userId, updatedFields, actingUser = null) {
    const user = this.getUserById(userId);
    if (!user) return { success: false, message: 'User not found' };

    if (updatedFields.employeeId && updatedFields.employeeId !== user.employeeId) {
      const cleanEmpId = updatedFields.employeeId.toString().trim();
      if (!/^\d{6}$/.test(cleanEmpId)) {
        return { success: false, message: 'Employee ID must be exactly 6 digit numbers only.' };
      }
      const isTaken = (this.data.users || []).some(u => u.id !== userId && u.employeeId === cleanEmpId);
      if (isTaken) {
        return { success: false, message: `Employee ID "${cleanEmpId}" is already assigned to another staff member.` };
      }
      user.employeeId = cleanEmpId;
    }

    if (updatedFields.name) user.name = updatedFields.name.trim().toUpperCase();
    if (updatedFields.email) user.email = updatedFields.email.trim().toLowerCase();
    if (updatedFields.username) user.username = updatedFields.username.trim().toLowerCase();
    if (updatedFields.designation) user.designation = updatedFields.designation;
    if (updatedFields.subject) user.subject = updatedFields.subject;
    if (updatedFields.phone) user.phone = updatedFields.phone;
    if (updatedFields.role) user.role = updatedFields.role;
    if (updatedFields.password) user.password = updatedFields.password;
    if (updatedFields.status) user.status = updatedFields.status;
    if (updatedFields.qualification) user.qualification = updatedFields.qualification;
    if (updatedFields.teachingWorkload) user.teachingWorkload = updatedFields.teachingWorkload;
    if (updatedFields.avatar) user.avatar = updatedFields.avatar;

    const profile = this.getFacultyProfileById(userId);
    if (profile) {
      if (updatedFields.name) profile.name = user.name;
      if (updatedFields.designation) profile.designation = user.designation;
      if (updatedFields.subject) {
        profile.subject = updatedFields.subject;
        profile.classesHandled = [updatedFields.subject];
      }
      if (updatedFields.teachingWorkload) profile.teachingWorkload = updatedFields.teachingWorkload;
      if (updatedFields.qualification) profile.qualification = updatedFields.qualification;
    }

    const actor = actingUser ? actingUser.name : 'Administrator';
    this.logAction(actor, `Updated faculty information for ${user.name} (${user.role.toUpperCase()})`);
    this.saveToStorage();
    this.syncToMongo(`/api/users/${userId}`, 'PUT', updatedFields);
    return { success: true, user };
  }

  updateUserPassword(email, newPassword) {
    const user = this.getUserByEmail(email);
    if (!user) return false;
    user.password = newPassword;
    this.logAction(user.name, 'Password was reset via Email OTP verification');
    this.saveToStorage();
    this.syncToMongo(`/api/users/${user.id}`, 'PUT', { password: newPassword });
    return true;
  }

  addPublication(pub) {
    const newPub = {
      id: 'pub_' + Date.now().toString(36),
      year: parseInt(pub.year) || new Date().getFullYear(),
      citations: parseInt(pub.citations) || 0,
      status: pub.status || 'Published',
      ...pub
    };
    if (!this.data.publications) this.data.publications = [];
    this.data.publications.unshift(newPub);

    const facProfile = this.getFacultyProfileById(newPub.facultyId);
    if (facProfile && facProfile.kpiSummary) {
      facProfile.kpiSummary.publications += 1;
      facProfile.apiScore += 10;
      facProfile.appraisalScore = Math.min(100, facProfile.appraisalScore + 2);
    }

    this.logAction(newPub.authors || 'Faculty', `Added Publication: "${newPub.title.substring(0, 30)}..."`);
    this.saveToStorage();
    this.syncToMongo('/api/publications', 'POST', newPub);
    return newPub;
  }

  addFacultyActivity(act) {
    const newAct = {
      id: 'act_' + Date.now().toString(36),
      status: act.status || 'Pending HOD Approval',
      academicYear: '2025-26',
      credits: parseInt(act.credits) || 2,
      ...act
    };
    if (!this.data.facultyActivities) this.data.facultyActivities = [];
    this.data.facultyActivities.unshift(newAct);

    const facProfile = this.getFacultyProfileById(newAct.facultyId);
    if (facProfile && facProfile.kpiSummary) {
      if (newAct.category === 'FDP') facProfile.kpiSummary.fdpCompleted += 1;
      if (newAct.category === 'Patent') facProfile.kpiSummary.patents += 1;
      facProfile.apiScore += parseInt(newAct.credits) || 5;
    }

    this.logAction(newAct.facultyName, `Logged Activity: ${newAct.category} - ${newAct.title.substring(0, 25)}...`);
    this.saveToStorage();
    this.syncToMongo('/api/activities', 'POST', newAct);
    return newAct;
  }

  updateActivityStatus(actId, newStatus, approvedByName) {
    const act = (this.data.facultyActivities || []).find(a => a.id === actId);
    if (act) {
      act.status = newStatus;
      this.logAction(approvedByName, `Updated activity "${act.title.substring(0, 25)}..." to ${newStatus}`);
      this.saveToStorage();
      this.syncToMongo(`/api/activities/${actId}`, 'PUT', { status: newStatus });
      return true;
    }
    return false;
  }

  addStudentAchievement(ach) {
    const newAch = {
      id: 'ach_' + Date.now().toString(36),
      date: ach.date || new Date().toISOString().split('T')[0],
      ...ach
    };
    if (!this.data.studentAchievements) this.data.studentAchievements = [];
    this.data.studentAchievements.unshift(newAch);
    this.logAction('CSM Staff', `Recorded Achievement for ${newAch.studentName}: ${newAch.achievement}`);
    this.saveToStorage();
    this.syncToMongo('/api/achievements', 'POST', newAch);
    return newAch;
  }

  addEvent(evt) {
    const newEvt = {
      id: 'evt_' + Date.now().toString(36),
      status: evt.status || 'Scheduled',
      participantsCount: parseInt(evt.participantsCount) || 50,
      ...evt
    };
    if (!this.data.events) this.data.events = [];
    this.data.events.push(newEvt);
    this.logAction('Event Coordinator', `Created Department Event: ${newEvt.title}`);
    this.saveToStorage();
    this.syncToMongo('/api/events', 'POST', newEvt);
    return newEvt;
  }

  addResearchGrant(grt) {
    const newGrt = {
      id: 'grt_' + Date.now().toString(36),
      status: 'Active / Ongoing',
      utilizationPercentage: parseInt(grt.utilizationPercentage) || 0,
      ...grt
    };
    if (!this.data.researchGrants) this.data.researchGrants = [];
    this.data.researchGrants.unshift(newGrt);
    this.logAction(newGrt.principalInvestigator || 'Faculty', `Added Research Grant: ${newGrt.title}`);
    this.saveToStorage();
    this.syncToMongo('/api/grants', 'POST', newGrt);
    return newGrt;
  }

  addPlacementOffer(offer) {
    const newOffer = {
      id: 'plc_' + Date.now().toString(36),
      student: offer.student,
      company: offer.company,
      role: offer.role || 'Software Engineer / AI',
      ctc: offer.ctc || '6.5 LPA'
    };
    if (!this.data.placedOffers) this.data.placedOffers = [];
    this.data.placedOffers.unshift(newOffer);
    this.logAction('Placement Cell', `Recorded Placement: ${newOffer.student} placed at ${newOffer.company} (${newOffer.ctc})`);
    this.saveToStorage();
    this.syncToMongo('/api/placements', 'POST', newOffer);
    return newOffer;
  }

  updateLabUtilization(labId, newRate, currentStatus, instructorName) {
    const lab = (this.data.laboratories || []).find(l => l.id === labId);
    if (lab) {
      lab.utilizationRate = parseInt(newRate);
      if (currentStatus) lab.currentStatus = currentStatus;
      if (instructorName) lab.facultyInCharge = instructorName;
      lab.weeklyHoursUsed = Math.min(40, (lab.weeklyHoursUsed || 0) + 4);
      this.logAction(instructorName || 'Lab Staff', `Booked slot in ${lab.name}`);
      this.saveToStorage();
      this.syncToMongo(`/api/labs/${labId}`, 'PUT', {
        utilizationRate: parseInt(newRate),
        currentStatus: currentStatus,
        facultyInCharge: instructorName
      });
      return true;
    }
    return false;
  }

  updateNbaCriterion(critId, obtainedMarks, status) {
    const crit = (this.data.accreditation?.criteria || []).find(c => c.id === parseInt(critId));
    if (crit) {
      crit.obtainedMarks = parseInt(obtainedMarks);
      if (status) crit.status = status;
      this.logAction('HOD / Principal', `Updated NBA Criterion ${crit.id} marks to ${crit.obtainedMarks}/${crit.maxMarks}`);
      this.saveToStorage();
      this.syncToMongo(`/api/nba/${critId}`, 'PUT', { marksObtained: parseInt(obtainedMarks), status: status });
      return true;
    }
    return false;
  }

  logAction(userName, actionText) {
    const now = new Date();
    const timeStr = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0');

    const logEntry = {
      id: 'log_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 4),
      timestamp: timeStr,
      user: userName,
      action: actionText
    };

    if (!this.data.auditLogs) this.data.auditLogs = [];
    this.data.auditLogs.unshift(logEntry);

    if (this.data.auditLogs.length > 50) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 50);
    }
    this.syncToMongo('/api/audit-logs', 'POST', logEntry);
  }
}

window.vceDB = new MemoryDatabaseService();
