const fs = require('fs');

let content = fs.readFileSync('c:\\Users\\Al Hafiz\\public\\warden-dashboard.html', 'utf8');

// 1. Add JS functions
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
                        <button class="save-btn" style="background:#e74c3c; flex:1; border:none; padding:10px; border-radius:5px; color:white; font-weight:bold; cursor:pointer;" onclick="updateApplicationStatus('\${appId}', 'rejected', '\${app.userEmail}')">Reject</button>
                        <button class="save-btn" style="background:#2ecc71; flex:1; border:none; padding:10px; border-radius:5px; color:white; font-weight:bold; cursor:pointer;" onclick="updateApplicationStatus('\${appId}', 'approved', '\${app.userEmail}')">Approve</button>
                    \`;
                } else {
                    actions.innerHTML = \`
                        <button class="save-btn" style="background:#ccc; flex:1; border:none; padding:10px; border-radius:5px; color:#333; font-weight:bold; cursor:pointer;" onclick="document.getElementById('appModal').classList.remove('active')">Close</button>
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
                window.location.reload(); 
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
    const searchStr = 'import { collection, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";';
    content = content.replace(searchStr, searchStr + '\\n' + jsToInsert);
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
    content = content.replace('</main>\\n</div>\\n\\n<script type="module">', '</main>\\n' + modalHtml + '\\n</div>\\n\\n<script type="module">');
}

fs.writeFileSync('c:\\Users\\Al Hafiz\\public\\warden-dashboard.html', content);
console.log('Modified warden-dashboard.html successfully!');
