/**
 * Vaagdevi College of Engineering - CSM Department Dashboard
 * Department Modules with Erase / Deletion Permissions & "Ask The Data" Integration
 */

const Modules = {
  // 1. Faculty Activities Module
  renderFacultyActivities(containerId, filter = {}) {
    const user = window.vceAuth.getCurrentUser();
    const isFacultyOnly = user && user.role === 'faculty';
    const facultyId = isFacultyOnly ? user.id : null;
    let activities = window.vceDB.getFacultyActivities(facultyId);

    if (filter.category && filter.category !== 'all') {
      activities = activities.filter(a => a.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      activities = activities.filter(a =>
        (a.title || '').toLowerCase().includes(q) ||
        (a.facultyName || '').toLowerCase().includes(q) ||
        (a.organizer || '').toLowerCase().includes(q)
      );
    }

    const container = document.getElementById(containerId);
    if (!container) return;

    const canApprove = window.vceAuth.hasRole('principal', 'hod');

    let html = `
      <div class="module-header">
        <div>
          <h2 class="module-title"><i class="fa-solid fa-chalkboard-user text-maroon"></i> Faculty Activities & Development</h2>
          <p class="module-subtitle">FDPs, Certifications, Industry Workshops, Patents & Keynote Lectures</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary" onclick="App.openModal('modalAddActivity')">
            <i class="fa-solid fa-plus"></i> Submit New Activity
          </button>
          ${activities.length > 0 ? `
            <button class="btn btn-outline" onclick="App.exportTableToCSV('faculty-activities-table', 'Faculty_Activities')">
              <i class="fa-solid fa-file-excel"></i> Export CSV
            </button>
          ` : ''}
        </div>
      </div>

      <div class="filter-bar">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search activity, faculty, organizer..." oninput="Modules.filterActivities(this.value)">
        </div>
        <div class="filter-chips">
          <button class="chip active" onclick="Modules.setActivityCategory('all', this)">All (${activities.length})</button>
          <button class="chip" onclick="Modules.setActivityCategory('FDP', this)">FDPs</button>
          <button class="chip" onclick="Modules.setActivityCategory('Certification', this)">Certifications</button>
          <button class="chip" onclick="Modules.setActivityCategory('Workshop', this)">Workshops</button>
          <button class="chip" onclick="Modules.setActivityCategory('Patent', this)">Patents</button>
        </div>
      </div>
    `;

    if (activities.length === 0) {
      html += `
        <div class="glass-card p-6 text-center">
          <div style="font-size: 2.5rem; color: #94a3b8; margin-bottom: 12px;"><i class="fa-solid fa-chalkboard-user"></i></div>
          <h3 class="text-lg font-bold text-slate-800 mb-2">No Faculty Activities Recorded Yet</h3>
          <p class="text-sm text-muted mb-4">Faculty members and HODs can submit completed FDPs and certifications.</p>
          <button class="btn btn-primary" onclick="App.openModal('modalAddActivity')">
            <i class="fa-solid fa-plus"></i> Submit First Activity
          </button>
        </div>
      `;
    } else {
      html += `
        <div class="table-responsive glass-card">
          <table class="data-table" id="faculty-activities-table">
            <thead>
              <tr>
                <th>Faculty Name</th>
                <th>Category</th>
                <th>Activity Title & Organizer</th>
                <th>Duration / Date</th>
                <th>API Credits</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${activities.map(act => {
                const canErase = user.role === 'principal' || user.role === 'hod' || act.facultyId === user.id;
                return `
                  <tr>
                    <td>
                      <div class="user-cell">
                        <div class="avatar-sm">${(act.facultyName || 'F').charAt(0)}</div>
                        <div>
                          <div class="font-semibold text-slate-800">${act.facultyName}</div>
                          <div class="text-xs text-muted">CSM Faculty</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge badge-${(act.category || 'fdp').toLowerCase().replace(' ', '-')}">${act.category}</span>
                    </td>
                    <td>
                      <div class="font-medium text-slate-900">${act.title}</div>
                      <div class="text-xs text-muted"><i class="fa-solid fa-building-columns"></i> ${act.organizer}</div>
                    </td>
                    <td>
                      <div class="text-sm">${act.duration}</div>
                      <div class="text-xs text-muted">${act.startDate}</div>
                    </td>
                    <td>
                      <span class="badge badge-amber font-mono font-bold">+${act.credits} Pts</span>
                    </td>
                    <td>
                      <span class="badge badge-${act.status === 'Approved' ? 'success' : act.status.includes('Pending') ? 'warning' : 'danger'}">
                        <i class="fa-solid ${act.status === 'Approved' ? 'fa-check' : 'fa-clock'}"></i> ${act.status}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group">
                        ${canApprove && act.status !== 'Approved' ? `
                          <button class="btn-icon btn-icon-success" title="Approve Activity" onclick="Modules.approveActivity('${act.id}', 'Approved')">
                            <i class="fa-solid fa-check"></i>
                          </button>
                        ` : ''}
                        ${canErase ? `
                          <button class="btn-icon btn-icon-danger" title="Erase Activity" onclick="App.eraseFacultyActivity('${act.id}')">
                            <i class="fa-solid fa-trash-can"></i>
                          </button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    container.innerHTML = html;
  },

  setActivityCategory(cat, btn) {
    document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.currentActivityCategory = cat;
    this.renderFacultyActivities('main-content-area', { category: cat, search: this.currentActivitySearch });
  },

  filterActivities(query) {
    this.currentActivitySearch = query;
    this.renderFacultyActivities('main-content-area', { category: this.currentActivityCategory, search: query });
  },

  approveActivity(actId, newStatus) {
    const user = window.vceAuth.getCurrentUser();
    const approverName = user ? user.name : 'Administrator';
    window.vceDB.updateActivityStatus(actId, newStatus, approverName);
    App.showToast(`Activity status updated to ${newStatus}`, 'success');
    this.renderFacultyActivities('main-content-area', { category: this.currentActivityCategory, search: this.currentActivitySearch });
  },

  // 2. Student Achievements Module
  renderStudentAchievements(containerId) {
    const user = window.vceAuth.getCurrentUser();
    const achievements = window.vceDB.getStudentAchievements();
    const container = document.getElementById(containerId);
    if (!container) return;

    const canErase = user && (user.role === 'principal' || user.role === 'hod');

    let html = `
      <div class="module-header">
        <div>
          <h2 class="module-title"><i class="fa-solid fa-trophy text-amber"></i> Student Achievements & Hackathons</h2>
          <p class="module-subtitle">National Hackathon Wins, Global Fellowships, Coding Contests & High-Impact Projects</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary" onclick="App.openModal('modalAddAchievement')">
            <i class="fa-solid fa-plus"></i> Log Student Achievement
          </button>
        </div>
      </div>
    `;

    if (achievements.length === 0) {
      html += `
        <div class="glass-card p-6 text-center">
          <div style="font-size: 2.5rem; color: #f59e0b; margin-bottom: 12px;"><i class="fa-solid fa-trophy"></i></div>
          <h3 class="text-lg font-bold text-slate-800 mb-2">No Student Achievements Recorded Yet</h3>
          <p class="text-sm text-muted mb-4">Record Smart India Hackathon wins, Kaggle medals, and awards for CSM students.</p>
          <button class="btn btn-primary" onclick="App.openModal('modalAddAchievement')">
            <i class="fa-solid fa-plus"></i> Log First Student Achievement
          </button>
        </div>
      `;
    } else {
      html += `
        <div class="grid grid-2">
          ${achievements.map(ach => `
            <div class="achievement-card glass-card">
              <div class="achievement-badge-strip flex justify-between items-center">
                <span class="badge badge-gold"><i class="fa-solid fa-medal"></i> ${ach.category || 'National Contest'}</span>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-muted font-mono">${ach.date}</span>
                  ${canErase ? `
                    <button class="btn-icon btn-icon-danger btn-xs" title="Erase Record" onclick="App.eraseStudentAchievement('${ach.id}')">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  ` : ''}
                </div>
              </div>
              <h3 class="achievement-title">${ach.achievement}</h3>
              <div class="achievement-competition">
                <i class="fa-solid fa-flag-checkered text-maroon"></i> ${ach.competition}
              </div>
              <div class="achievement-project">
                <span class="font-semibold text-slate-700">Project:</span> "${ach.projectTitle}"
              </div>
              <div class="achievement-footer">
                <div class="student-info">
                  <i class="fa-solid fa-user-graduate text-slate-500"></i>
                  <div>
                    <strong>${ach.studentName}</strong>
                    <span class="text-xs text-muted">(${ach.rollNumber})</span>
                  </div>
                </div>
                <div class="mentor-info">
                  <span class="text-xs text-muted">Mentor:</span>
                  <span class="text-xs font-semibold text-slate-800">${ach.mentorFaculty}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    container.innerHTML = html;
  },

  // 3. Publications Module
  renderPublications(containerId, filter = {}) {
    const user = window.vceAuth.getCurrentUser();
    const isFacultyOnly = user && user.role === 'faculty';
    const facultyId = isFacultyOnly ? user.id : null;
    let publications = window.vceDB.getPublications(facultyId);

    if (filter.search) {
      const q = filter.search.toLowerCase();
      publications = publications.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.authors || '').toLowerCase().includes(q) ||
        (p.journal || '').toLowerCase().includes(q) ||
        (p.indexing || '').toLowerCase().includes(q)
      );
    }
    if (filter.indexing && filter.indexing !== 'all') {
      publications = publications.filter(p => (p.indexing || '').toLowerCase().includes(filter.indexing.toLowerCase()));
    }

    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
      <div class="module-header">
        <div>
          <h2 class="module-title"><i class="fa-solid fa-book-bookmark text-maroon"></i> Research Publications & Journals</h2>
          <p class="module-subtitle">Scopus, SCI, IEEE Transactions, Springer & ACM Indexed Research Papers</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary" onclick="App.openModal('modalAddPublication')">
            <i class="fa-solid fa-plus"></i> Add Research Publication
          </button>
          ${publications.length > 0 ? `
            <button class="btn btn-outline" onclick="App.exportTableToCSV('publications-table', 'CSM_Publications')">
              <i class="fa-solid fa-file-excel"></i> Export CSV
            </button>
          ` : ''}
        </div>
      </div>
    `;

    if (publications.length === 0) {
      html += `
        <div class="glass-card p-6 text-center">
          <div style="font-size: 2.5rem; color: #8b1820; margin-bottom: 12px;"><i class="fa-solid fa-book-open"></i></div>
          <h3 class="text-lg font-bold text-slate-800 mb-2">No Research Publications Added Yet</h3>
          <p class="text-sm text-muted mb-4">Faculty members can upload and catalog IEEE, Scopus, and SCI papers.</p>
          <button class="btn btn-primary" onclick="App.openModal('modalAddPublication')">
            <i class="fa-solid fa-plus"></i> Add First Publication
          </button>
        </div>
      `;
    } else {
      html += `
        <div class="filter-bar">
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Search paper title, author, journal..." oninput="Modules.filterPublications(this.value)">
          </div>
          <div class="filter-chips">
            <button class="chip active" onclick="Modules.setPublicationIndex('all', this)">All (${publications.length})</button>
            <button class="chip" onclick="Modules.setPublicationIndex('SCI', this)">SCI / SCIE</button>
            <button class="chip" onclick="Modules.setPublicationIndex('Scopus', this)">Scopus</button>
            <button class="chip" onclick="Modules.setPublicationIndex('IEEE', this)">IEEE</button>
          </div>
        </div>

        <div class="table-responsive glass-card">
          <table class="data-table" id="publications-table">
            <thead>
              <tr>
                <th>Paper Title & Details</th>
                <th>Authors</th>
                <th>Journal / Indexing</th>
                <th>Citations</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${publications.map(pub => {
                const canErase = user.role === 'principal' || user.role === 'hod' || pub.facultyId === user.id;
                return `
                  <tr>
                    <td style="max-width: 300px;">
                      <div class="font-semibold text-slate-900">${pub.title}</div>
                      <span class="badge badge-sm badge-success">${pub.status || 'Published'}</span>
                    </td>
                    <td class="text-sm text-slate-700 font-medium">${pub.authors}</td>
                    <td>
                      <div class="text-sm font-medium text-slate-800">${pub.journal}</div>
                      <span class="badge badge-purple font-xs">${pub.indexing}</span>
                    </td>
                    <td>
                      <span class="badge badge-amber font-mono font-bold"><i class="fa-solid fa-quote-right"></i> ${pub.citations || 0}</span>
                    </td>
                    <td class="font-mono font-bold text-slate-700">${pub.year}</td>
                    <td>
                      <div class="btn-group">
                        <a href="${pub.link || '#'}" target="_blank" class="btn btn-xs btn-outline">
                          <i class="fa-solid fa-arrow-up-right-from-square"></i> DOI
                        </a>
                        ${canErase ? `
                          <button class="btn-icon btn-icon-danger btn-xs" title="Erase Publication" onclick="App.erasePublication('${pub.id}')">
                            <i class="fa-solid fa-trash-can"></i>
                          </button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    container.innerHTML = html;
  },

  filterPublications(query) {
    this.currentPubSearch = query;
    this.renderPublications('main-content-area', { search: query, indexing: this.currentPubIndex });
  },

  setPublicationIndex(idx, btn) {
    document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.currentPubIndex = idx;
    this.renderPublications('main-content-area', { search: this.currentPubSearch, indexing: idx });
  },

  // 4. Research Grants Module
  renderResearchGrants(containerId) {
    const user = window.vceAuth.getCurrentUser();
    const grants = window.vceDB.getResearchGrants();
    const container = document.getElementById(containerId);
    if (!container) return;

    const isPrincipal = user && user.role === 'principal';

    let html = `
      <div class="module-header">
        <div>
          <h2 class="module-title"><i class="fa-solid fa-flask-vial text-maroon"></i> Sponsored Research & Grants</h2>
          <p class="module-subtitle">AICTE IDEA Lab, DST-SERB, DRDO & Industrial Collaborative R&D Projects</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary" onclick="App.openModal('modalAddGrant')">
            <i class="fa-solid fa-plus"></i> Submit Research Grant
          </button>
        </div>
      </div>
    `;

    if (grants.length === 0) {
      html += `
        <div class="glass-card p-6 text-center">
          <div style="font-size: 2.5rem; color: #2563eb; margin-bottom: 12px;"><i class="fa-solid fa-flask-vial"></i></div>
          <h3 class="text-lg font-bold text-slate-800 mb-2">No Funded Research Grants Added Yet</h3>
          <p class="text-sm text-muted mb-4">Principal or investigators can submit approved or proposed R&D grants.</p>
          <button class="btn btn-primary" onclick="App.openModal('modalAddGrant')">
            <i class="fa-solid fa-plus"></i> Submit First Research Grant
          </button>
        </div>
      `;
    } else {
      html += `
        <div class="grid grid-2">
          ${grants.map(grt => `
            <div class="grant-card glass-card">
              <div class="grant-header flex justify-between items-center">
                <span class="badge badge-success font-semibold"><i class="fa-solid fa-circle-check"></i> ${grt.status}</span>
                <div class="flex items-center gap-2">
                  <span class="grant-amount font-mono">${grt.sanctionAmount}</span>
                  ${isPrincipal ? `
                    <button class="btn-icon btn-icon-danger btn-xs" title="Erase Grant (Principal Only)" onclick="App.eraseResearchGrant('${grt.id}')">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  ` : ''}
                </div>
              </div>
              <h3 class="grant-title">${grt.title}</h3>
              <div class="grant-meta">
                <div><strong>Agency:</strong> ${grt.fundingAgency}</div>
                <div><strong>Order:</strong> <span class="font-mono text-xs">${grt.sanctionOrderNo}</span></div>
                <div><strong>Principal Investigator:</strong> ${grt.principalInvestigator}</div>
                <div><strong>Duration:</strong> ${grt.duration}</div>
              </div>
              <div class="grant-progress-section">
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span>Fund Utilization</span>
                  <span>${grt.utilizationPercentage || 0}%</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar-fill" style="width: ${grt.utilizationPercentage || 0}%"></div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    container.innerHTML = html;
  },

  // 5. Placements Module
  renderPlacements(containerId) {
    const user = window.vceAuth.getCurrentUser();
    const placements = window.vceDB.getPlacements();
    const container = document.getElementById(containerId);
    if (!container) return;

    const canErase = user && (user.role === 'principal' || user.role === 'hod');

    let html = `
      <div class="module-header">
        <div>
          <h2 class="module-title"><i class="fa-solid fa-briefcase text-maroon"></i> CSM Placements & Career Center</h2>
          <p class="module-subtitle">Track AI & ML Batch Placements, Top Recruiter Offers & Package Analytics</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary" onclick="App.openModal('modalAddPlacement')">
            <i class="fa-solid fa-plus"></i> Record Student Placement Offer
          </button>
        </div>
      </div>
    `;

    if (placements.topOffers.length === 0) {
      html += `
        <div class="glass-card p-6 text-center">
          <div style="font-size: 2.5rem; color: #10b981; margin-bottom: 12px;"><i class="fa-solid fa-briefcase"></i></div>
          <h3 class="text-lg font-bold text-slate-800 mb-2">No Placements Recorded Yet for Current Batch</h3>
          <p class="text-sm text-muted mb-4">Click below to record student placement offers from campus drives.</p>
          <button class="btn btn-primary" onclick="App.openModal('modalAddPlacement')">
            <i class="fa-solid fa-plus"></i> Add Student Placement Record
          </button>
        </div>
      `;
    } else {
      html += `
        <div class="glass-card p-4">
          <h3 class="font-bold text-slate-800 mb-3"><i class="fa-solid fa-star text-amber"></i> Placed CSM Students (${placements.topOffers.length} Offers)</h3>
          <div class="table-responsive">
            <table class="data-table" id="placements-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>CTC Package</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${placements.topOffers.map(o => `
                  <tr>
                    <td class="font-semibold text-slate-900">${o.student}</td>
                    <td><span class="badge badge-navy font-bold"><i class="fa-solid fa-building"></i> ${o.company}</span></td>
                    <td class="text-sm font-medium text-slate-700">${o.role}</td>
                    <td><span class="badge badge-gold font-mono font-bold">${o.ctc}</span></td>
                    <td>
                      ${canErase ? `
                        <button class="btn-icon btn-icon-danger btn-xs" title="Erase Record" onclick="App.erasePlacement('${o.id}')">
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      ` : '<span class="text-xs text-muted">Saved</span>'}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  },

  // 6. Laboratories Module
  renderLaboratories(containerId) {
    const labs = window.vceDB.getLaboratories();
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
      <div class="module-header">
        <div>
          <h2 class="module-title"><i class="fa-solid fa-server text-maroon"></i> Department AI & Computing Labs</h2>
          <p class="module-subtitle">NVIDIA GPU Supercomputing, Robotics, Cloud AI & IoT Laboratory Facilities</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary" onclick="App.openModal('modalBookLab')">
            <i class="fa-solid fa-calendar-plus"></i> Book Lab Session / Slot
          </button>
        </div>
      </div>

      <div class="grid grid-2">
        ${labs.map(lab => `
          <div class="lab-card glass-card">
            <div class="lab-header">
              <div>
                <span class="badge badge-navy font-mono">${lab.code}</span>
                <h3 class="lab-name">${lab.name}</h3>
                <div class="text-xs text-muted"><i class="fa-solid fa-location-dot"></i> ${lab.location}</div>
              </div>
              <div class="lab-gauge">
                <div class="gauge-value font-mono ${lab.utilizationRate > 50 ? 'text-maroon' : 'text-green'}">${lab.utilizationRate}%</div>
                <div class="text-2xs text-muted uppercase">Utilization</div>
              </div>
            </div>

            <div class="lab-status-badge ${lab.currentStatus.includes('In Session') ? 'status-active' : 'status-idle'}">
              <i class="fa-solid ${lab.currentStatus.includes('In Session') ? 'fa-circle-dot animate-pulse' : 'fa-check'}"></i> ${lab.currentStatus}
            </div>

            <div class="lab-specs">
              <div><strong>Capacity:</strong> ${lab.systemsCount} Workstations</div>
              <div><strong>Hardware:</strong> <span class="text-xs font-medium text-slate-700">${lab.hardwareSpecs}</span></div>
              <div><strong>Faculty In-Charge:</strong> ${lab.facultyInCharge}</div>
            </div>

            <div class="lab-footer">
              <div class="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Booked Hours: ${lab.weeklyHoursUsed || 0} hrs</span>
                <span>${lab.utilizationRate}%</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill bg-maroon" style="width: ${lab.utilizationRate}%"></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = html;
  },

  // 7. Events & Workshops Module
  renderEvents(containerId) {
    const user = window.vceAuth.getCurrentUser();
    const events = window.vceDB.getEvents();
    const container = document.getElementById(containerId);
    if (!container) return;

    const canErase = user && (user.role === 'principal' || user.role === 'hod');

    let html = `
      <div class="module-header">
        <div>
          <h2 class="module-title"><i class="fa-solid fa-calendar-days text-maroon"></i> Department Events & Conferences</h2>
          <p class="module-subtitle">Conferences, Hackathons, Faculty Enablement & Industry Webinars</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary" onclick="App.openModal('modalAddEvent')">
            <i class="fa-solid fa-plus"></i> Create Department Event
          </button>
        </div>
      </div>
    `;

    if (events.length === 0) {
      html += `
        <div class="glass-card p-6 text-center">
          <div style="font-size: 2.5rem; color: #7c3aed; margin-bottom: 12px;"><i class="fa-solid fa-calendar-days"></i></div>
          <h3 class="text-lg font-bold text-slate-800 mb-2">No Department Events Scheduled Yet</h3>
          <p class="text-sm text-muted mb-4">Create and announce national conferences, student hackathons, and FDP bootcamps.</p>
          <button class="btn btn-primary" onclick="App.openModal('modalAddEvent')">
            <i class="fa-solid fa-plus"></i> Create First Event
          </button>
        </div>
      `;
    } else {
      html += `
        <div class="grid grid-2">
          ${events.map(evt => `
            <div class="event-card glass-card">
              <div class="event-type-strip flex justify-between items-center">
                <span class="badge badge-purple">${evt.category}</span>
                <div class="flex items-center gap-2">
                  <span class="badge badge-warning">${evt.status}</span>
                  ${canErase ? `
                    <button class="btn-icon btn-icon-danger btn-xs" title="Erase Event" onclick="App.eraseEvent('${evt.id}')">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  ` : ''}
                </div>
              </div>
              <h3 class="event-title">${evt.title}</h3>
              <p class="text-sm text-slate-600 mb-3">${evt.description || 'Departmental event scheduled.'}</p>
              <div class="event-meta-grid">
                <div><i class="fa-regular fa-calendar text-maroon"></i> <strong>Date:</strong> ${evt.date}</div>
                <div><i class="fa-solid fa-location-dot text-slate-500"></i> <strong>Venue:</strong> ${evt.venue}</div>
                <div><i class="fa-solid fa-user-tie text-blue"></i> <strong>Coordinator:</strong> ${evt.coordinator}</div>
                <div><i class="fa-solid fa-wallet text-amber"></i> <strong>Budget:</strong> ${evt.budget}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    container.innerHTML = html;
  },

  // 8. Accreditation Module
  renderAccreditation(containerId) {
    const acc = window.vceDB.getAccreditation();
    const container = document.getElementById(containerId);
    if (!container) return;

    const canEditMarks = window.vceAuth.hasRole('principal', 'hod');

    let html = `
      <div class="module-header">
        <div>
          <h2 class="module-title"><i class="fa-solid fa-certificate text-maroon"></i> NBA & NAAC Accreditation Readiness</h2>
          <p class="module-subtitle">NBA Tier-I 10-Criteria Compliance, NAAC Metric Tracking & CO-PO Attainment</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-outline" onclick="App.exportTableToCSV('nba-criteria-table', 'NBA_Criteria_Report')">
            <i class="fa-solid fa-file-pdf"></i> Export Scorecard
          </button>
        </div>
      </div>

      <div class="glass-card p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-slate-800"><i class="fa-solid fa-table-list text-maroon"></i> NBA Tier-I Detailed Criteria Scorecard (Self Assessment)</h3>
          ${canEditMarks ? '<span class="text-xs text-muted"><i class="fa-solid fa-lock-open text-success"></i> Edit Enabled for HOD / Principal</span>' : ''}
        </div>
        <div class="table-responsive">
          <table class="data-table" id="nba-criteria-table">
            <thead>
              <tr>
                <th>Criterion #</th>
                <th>Criteria Name</th>
                <th>Lead</th>
                <th>Max Marks</th>
                <th>Obtained Marks</th>
                <th>Attainment %</th>
                <th>Audit Status</th>
                ${canEditMarks ? '<th>Edit</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${acc.criteria.map(crit => {
                const pct = crit.maxMarks > 0 ? ((crit.obtainedMarks / crit.maxMarks) * 100).toFixed(1) : '0.0';
                return `
                  <tr>
                    <td class="font-mono font-bold text-maroon">Criterion ${crit.id}</td>
                    <td class="font-semibold text-slate-900">${crit.name}</td>
                    <td class="text-sm text-slate-700">${crit.lead}</td>
                    <td class="font-mono">${crit.maxMarks}</td>
                    <td class="font-mono font-bold ${crit.obtainedMarks > 0 ? 'text-success' : 'text-slate-400'}">${crit.obtainedMarks}</td>
                    <td>
                      <div class="flex items-center gap-2">
                        <div class="progress-bar-container" style="width: 80px;">
                          <div class="progress-bar-fill bg-maroon" style="width: ${pct}%"></div>
                        </div>
                        <span class="text-xs font-mono font-bold">${pct}%</span>
                      </div>
                    </td>
                    <td>
                      <span class="badge badge-${crit.status === 'Audit Ready' ? 'success' : 'warning'}">${crit.status}</span>
                    </td>
                    ${canEditMarks ? `
                      <td>
                        <button class="btn btn-sm btn-outline" onclick="Modules.openEditNbaModal(${crit.id}, '${crit.name}', ${crit.maxMarks}, ${crit.obtainedMarks})">
                          <i class="fa-solid fa-pen-to-square"></i>
                        </button>
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

    container.innerHTML = html;
  },

  openEditNbaModal(id, name, maxMarks, currentMarks) {
    App.openModal('modalEditNba');
    document.getElementById('editNbaCritId').value = id;
    document.getElementById('editNbaCritName').innerText = `Criterion ${id}: ${name}`;
    document.getElementById('editNbaMaxMarks').innerText = maxMarks;
    document.getElementById('editNbaObtained').max = maxMarks;
    document.getElementById('editNbaObtained').value = currentMarks;
  },

  // 9. KPI Monitoring Module
  renderKpis(containerId) {
    const kpis = window.vceDB.getDynamicKpis();
    const logs = window.vceDB.getAuditLogs();
    const faculties = window.vceDB.getFacultyProfiles();
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
      <div class="module-header">
        <div>
          <h2 class="module-title"><i class="fa-solid fa-chart-line text-maroon"></i> Department KPI Monitoring & Governance</h2>
          <p class="module-subtitle">Dynamic Metrics, Faculty Appraisal Distribution & Audit Logs</p>
        </div>
        <div class="module-actions">
          <button class="btn btn-primary" onclick="App.generateOfficialDossier()">
            <i class="fa-solid fa-print"></i> Print Full Dossier
          </button>
        </div>
      </div>

      <div class="grid grid-4 mb-6">
        <div class="stat-card glass-card">
          <div class="stat-icon bg-green-light text-green"><i class="fa-solid fa-heart-pulse"></i></div>
          <div class="stat-details">
            <span class="stat-value font-mono">${kpis.departmentHealthScore}/100</span>
            <span class="stat-label">Health Score</span>
          </div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon bg-maroon-light text-maroon"><i class="fa-solid fa-users"></i></div>
          <div class="stat-details">
            <span class="stat-value">${kpis.registeredFaculties} Staff</span>
            <span class="stat-label">Registered Staff</span>
          </div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon bg-blue-light text-blue"><i class="fa-solid fa-book-bookmark"></i></div>
          <div class="stat-details">
            <span class="stat-value">${kpis.totalPublications} Papers</span>
            <span class="stat-label">Publications Logged</span>
          </div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon bg-amber-light text-amber"><i class="fa-solid fa-indian-rupee-sign"></i></div>
          <div class="stat-details">
            <span class="stat-value font-mono">${kpis.totalGrantsAmount}</span>
            <span class="stat-label">Total R&D Funding</span>
          </div>
        </div>
      </div>

      <div class="grid grid-2 mb-6">
        <div class="glass-card p-4">
          <h3 class="font-bold text-slate-800 mb-3"><i class="fa-solid fa-ranking-star text-maroon"></i> Faculty API Appraisal Leaderboard</h3>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Faculty Member</th>
                  <th>Designation</th>
                  <th>API Score</th>
                  <th>Appraisal %</th>
                </tr>
              </thead>
              <tbody>
                ${faculties.length === 0 ? '<tr><td colspan="4" class="text-center text-muted p-4">No faculties registered yet.</td></tr>' : ''}
                ${faculties.map(f => `
                  <tr>
                    <td class="font-semibold text-slate-900">${f.name}</td>
                    <td class="text-xs text-muted">${f.designation}</td>
                    <td><span class="badge badge-purple font-mono font-bold">${f.apiScore}</span></td>
                    <td><span class="badge badge-success font-mono font-bold">${f.appraisalScore}%</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="glass-card p-4">
          <h3 class="font-bold text-slate-800 mb-3"><i class="fa-solid fa-clock-rotate-left text-maroon"></i> System Audit & Governance Logs</h3>
          <div class="audit-timeline">
            ${logs.length === 0 ? '<div class="text-muted text-xs p-3">No actions logged yet. Actions will automatically appear here as users interact.</div>' : ''}
            ${logs.slice(0, 8).map(log => `
              <div class="audit-item">
                <div class="audit-dot"></div>
                <div class="audit-content">
                  <div class="audit-header">
                    <span class="audit-user">${log.user}</span>
                    <span class="audit-time font-mono">${log.timestamp}</span>
                  </div>
                  <div class="audit-action">${log.action}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }
};

window.Modules = Modules;
