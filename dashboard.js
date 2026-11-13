/**
 * Vaagdevi College of Engineering - CSM Department Dashboard
 * Dynamic Overview & Registration Approval Notifications
 */

const Dashboard = {
  activeTab: 'overview',

  init() {
    this.renderCurrentView();
  },

  renderCurrentView() {
    const user = window.vceAuth.getCurrentUser();
    if (!user) {
      document.getElementById('auth-section').classList.remove('hidden');
      document.getElementById('app-shell').classList.add('hidden');
      return;
    }

    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');

    this.updateUserHeader(user);
    this.renderTab(this.activeTab);
  },

  updateUserHeader(user) {
    const nameEl = document.getElementById('header-user-name');
    const roleEl = document.getElementById('header-user-role');
    const avatarEl = document.getElementById('header-user-avatar');
    const roleBadgeEl = document.getElementById('header-role-badge');
    const notifBadgeEl = document.getElementById('header-notif-badge');

    if (nameEl) nameEl.innerText = user.name;
    if (roleEl) roleEl.innerText = user.designation || user.role.toUpperCase();
    if (avatarEl) avatarEl.src = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;

    if (roleBadgeEl) {
      roleBadgeEl.className = `role-pill role-pill-${user.role}`;
      let roleLabel = 'Faculty Member';
      if (user.role === 'principal') roleLabel = 'Principal (Master Admin)';
      else if (user.role === 'hod') roleLabel = 'HOD (CSM Dept)';
      roleBadgeEl.innerHTML = `<i class="fa-solid ${user.role === 'principal' ? 'fa-crown' : user.role === 'hod' ? 'fa-user-tie' : 'fa-chalkboard-user'}"></i> ${roleLabel}`;
    }

    // Pending notifications count for Principal & HOD
    if (notifBadgeEl) {
      if (user.role === 'principal' || user.role === 'hod') {
        const pending = window.vceDB.getPendingRegistrations(user.role);
        if (pending.length > 0) {
          notifBadgeEl.innerText = pending.length;
          notifBadgeEl.classList.remove('hidden');
        } else {
          notifBadgeEl.classList.add('hidden');
        }
      } else {
        notifBadgeEl.classList.add('hidden');
      }
    }

    // Principal-only header password button
    const pwBtn = document.getElementById('header-principal-pw-btn');
    if (pwBtn) {
      if (user.role === 'principal') {
        pwBtn.classList.remove('hidden');
      } else {
        pwBtn.classList.add('hidden');
      }
    }

    this.adjustMenuForRole(user.role);
  },

  adjustMenuForRole(role) {
    const roleBanner = document.getElementById('role-indicator-banner');
    if (roleBanner) {
      if (role === 'principal') {
        roleBanner.innerHTML = `
          <div class="role-alert role-alert-principal">
            <i class="fa-solid fa-crown"></i>
            <div>
              <strong>Principal Master Governance:</strong> Full authority to <strong>Approve/Reject registrations, Add, Edit, and Erase</strong> HODs and Faculties.
            </div>
          </div>
        `;
      } else if (role === 'hod') {
        roleBanner.innerHTML = `
          <div class="role-alert role-alert-hod">
            <i class="fa-solid fa-user-tie"></i>
            <div>
              <strong>HOD Department Portal:</strong> Departmental authority to <strong>Approve/Reject Faculty registrations, Add, Edit, and Erase</strong> CSM Faculty members.
            </div>
          </div>
        `;
      } else {
        roleBanner.innerHTML = `
          <div class="role-alert role-alert-faculty">
            <i class="fa-solid fa-chalkboard-user"></i>
            <div>
              <strong>Faculty Self-Service Portal:</strong> Personal performance metrics, subject portfolio, publication tracker, and API appraisal credits.
            </div>
          </div>
        `;
      }
    }
  },

  renderTab(tabName) {
    this.activeTab = tabName;
    const content = document.getElementById('main-content-area');
    if (!content) return;

    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      if (item.dataset.tab === tabName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    switch (tabName) {
      case 'overview':
        this.renderOverview(content);
        break;
      case 'faculty-activities':
        Modules.renderFacultyActivities('main-content-area');
        break;
      case 'student-achievements':
        Modules.renderStudentAchievements('main-content-area');
        break;
      case 'publications':
        Modules.renderPublications('main-content-area');
        break;
      case 'research-grants':
        Modules.renderResearchGrants('main-content-area');
        break;
      case 'placements':
        Modules.renderPlacements('main-content-area');
        break;
      case 'laboratories':
        Modules.renderLaboratories('main-content-area');
        break;
      case 'events':
        Modules.renderEvents('main-content-area');
        break;
      case 'accreditation':
        Modules.renderAccreditation('main-content-area');
        break;
      case 'kpi-monitoring':
        Modules.renderKpis('main-content-area');
        break;
      case 'faculty-directory':
        this.renderFacultyDirectory(content);
        break;
      default:
        this.renderOverview(content);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderOverview(container) {
    const user = window.vceAuth.getCurrentUser();
    const isFaculty = user.role === 'faculty';
    const isPrincipal = user.role === 'principal';
    const isHod = user.role === 'hod';

    const kpis = window.vceDB.getDynamicKpis();
    const allUsers = window.vceDB.getUsers(false).filter(u => u.role === 'faculty' || u.role === 'hod');
    const pendingUsers = (isPrincipal || isHod) ? window.vceDB.getPendingRegistrations(user.role) : [];
    const pubs = window.vceDB.getPublications();
    const acts = window.vceDB.getFacultyActivities();

    let html = `
      <!-- Hero Banner with Campus Image -->
      <div class="campus-hero-card glass-card mb-6">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="hero-college-badge">
            <span class="badge badge-gold font-bold">Autonomous • NAAC A+ • NBA Accredited</span>
            <span class="badge badge-navy">Warangal, Telangana</span>
          </div>
          <h1 class="hero-title">
            Department of Computer Science & Engineering (AI & ML)
          </h1>
          <p class="hero-subtitle">
            Vaagdevi College of Engineering — Institutional Governance & Academic Portfolio
          </p>
          <div class="hero-quick-stats">
            <div class="hero-stat-pill">
              <i class="fa-solid fa-users text-amber"></i>
              <span>${allUsers.length} Active Staff</span>
            </div>
            <div class="hero-stat-pill">
              <i class="fa-solid fa-book-bookmark text-green"></i>
              <span>${pubs.length} Publications</span>
            </div>
            <div class="hero-stat-pill">
              <i class="fa-solid fa-flask-vial text-blue"></i>
              <span>${kpis.totalGrantsAmount} Grants</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // PENDING REGISTRATION APPROVAL CARD (FOR PRINCIPAL & HOD)
    if (pendingUsers.length > 0) {
      html += `
        <div class="glass-card p-4 mb-6" style="border: 2px solid #f59e0b; background: rgba(245, 158, 11, 0.04);">
          <div class="flex justify-between items-center mb-3">
            <div>
              <h3 class="font-bold text-slate-900 flex items-center gap-2">
                <span class="badge badge-warning"><i class="fa-solid fa-bell animate-pulse"></i> ${pendingUsers.length} New</span>
                Pending Staff Registration Approvals
              </h3>
              <p class="text-xs text-muted">
                ${isPrincipal ? 'Principal Approval required for new HODs and Faculty applicants.' : 'HOD Approval required for new Faculty applicants.'}
              </p>
            </div>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Applicant Name</th>
                  <th>Requested Role</th>
                  <th>Designation</th>
                  <th>Subject Handled</th>
                  <th>Emp ID (6-Digit)</th>
                  <th>College Email</th>
                  <th>Approval Action</th>
                </tr>
              </thead>
              <tbody>
                ${pendingUsers.map(p => `
                  <tr style="background: rgba(254, 243, 199, 0.3);">
                    <td>
                      <div class="user-cell">
                        <img src="${p.avatar}" class="avatar-sm" alt="${p.name}">
                        <div>
                          <div class="font-bold text-slate-900">${p.name}</div>
                          <div class="text-2xs text-muted font-mono">Registered: ${p.registeredAt || 'Today'}</div>
                        </div>
                      </div>
                    </td>
                    <td><span class="badge badge-xs badge-${p.role === 'hod' ? 'warning' : 'purple'} font-bold">${p.role.toUpperCase()}</span></td>
                    <td class="text-sm">${p.designation}</td>
                    <td><span class="badge badge-navy text-2xs">${p.subject}</span></td>
                    <td class="font-mono font-bold text-maroon">${p.employeeId}</td>
                    <td class="text-xs">${p.email}</td>
                    <td>
                      <div class="btn-group">
                        <button class="btn btn-xs btn-primary" style="background: #16a34a; border-color: #16a34a;" onclick="App.approveUserRegistration('${p.id}', '${p.name.replace(/'/g, "\\'")}', '${p.role}')">
                          <i class="fa-solid fa-check"></i> Approve
                        </button>
                        <button class="btn btn-xs btn-outline text-danger" onclick="App.rejectUserRegistration('${p.id}', '${p.name.replace(/'/g, "\\'")}', '${p.role}')">
                          <i class="fa-solid fa-xmark"></i> Reject & Erase
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (isFaculty) {
      const facProfile = window.vceDB.getFacultyProfileById(user.id) || {
        appraisalScore: 80.0,
        apiScore: 50,
        teachingWorkload: '16 hrs/week',
        mentorBatch: 'CSM Mentorship Batch',
        kpiSummary: { publications: 0, fdpCompleted: 0, patents: 0, studentMentored: 20, avgFeedback: 4.5 }
      };

      const myPubs = window.vceDB.getPublications(user.id);
      const myActs = window.vceDB.getFacultyActivities(user.id);

      html += `
        <div class="section-title-row mb-4 flex justify-between items-center flex-wrap gap-2">
          <div>
            <h2 class="text-xl font-bold text-slate-800"><i class="fa-solid fa-id-card-clip text-maroon"></i> My Faculty Portfolio & Performance Card</h2>
            <p class="text-xs text-muted">Personalized metrics for ${user.name}</p>
          </div>
          <div class="flex gap-2 flex-wrap">
            <button class="btn btn-outline btn-sm" onclick="App.openEditOwnProfileModal()" title="Edit personal details, credentials, and subjects">
              <i class="fa-solid fa-user-pen"></i> Edit My Profile
            </button>
            <button class="btn btn-primary btn-sm" onclick="App.openModal('modalAddPublication')">
              <i class="fa-solid fa-plus"></i> Submit Publication
            </button>
            <button class="btn btn-outline btn-sm" onclick="App.openModal('modalAddActivity')">
              <i class="fa-solid fa-plus"></i> Log Activity
            </button>
          </div>
        </div>

        <div class="grid grid-4 mb-6">
          <div class="stat-card glass-card">
            <div class="stat-icon bg-maroon-light text-maroon"><i class="fa-solid fa-gauge-high"></i></div>
            <div class="stat-details">
              <span class="stat-value font-mono">${facProfile.appraisalScore}%</span>
              <span class="stat-label">My Appraisal Score</span>
            </div>
          </div>
          <div class="stat-card glass-card">
            <div class="stat-icon bg-blue-light text-blue"><i class="fa-solid fa-star"></i></div>
            <div class="stat-details">
              <span class="stat-value font-mono">${facProfile.apiScore}</span>
              <span class="stat-label">My API Credits</span>
            </div>
          </div>
          <div class="stat-card glass-card">
            <div class="stat-icon bg-green-light text-green"><i class="fa-solid fa-book-bookmark"></i></div>
            <div class="stat-details">
              <span class="stat-value font-mono">${myPubs.length}</span>
              <span class="stat-label">My Publications</span>
            </div>
          </div>
          <div class="stat-card glass-card">
            <div class="stat-icon bg-amber-light text-amber"><i class="fa-solid fa-users-viewfinder"></i></div>
            <div class="stat-details">
              <span class="stat-value font-mono">${facProfile.kpiSummary.studentMentored}</span>
              <span class="stat-label">Students Mentored</span>
            </div>
          </div>
        </div>

        <div class="grid grid-2 mb-6">
          <div class="glass-card p-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-bold text-slate-800" style="margin: 0;"><i class="fa-solid fa-user-check text-maroon"></i> Faculty Profile & Academic Load</h3>
              <button class="btn btn-xs btn-outline" onclick="App.openEditOwnProfileModal()" title="Edit your profile">
                <i class="fa-solid fa-pen-to-square"></i> Edit Profile
              </button>
            </div>
            <div class="profile-meta-list">
              <div class="meta-row"><strong>Designation:</strong> <span>${user.designation}</span></div>
              <div class="meta-row"><strong>Employee ID:</strong> <span class="font-mono font-bold text-maroon">${user.employeeId}</span></div>
              <div class="meta-row"><strong>Qualification:</strong> <span>${user.qualification || facProfile.qualification || 'M.Tech (CSE)'}</span></div>
              <div class="meta-row"><strong>Subject Handled:</strong> <span class="badge badge-purple">${user.subject || 'Artificial Intelligence & Machine Learning'}</span></div>
              <div class="meta-row"><strong>Workload:</strong> <span>${user.teachingWorkload || facProfile.teachingWorkload || '16 hrs/week'}</span></div>
              <div class="meta-row"><strong>Contact:</strong> <span>${user.phone || '+91 98480 00000'}</span></div>
            </div>
          </div>

          <div class="glass-card p-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-bold text-slate-800"><i class="fa-solid fa-clock-rotate-left text-maroon"></i> My Recent Activity Submissions</h3>
              <button class="btn btn-xs btn-outline" onclick="Dashboard.renderTab('faculty-activities')">View All</button>
            </div>
            <div class="timeline-compact">
              ${myActs.length === 0 ? '<div class="text-muted text-xs p-3 text-center">No activities submitted yet. Click "Log Activity" to submit your FDPs or Certifications.</div>' : ''}
              ${myActs.slice(0, 4).map(a => `
                <div class="timeline-compact-item mb-2 p-2" style="border-bottom: 1px solid var(--border-color);">
                  <div class="flex justify-between items-center">
                    <strong class="text-xs text-slate-800">${a.title}</strong>
                    <span class="badge badge-xs badge-${a.status === 'Approved' ? 'success' : 'warning'}">${a.status}</span>
                  </div>
                  <div class="text-2xs text-muted">${a.category} • ${a.startDate}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } else {
      const canManageStaff = isPrincipal || isHod;

      html += `
        <!-- Principal Master Security & Password Management (Principal Page Only) -->
        ${isPrincipal ? `
          <div class="glass-card p-4 mb-6" style="border-left: 4px solid var(--color-maroon-primary); background: rgba(139, 24, 32, 0.03);">
            <div class="flex justify-between items-center flex-wrap gap-3">
              <div class="flex items-center gap-3">
                <div class="stat-icon bg-maroon-light text-maroon" style="width: 44px; height: 44px; font-size: 1.25rem;">
                  <i class="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 text-base" style="margin: 0;">College Principal Master Security & Credentials</h3>
                  <p class="text-xs text-muted" style="margin: 0;">You can update your profile information or Principal Master Password directly.</p>
                </div>
              </div>
              <div class="flex gap-2 flex-wrap">
                <button class="btn btn-sm btn-outline" onclick="App.openEditOwnProfileModal()" title="Edit your Principal profile details">
                  <i class="fa-solid fa-user-gear"></i> Edit My Profile
                </button>
                <button class="btn btn-sm btn-primary" onclick="App.openChangePrincipalPasswordModal()">
                  <i class="fa-solid fa-key"></i> Change Principal Password
                </button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- KPI Dynamic Metric Grid -->
        <div class="grid grid-4 mb-6">
          <div class="stat-card glass-card">
            <div class="stat-icon bg-maroon-light text-maroon"><i class="fa-solid fa-users"></i></div>
            <div class="stat-details">
              <span class="stat-value font-mono">${allUsers.length}</span>
              <span class="stat-label">Active Staff</span>
              <span class="stat-subtext text-muted">Approved HODs & Faculties</span>
            </div>
          </div>
          <div class="stat-card glass-card">
            <div class="stat-icon bg-green-light text-green"><i class="fa-solid fa-book-bookmark"></i></div>
            <div class="stat-details">
              <span class="stat-value font-mono">${pubs.length}</span>
              <span class="stat-label">Total Publications</span>
              <span class="stat-subtext text-muted">${kpis.totalCitations} Citations</span>
            </div>
          </div>
          <div class="stat-card glass-card">
            <div class="stat-icon bg-blue-light text-blue"><i class="fa-solid fa-indian-rupee-sign"></i></div>
            <div class="stat-details">
              <span class="stat-value font-mono">${kpis.totalGrantsAmount}</span>
              <span class="stat-label">Funded Grants</span>
              <span class="stat-subtext text-muted">Sponsored R&D</span>
            </div>
          </div>
          <div class="stat-card glass-card">
            <div class="stat-icon bg-amber-light text-amber"><i class="fa-solid fa-list-check"></i></div>
            <div class="stat-details">
              <span class="stat-value font-mono">${acts.length}</span>
              <span class="stat-label">Logged Activities</span>
              <span class="stat-subtext text-muted">FDPs & Workshops</span>
            </div>
          </div>
        </div>

        <!-- Faculty & Staff Directory Management Table -->
        <div class="glass-card p-4 mb-6">
          <div class="flex justify-between items-center mb-3 flex-wrap gap-2">
            <div>
              <h3 class="font-bold text-slate-800">
                <i class="fa-solid fa-users text-maroon"></i> ${isPrincipal ? 'Institutional Staff Oversight (Approved HODs & Faculties)' : 'CSM Department Faculty Roster'}
              </h3>
              <p class="text-xs text-muted">
                ${isPrincipal ? 'Principal Permissions: Add, Edit, or Erase HODs and Faculties' : 'HOD Permissions: Add, Edit, or Erase Faculty members'}
              </p>
            </div>
            <div class="flex gap-2 flex-wrap">
              <button class="btn btn-sm btn-outline" onclick="App.openEditOwnProfileModal()" title="Edit your own profile details">
                <i class="fa-solid fa-user-gear"></i> Edit My Profile
              </button>
              <button class="btn btn-sm btn-primary" onclick="App.openAddStaffModal()">
                <i class="fa-solid fa-user-plus"></i> ${isPrincipal ? 'Add Staff (HOD/Faculty)' : 'Add New Faculty'}
              </button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Staff Name & Role</th>
                  <th>Designation</th>
                  <th>Subject Handled (CSM)</th>
                  <th>Employee ID (6-Digit)</th>
                  <th>College Email</th>
                  <th>Workload</th>
                  ${canManageStaff ? '<th>Actions</th>' : ''}
                </tr>
              </thead>
              <tbody>
                ${allUsers.length === 0 ? `<tr><td colspan="${canManageStaff ? 7 : 6}" class="text-center text-muted p-4">No active staff members registered yet. Click "Add Staff" or approve pending registrations.</td></tr>` : ''}
                ${allUsers.map(u => {
                  const prof = window.vceDB.getFacultyProfileById(u.id) || { teachingWorkload: '16 hrs/week' };
                  const canEditThisUser = isPrincipal || (isHod && u.role === 'faculty');
                  return `
                    <tr>
                      <td>
                        <div class="user-cell">
                          <img src="${u.avatar}" class="avatar-sm" alt="${u.name}">
                          <div>
                            <div class="font-semibold text-slate-900">${u.name}</div>
                            <div class="text-xs text-muted font-mono"><span class="badge badge-xs badge-${u.role === 'hod' ? 'warning' : 'purple'}">${u.role.toUpperCase()}</span></div>
                          </div>
                        </div>
                      </td>
                      <td class="text-sm">${u.designation}</td>
                      <td class="text-xs font-semibold text-slate-800">
                        <span class="badge badge-purple">${u.subject || 'Artificial Intelligence & Machine Learning'}</span>
                      </td>
                      <td class="font-mono font-bold text-xs text-maroon">${u.employeeId}</td>
                      <td class="text-xs">${u.email}</td>
                      <td class="text-xs font-mono">${prof.teachingWorkload || '16 hrs/week'}</td>
                      ${canManageStaff ? `
                        <td>
                          ${canEditThisUser ? `
                            <div class="btn-group">
                              <button class="btn-icon" title="Edit Staff Details" onclick="App.openEditStaffModal('${u.id}')">
                                <i class="fa-solid fa-pen-to-square text-blue"></i>
                              </button>
                              <button class="btn-icon btn-icon-danger" title="Erase Staff Account" onclick="App.deleteStaffMember('${u.id}', '${u.name.replace(/'/g, "\\'")}')">
                                <i class="fa-solid fa-trash-can"></i>
                              </button>
                            </div>
                          ` : `
                            <span class="text-xs text-muted">Protected</span>
                          `}
                        </td>
                      ` : ''}
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  },

  renderFacultyDirectory(container) {
    const user = window.vceAuth.getCurrentUser();
    const isPrincipal = user.role === 'principal';
    const isHod = user.role === 'hod';
    const canManage = isPrincipal || isHod;
    const users = window.vceDB.getUsers(false).filter(u => u.role === 'faculty' || u.role === 'hod');

    let html = `
      <div class="module-header">
        <div>
          <h2 class="module-title"><i class="fa-solid fa-users text-maroon"></i> CSM Department Faculty Directory</h2>
          <p class="module-subtitle">${isPrincipal ? 'Principal Master Control: Add, Edit, or Erase HODs & Faculties' : isHod ? 'HOD Control: Add, Edit, or Erase Faculties' : 'Faculty Directory & Subjects Handled'}</p>
        </div>
        <div class="module-actions">
          ${canManage ? `
            <button class="btn btn-primary" onclick="App.openAddStaffModal()">
              <i class="fa-solid fa-user-plus"></i> ${isPrincipal ? 'Add Staff Member' : 'Add Faculty'}
            </button>
          ` : ''}
        </div>
      </div>
    `;

    if (users.length === 0) {
      html += `
        <div class="glass-card p-6 text-center">
          <div style="font-size: 2.5rem; color: #94a3b8; margin-bottom: 12px;"><i class="fa-solid fa-users"></i></div>
          <h3 class="text-lg font-bold text-slate-800 mb-2">No Active Faculty or HOD Registered Yet</h3>
          <p class="text-sm text-muted mb-4">Click below to add a staff member or approve pending registrations.</p>
          <button class="btn btn-primary" onclick="App.openAddStaffModal()">
            <i class="fa-solid fa-user-plus"></i> Add Staff Member
          </button>
        </div>
      `;
    } else {
      html += `
        <div class="grid grid-3">
          ${users.map(u => {
            const isOwnCard = u.id === user.id;
            const canEdit = isPrincipal || (isHod && u.role === 'faculty');
            return `
              <div class="faculty-card glass-card">
                <div class="faculty-card-header">
                  <img src="${u.avatar}" class="faculty-avatar" alt="${u.name}">
                  <div style="flex: 1;">
                    <div class="flex justify-between items-center">
                      <h3 class="faculty-name" style="margin: 0;">${u.name}</h3>
                      <span class="badge badge-xs badge-${u.role === 'hod' ? 'warning' : 'purple'}">${u.role.toUpperCase()}</span>
                    </div>
                    <div class="text-xs font-semibold text-maroon">${u.designation}</div>
                    <div class="text-xs text-muted font-mono font-bold">Emp ID: ${u.employeeId}</div>
                  </div>
                </div>

                <div class="faculty-spec-pill">
                  <i class="fa-solid fa-book-open-reader text-maroon"></i> <strong>Subject:</strong> ${u.subject || 'Artificial Intelligence & Machine Learning'}
                </div>

                <div class="faculty-contact-footer">
                  <div><i class="fa-solid fa-envelope text-slate-400"></i> ${u.email}</div>
                  <div><i class="fa-solid fa-phone text-slate-400"></i> ${u.phone || '+91 98480 00000'}</div>
                </div>

                ${isOwnCard ? `
                  <div class="flex justify-end gap-2 mt-3 pt-2" style="border-top: 1px solid var(--border-color);">
                    <button class="btn btn-xs btn-outline" onclick="App.openEditOwnProfileModal()">
                      <i class="fa-solid fa-user-pen text-maroon"></i> Edit My Profile
                    </button>
                  </div>
                ` : canEdit ? `
                  <div class="flex justify-end gap-2 mt-3 pt-2" style="border-top: 1px solid var(--border-color);">
                    <button class="btn btn-xs btn-outline" onclick="App.openEditStaffModal('${u.id}')">
                      <i class="fa-solid fa-pen-to-square text-blue"></i> Edit
                    </button>
                    <button class="btn btn-xs btn-outline text-danger" onclick="App.deleteStaffMember('${u.id}', '${u.name.replace(/'/g, "\\'")}')">
                      <i class="fa-solid fa-trash-can"></i> Erase
                    </button>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    container.innerHTML = html;
  }
};

window.Dashboard = Dashboard;
