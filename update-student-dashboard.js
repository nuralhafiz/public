const fs = require('fs');

if (fs.existsSync('student-dashboard.html')) {
    let content = fs.readFileSync('student-dashboard.html', 'utf8');

    // 1. Clear Alerts & Reminders
    const alertsRegex = /<section class="card-section">\s*<h2>\s*<i class="fas fa-bell"><\/i>\s*Alerts & Reminders\s*<\/h2>[\s\S]*?<\/section>/;
    
    const newAlerts = `<section class="card-section">
            <h2>
                <i class="fas fa-bell"></i>
                Alerts & Reminders
            </h2>
            <div class="alert-item info" style="justify-content: center; opacity: 0.7; padding: 25px;">
                <i class="fas fa-check-circle" style="color: #4caf50;"></i>
                <div>
                    <strong>You're all caught up!</strong> No new alerts at this moment.
                </div>
            </div>
        </section>`;
        
    content = content.replace(alertsRegex, newAlerts);

    // 2. Clear Recent Activity
    const activityRegex = /<section class="card-section">\s*<h2>\s*<i class="fas fa-history"><\/i>\s*Recent Activity\s*<\/h2>[\s\S]*?<\/section>/;
    
    const newActivity = `<section class="card-section">
            <h2>
                <i class="fas fa-history"></i>
                Recent Activity
            </h2>
            <div id="activityContainer">
                <div style="text-align: center; padding: 30px; color: #666;">
                    <i class="fas fa-spinner fa-spin"></i> Loading recent activity...
                </div>
            </div>
        </section>`;
        
    content = content.replace(activityRegex, newActivity);

    // 3. Add Firestore imports
    if (!content.includes('firebase-firestore.js')) {
        content = content.replace(
            /import\s*\{\s*auth,\s*db\s*\}\s*from\s*"([^"]+firebase-config\.js)";/,
            `import { auth, db } from "$1";\n    import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";`
        );
    }

    // 4. Add loadRecentActivity logic inside the <script> block, right after closeSidebar functions
    const logicBlock = `
    async function loadRecentActivity(email) {
        const activityContainer = document.getElementById('activityContainer');
        let activities = [];

        try {
            // Fetch Applications
            const appQuery = query(collection(db, "applications"), where("userEmail", "==", email));
            const appSnap = await getDocs(appQuery);
            appSnap.forEach(doc => {
                const data = doc.data();
                activities.push({
                    title: "Room application submitted",
                    time: data.timestamp ? data.timestamp.toDate() : new Date(),
                    icon: "fa-bed",
                    type: "info"
                });
            });

            // Fetch Maintenance
            const maintQuery = query(collection(db, "maintenance_requests"), where("userEmail", "==", email));
            const maintSnap = await getDocs(maintQuery);
            maintSnap.forEach(doc => {
                const data = doc.data();
                activities.push({
                    title: "Maintenance request: " + data.issueType,
                    time: data.timestamp ? data.timestamp.toDate() : new Date(),
                    icon: "fa-tools",
                    type: "warning"
                });
            });

            // Fetch Move-Out
            const moveOutQuery = query(collection(db, "moveout_requests"), where("userEmail", "==", email));
            const moveOutSnap = await getDocs(moveOutQuery);
            moveOutSnap.forEach(doc => {
                const data = doc.data();
                activities.push({
                    title: "Move-out request submitted",
                    time: data.timestamp ? data.timestamp.toDate() : new Date(),
                    icon: "fa-box-open",
                    type: "danger"
                });
            });

            // Sort descending
            activities.sort((a, b) => b.time - a.time);

            // Render
            if (activities.length === 0) {
                activityContainer.innerHTML = \`<div style="text-align: center; padding: 30px; color: #666;">
                    No recent activity found.
                </div>\`;
                return;
            }

            let html = '';
            // Show only latest 5
            const latestActivities = activities.slice(0, 5);
            
            latestActivities.forEach(item => {
                // Time formatter
                const diffTime = Math.abs(new Date() - item.time);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
                
                let timeString = '';
                if (diffDays > 0) timeString = diffDays + (diffDays === 1 ? ' day ago' : ' days ago');
                else if (diffHours > 0) timeString = diffHours + (diffHours === 1 ? ' hour ago' : ' hours ago');
                else timeString = 'Just now';

                html += \`
                <div class="activity-item">
                    <div class="activity-icon \${item.type}">
                        <i class="fas \${item.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">\${item.title}</div>
                        <div class="activity-time">
                            <i class="fas fa-clock"></i> \${timeString}
                        </div>
                    </div>
                </div>\`;
            });

            activityContainer.innerHTML = html;

        } catch (error) {
            console.error("Error fetching activities:", error);
            activityContainer.innerHTML = \`<div style="text-align: center; padding: 30px; color: #f44336;">
                    Failed to load activities.
                </div>\`;
        }
    }
    `;

    if (!content.includes('async function loadRecentActivity')) {
        content = content.replace('window.addEventListener(\'resize\', () => {', logicBlock + '\n\n    window.addEventListener(\'resize\', () => {');
    }

    // 5. Call loadRecentActivity inside onAuthStateChanged
    // There are multiple if(user) in this block due to RBAC patch. The second one is the original logic.
    const originalLogicRegex = /if\s*\(\s*user\s*\)\s*\{\s*\/\/\s*Store\s*user\s*email\s*in\s*session\s*storage/;
    if (content.match(originalLogicRegex) && !content.includes('loadRecentActivity(user.email);')) {
        content = content.replace(originalLogicRegex, `if (user) {
            // Load activities dynamically
            loadRecentActivity(user.email);
            
            // Store user email in session storage`);
    }

    fs.writeFileSync('student-dashboard.html', content);
    console.log("student-dashboard.html updated with dynamic Recent Activity logic!");
}
