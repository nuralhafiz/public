const fs = require('fs');

if (fs.existsSync('warden-dashboard.html')) {
    let content = fs.readFileSync('warden-dashboard.html', 'utf8');

    // 1. Clear Recent Applications Table
    const appsTableRegex = /<tbody id="applicationsTable">[\s\S]*?<\/tbody>/;
    const emptyAppsTable = `<tbody id="applicationsTable">
                            <tr id="appsLoading">
                                <td colspan="6" style="text-align: center; padding: 30px;">
                                    <i class="fas fa-spinner fa-spin"></i> Loading applications...
                                </td>
                            </tr>
                        </tbody>`;
    content = content.replace(appsTableRegex, emptyAppsTable);

    // 2. Clear Maintenance List
    const maintListRegex = /<ul class="maintenance-list" id="maintenanceList">[\s\S]*?<\/ul>/;
    const emptyMaintList = `<ul class="maintenance-list" id="maintenanceList">
                        <li style="text-align: center; padding: 20px; list-style: none;">
                            <i class="fas fa-spinner fa-spin"></i> Loading...
                        </li>
                    </ul>`;
    content = content.replace(maintListRegex, emptyMaintList);

    // 3. Mark Room Occupancy as Dummy
    content = content.replace(/<h3>\s*<i class="fas fa-bed"><\/i>\s*Room Occupancy\s*<\/h3>/, `<h3>
                            <i class="fas fa-bed"></i>
                            Room Occupancy <span style="font-size:10px; color:#999; font-weight:normal;">(Demo)</span>
                        </h3>`);

    // 4. Update action button functions (cosmetic)
    const alertScript = `
        window.viewApplication = function(id) { alert('Fungsi View untuk ' + id + ' akan datang!'); }
        window.approveApplication = function(id) { alert('Fungsi Approve ' + id + ' akan diintegrasi pada fasa seterusnya.'); }
        window.rejectApplication = function(id) { alert('Fungsi Reject ' + id + ' akan diintegrasi pada fasa seterusnya.'); }
    `;
    
    if (!content.includes('window.viewApplication = function')) {
        content = content.replace('const menuOverlay = document.getElementById(\'menuOverlay\');', 'const menuOverlay = document.getElementById(\'menuOverlay\');\n' + alertScript);
    }

    // 5. Inject Firestore imports
    if (!content.includes('firebase-firestore.js')) {
        content = content.replace(
            /import\s*\{\s*auth,\s*db\s*\}\s*from\s*"([^"]+firebase-config\.js)";/,
            `import { auth, db } from "$1";\n    import { collection, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";`
        );
    }

    // 6. Inject loadWardenDashboardData
    const logicBlock = `
    async function loadWardenDashboardData() {
        try {
            // -- Applications Fetch --
            const appsRef = collection(db, "applications");
            // Sorting by timestamp might fail if index is missing, so we fetch all and sort in JS
            const appsSnap = await getDocs(appsRef);
            
            let applications = [];
            let pendingAppsCount = 0;
            // Also we can count unique student emails as total students approximation
            let studentSet = new Set();
            
            appsSnap.forEach(doc => {
                const data = doc.data();
                data.id = doc.id;
                applications.push(data);
                
                if (data.status === 'pending' || !data.status) {
                    pendingAppsCount++;
                }
                if (data.userEmail) {
                    studentSet.add(data.userEmail);
                }
            });
            
            // Update Stats
            document.getElementById('pendingApps').textContent = pendingAppsCount;
            document.getElementById('totalStudents').textContent = studentSet.size > 0 ? studentSet.size : '-';
            document.getElementById('availableRooms').textContent = '-'; // No real room DB yet

            // Sort applications by date descending
            applications.sort((a, b) => {
                const timeA = a.timestamp ? a.timestamp.toMillis() : 0;
                const timeB = b.timestamp ? b.timestamp.toMillis() : 0;
                return timeB - timeA;
            });
            
            // Render top 5 recent applications
            const appsTable = document.getElementById('applicationsTable');
            if (applications.length === 0) {
                appsTable.innerHTML = '<tr><td colspan="6" style="text-align:center;">No applications found</td></tr>';
            } else {
                let appsHtml = '';
                applications.slice(0, 5).forEach(app => {
                    const status = app.status || 'pending';
                    const statusClass = status === 'approved' ? 'status-approved' : (status === 'rejected' ? 'status-rejected' : 'status-pending');
                    const dateStr = app.timestamp ? app.timestamp.toDate().toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
                    const studentName = app.userEmail ? app.userEmail.split('@')[0] : 'Unknown';
                    const roomType = app.roomType || 'Standard';
                    
                    appsHtml += \`
                        <tr>
                            <td style="text-transform: capitalize;">\${studentName}</td>
                            <td>\${app.id.substring(0, 6).toUpperCase()}</td>
                            <td style="text-transform: capitalize;">\${roomType}</td>
                            <td>\${dateStr}</td>
                            <td><span class="status-badge \${statusClass}" style="text-transform: capitalize;">\${status}</span></td>
                            <td>
                                <button class="action-btn action-view" onclick="viewApplication('\${app.id}')" title="View">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="action-btn action-approve" onclick="approveApplication('\${app.id}')" title="Approve">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="action-btn action-reject" onclick="rejectApplication('\${app.id}')" title="Reject">
                                    <i class="fas fa-times"></i>
                                </button>
                            </td>
                        </tr>\`;
                });
                appsTable.innerHTML = appsHtml;
            }

            // -- Maintenance Fetch --
            const maintRef = collection(db, "maintenance_requests");
            const maintSnap = await getDocs(maintRef);
            
            let maintenanceReqs = [];
            let maintCount = 0;
            
            maintSnap.forEach(doc => {
                const data = doc.data();
                data.id = doc.id;
                maintenanceReqs.push(data);
                
                // Assuming everything is pending unless marked resolved (which we don't have yet)
                maintCount++;
            });
            
            document.getElementById('maintenanceReq').textContent = maintCount;
            
            // Sort
            maintenanceReqs.sort((a, b) => {
                const timeA = a.timestamp ? a.timestamp.toMillis() : 0;
                const timeB = b.timestamp ? b.timestamp.toMillis() : 0;
                return timeB - timeA;
            });
            
            // Render top 3 recent maintenance
            const maintList = document.getElementById('maintenanceList');
            if (maintenanceReqs.length === 0) {
                maintList.innerHTML = '<li style="text-align: center; padding: 20px;">No maintenance requested</li>';
            } else {
                let maintHtml = '';
                maintenanceReqs.slice(0, 3).forEach(req => {
                    const studentName = req.userEmail ? req.userEmail.split('@')[0] : 'Student';
                    // Determine priority based on type (demo logic)
                    let pClass = 'priority-low';
                    if (req.issueType && (req.issueType.includes('Electrical') || req.issueType.includes('Plumbing'))) pClass = 'priority-high';
                    else if (req.issueType && req.issueType.includes('AC')) pClass = 'priority-medium';
                    
                    const issueName = req.issueType || 'General Issue';
                    const timeStr = req.timestamp ? req.timestamp.toDate().toLocaleString('en-MY', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-';
                    
                    maintHtml += \`
                    <li class="maintenance-item">
                        <span class="maintenance-priority \${pClass}"></span>
                        <div class="maintenance-details">
                            <div class="maintenance-title" style="text-transform: capitalize;">\${issueName}</div>
                            <div class="maintenance-meta">Reported by: \${studentName} • \${timeStr}</div>
                        </div>
                    </li>\`;
                });
                maintList.innerHTML = maintHtml;
            }

        } catch (error) {
            console.error("Error loading dashboard data:", error);
            document.getElementById('applicationsTable').innerHTML = '<tr><td colspan="6" style="text-align:center;color:red;">Error loading data</td></tr>';
            document.getElementById('maintenanceList').innerHTML = '<li style="text-align:center;color:red;">Error loading data</li>';
        }
    }
    `;

    if (!content.includes('async function loadWardenDashboardData')) {
        content = content.replace('window.addEventListener(\'resize\', () => {', logicBlock + '\n\n    window.addEventListener(\'resize\', () => {');
    }

    // 7. Inject function call in onAuthStateChanged
    const originalLogicRegex = /if\s*\(\s*user\s*\)\s*\{\s*\/\/\s*Display\s*user\s*info/;
    if (content.match(originalLogicRegex) && !content.includes('loadWardenDashboardData();')) {
        content = content.replace(originalLogicRegex, `if (user) {
                // Load live data
                loadWardenDashboardData();
                
                // Display user info`);
    }

    fs.writeFileSync('warden-dashboard.html', content);
    console.log("warden-dashboard.html updated with dynamic Warden Dashboard logic!");
}
