const fs = require('fs');

if (fs.existsSync('warden-dashboard.html')) {
    let content = fs.readFileSync('warden-dashboard.html', 'utf8');

    // 1. HTML: Add IDs to the trends
    content = content.replace(
        /<i class="fas fa-arrow-up"><\/i>\s*\+12 this month/,
        '<span id="studentTrend"><i class="fas fa-arrow-up"></i> +0 this month</span>'
    );

    content = content.replace(
        /<i class="fas fa-exclamation-circle"><\/i>\s*3 urgent/,
        '<span id="maintTrend"><i class="fas fa-exclamation-circle"></i> 0 urgent</span>'
    );

    // 2. Clear Room Occupancy Data
    const roomOccRegex = /<div class="room-occupancy">[\s\S]*?<\/div>\s*<\/div>\s*<!-- Quick Actions -->/;
    const emptyRoomOcc = `<div class="room-occupancy" id="roomOccupancyContainer">
                        <div style="text-align: center; padding: 30px; color: #666; font-style: italic;">
                            <i class="fas fa-database" style="display: block; font-size: 24px; margin-bottom: 10px; color: #ccc;"></i>
                            Real-time room data will be synced from GMI Hostel database soon.
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->`;
    content = content.replace(roomOccRegex, emptyRoomOcc);

    // 3. Logic: Update loadWardenDashboardData to calculate these
    // For students this month:
    const appsLoopRegex = /if \(data\.userEmail\) {\s*studentSet\.add\(data\.userEmail\);\s*}/;
    const appsLoopReplacement = `if (data.userEmail) {
                    studentSet.add(data.userEmail);
                }
                
                // Check if this month
                if (data.timestamp) {
                    const date = data.timestamp.toDate();
                    const now = new Date();
                    if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
                        studentsThisMonth.add(data.userEmail);
                    }
                }`;
    
    // Inject the new Set definition
    if (!content.includes('studentsThisMonth')) {
        content = content.replace('let studentSet = new Set();', 'let studentSet = new Set();\n            let studentsThisMonth = new Set();');
        content = content.replace(appsLoopRegex, appsLoopReplacement);
        
        // Inject the update to the DOM
        content = content.replace(
            "document.getElementById('totalStudents').textContent = studentSet.size > 0 ? studentSet.size : '-';",
            `document.getElementById('totalStudents').textContent = studentSet.size > 0 ? studentSet.size : '-';
            const sTrend = document.getElementById('studentTrend');
            if (sTrend) sTrend.innerHTML = '<i class="fas fa-arrow-up"></i> +' + studentsThisMonth.size + ' this month';`
        );
    }

    // For maintenance urgent:
    const maintLoopRegex = /\/\/ Assuming everything is pending unless marked resolved \(which we don't have yet\)\s*maintCount\+\+;/;
    const maintLoopReplacement = `maintCount++;
                let pClass = 'priority-low';
                if (data.issueType && (data.issueType.includes('Electrical') || data.issueType.includes('Plumbing'))) pClass = 'priority-high';
                else if (data.issueType && data.issueType.includes('AC')) pClass = 'priority-medium';
                
                if (pClass === 'priority-high' || pClass === 'priority-medium') {
                    urgentMaintCount++;
                }`;

    if (!content.includes('urgentMaintCount')) {
        content = content.replace('let maintCount = 0;', 'let maintCount = 0;\n            let urgentMaintCount = 0;');
        content = content.replace(maintLoopRegex, maintLoopReplacement);
        
        // Inject the update to the DOM
        content = content.replace(
            "document.getElementById('maintenanceReq').textContent = maintCount;",
            `document.getElementById('maintenanceReq').textContent = maintCount;
            const mTrend = document.getElementById('maintTrend');
            if (mTrend) mTrend.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + urgentMaintCount + ' urgent';`
        );
    }

    fs.writeFileSync('warden-dashboard.html', content);
    console.log("warden-dashboard.html updated with dynamic trends!");
}
