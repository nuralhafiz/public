const fs = require('fs');

let content = fs.readFileSync('c:\\Users\\Al Hafiz\\public\\warden-dashboard.html', 'utf8');

// 1. Add CSS for modal
const cssToInsert = `
    /* Modal Styling */
    .profile-modal {
        display: none;
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s;
    }
    .profile-modal.active {
        display: flex;
        opacity: 1;
    }
    .modal-content {
        background: white;
        border-radius: 15px;
        width: 90%;
        max-width: 500px;
        padding: 25px;
        transform: translateY(20px);
        transition: transform 0.3s;
    }
    .profile-modal.active .modal-content {
        transform: translateY(0);
    }
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
    }
    .close-modal {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
    }
    .modal-detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #f5f5f5;
    }
    .modal-detail-label {
        font-weight: 500;
        color: #666;
    }
    .modal-detail-value {
        font-weight: 600;
        color: #0f1638;
    }
    .modal-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
        justify-content: flex-end;
    }
`;

if (!content.includes('.profile-modal {')) {
    content = content.replace('</style>', cssToInsert + '\n</style>');
}

// 2. Add Modal HTML before `<script type="module">`
const modalHtml = `
    <!-- View Application Modal -->
    <div class="profile-modal" id="appModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 style="margin:0; color:#0f1638;">Application Details</h3>
                <button class="close-modal" onclick="document.getElementById('appModal').classList.remove('active')"><i class="fas fa-times"></i></button>
            </div>
            <div id="appModalBody">
                <!-- Content injected via JS -->
            </div>
            <div class="modal-actions" id="appModalActions">
                <!-- Buttons injected via JS -->
            </div>
        </div>
    </div>
`;

if (!content.includes('id="appModal"')) {
    content = content.replace('</main>', '</main>\n' + modalHtml);
}

// 3. Add global JS functions `viewApplication` and `updateApplicationStatus`
const jsToInsert = `
    import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
    
    window.viewApplication = async (appId) => {
        const modal = document.getElementById('appModal');
        const body = document.getElementById('appModalBody');
        const actions = document.getElementById('appModalActions');
        
        body.innerHTML = '<div style="text-align:center"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
        actions.innerHTML = '';
        modal.classList.add('active');
        
        try {
            const appRef = doc(db, "applications", appId);
            const appSnap = await getDoc(appRef);
            
            if (appSnap.exists()) {
                const app = appSnap.data();
                const statusClass = app.status === 'approved' ? 'status-approved' : (app.status === 'rejected' ? 'status-rejected' : 'status-pending');
                const dateStr = app.timestamp ? app.timestamp.toDate().toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' }) : '-';
                
                body.innerHTML = \`
                    <div class="modal-detail-row">
                        <span class="modal-detail-label">Application ID</span>
                        <span class="modal-detail-value">\${appId.substring(0,8).toUpperCase()}</span>
                    </div>
                    <div class="modal-detail-row">
                        <span class="modal-detail-label">Student Email</span>
                        <span class="modal-detail-value">\${app.userEmail}</span>
                    </div>
                    <div class="modal-detail-row">
                        <span class="modal-detail-label">Room Type</span>
                        <span class="modal-detail-value" style="text-transform: capitalize;">\${app.roomType}</span>
                    </div>
                    <div class="modal-detail-row">
                        <span class="modal-detail-label">Date Applied</span>
                        <span class="modal-detail-value">\${dateStr}</span>
                    </div>
                    <div class="modal-detail-row">
                        <span class="modal-detail-label">Status</span>
                        <span class="modal-detail-value status-badge \${statusClass}" style="text-transform: capitalize;">\${app.status || 'pending'}</span>
                    </div>
                \`;
                
                if (!app.status || app.status === 'pending') {
                    actions.innerHTML = \`
                        <button class="save-btn" style="background:#e74c3c; flex:1;" onclick="updateApplicationStatus('\${appId}', 'rejected', '\${app.userEmail}')">Reject</button>
                        <button class="save-btn" style="background:#2ecc71; flex:1;" onclick="updateApplicationStatus('\${appId}', 'approved', '\${app.userEmail}')">Approve</button>
                    \`;
                } else {
                    actions.innerHTML = \`
                        <button class="save-btn" style="background:#ccc; flex:1;" onclick="document.getElementById('appModal').classList.remove('active')">Close</button>
                    \`;
                }
            }
        } catch (e) {
            body.innerHTML = '<div style="color:red; text-align:center;">Error loading details</div>';
        }
    };

    window.updateApplicationStatus = async (appId, newStatus, userEmail = null) => {
        if (!confirm('Are you sure you want to ' + newStatus + ' this application?')) return;
        
        try {
            const appRef = doc(db, "applications", appId);
            
            if (!userEmail) {
                const appSnap = await getDoc(appRef);
                if (appSnap.exists()) {
                    userEmail = appSnap.data().userEmail;
                }
            }

            await updateDoc(appRef, {
                status: newStatus,
                updatedAt: new Date()
            });
            
            document.getElementById('appModal').classList.remove('active');
            
            // Reload the table using existing fetch logic
            const tableBody = document.getElementById('applicationsTable');
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Refreshing...</td></tr>';
            setTimeout(() => {
                window.location.reload(); // Simple way to refresh data
            }, 1000);
            
            // Trigger Email Notification using Mailto
            if (userEmail) {
                const subject = encodeURIComponent("GMI HostelKu Application Status Update");
                let bodyText = "Dear Student,\\n\\nYour hostel application (ID: " + appId.substring(0,8).toUpperCase() + ") has been " + newStatus.toUpperCase() + ".\\n\\n";
                if (newStatus === 'approved') {
                    bodyText += "Congratulations! Please log in to the GMI HostelKu portal for further instructions regarding your room allocation and move-in process.\\n\\n";
                } else {
                    bodyText += "Unfortunately, we are unable to process your application at this time. Please contact the warden office for more information.\\n\\n";
                }
                bodyText += "Regards,\\nWarden Management,\\nGMI HostelKu";
                
                const bodyMsg = encodeURIComponent(bodyText);
                window.open('mailto:' + userEmail + '?subject=' + subject + '&body=' + bodyMsg, '_blank');
            } else {
                alert('Application ' + newStatus + ' successfully!');
            }
            
        } catch (e) {
            console.error(e);
            alert("Error updating status: " + e.message);
        }
    };
`;

if (!content.includes('window.viewApplication')) {
    content = content.replace('import { auth, db } from "./js/firebase-config.js";', 'import { auth, db } from "./js/firebase-config.js";\n' + jsToInsert);
}

// Fix the onclick in the table generation to pass userEmail:
content = content.replace(/onclick="updateApplicationStatus\('\\$\{app\.id\}', 'approved'\)"/g, 'onclick="updateApplicationStatus(\\'${app.id}\\', \\'approved\\', \\'${app.userEmail}\\')"');
content = content.replace(/onclick="updateApplicationStatus\('\\$\{app\.id\}', 'rejected'\)"/g, 'onclick="updateApplicationStatus(\\'${app.id}\\', \\'rejected\\', \\'${app.userEmail}\\')"');


fs.writeFileSync('c:\\Users\\Al Hafiz\\public\\warden-dashboard.html', content);
console.log('Modified warden-dashboard.html');
