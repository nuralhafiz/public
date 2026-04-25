const fs = require('fs');

// 1. Clean student-profile.html
if (fs.existsSync('student-profile.html')) {
    let studentContent = fs.readFileSync('student-profile.html', 'utf8');

    // Remove the HTML blocks for ID, Phone, Room, Joined
    studentContent = studentContent.replace(/<div class="detail-item">\s*<i class="fas fa-id-card"><\/i>[\s\S]*?<\/div>/g, '');
    studentContent = studentContent.replace(/<div class="detail-item">\s*<i class="fas fa-phone"><\/i>[\s\S]*?<\/div>/g, '');
    studentContent = studentContent.replace(/<div class="detail-item">\s*<i class="fas fa-map-marker-alt"><\/i>[\s\S]*?<\/div>/g, '');
    studentContent = studentContent.replace(/<div class="detail-item">\s*<i class="fas fa-calendar-alt"><\/i>[\s\S]*?<\/div>/g, '');

    fs.writeFileSync('student-profile.html', studentContent);
    console.log("Mock data completely removed from student profile.");

    // 2. Create warden-profile.html based on the cleaned student profile
    let wardenContent = studentContent;

    // Change Title
    wardenContent = wardenContent.replace(/<title>Student Profile.*?<\/title>/, '<title>Warden Profile - GMI HostelKu</title>');

    // Change header link from student-profile.html to warden-profile.html
    wardenContent = wardenContent.replace(/href="student-profile\.html"/g, 'href="warden-profile.html"');

    // Change profile role text
    wardenContent = wardenContent.replace(/Student\s*<span class="status-badge">Active<\/span>/, 'Warden\n                        <span class="status-badge" style="background: #e3f2fd; color: #1e3a8a;">Active</span>');

    // Extract warden sidebar from warden-dashboard.html to replace student sidebar
    if (fs.existsSync('warden-dashboard.html')) {
        const dashboardContent = fs.readFileSync('warden-dashboard.html', 'utf8');
        const sidebarMatch = dashboardContent.match(/<nav id="sidebar">[\s\S]*?<\/nav>/);
        if (sidebarMatch) {
            // Replace student sidebar with warden sidebar
            wardenContent = wardenContent.replace(/<nav id="sidebar">[\s\S]*?<\/nav>/, sidebarMatch[0]);
            
            // Fix active class in warden sidebar
            wardenContent = wardenContent.replace(/class="nav-item active"/g, 'class="nav-item"');
            // Assuming we added a Profile link in Warden Dashboard sidebar. If not, we just append it or set it active if it exists.
            // Let's add Profile link to Warden sidebar if it's missing, or make it active.
            if (!wardenContent.includes('My Profile')) {
                wardenContent = wardenContent.replace(/<div class="nav-menu">/, '<div class="nav-menu">\n            <a href="warden-profile.html" class="nav-item active"><i class="fas fa-user"></i> My Profile</a>');
            } else {
                wardenContent = wardenContent.replace(/<a href="warden-profile\.html" class="nav-item">/, '<a href="warden-profile.html" class="nav-item active">');
            }
        }
    }

    // Change RBAC logic inside onAuthStateChanged
    // Find the RBAC block injected earlier
    const rbacStudentRegex = /const isStudent = email\.endsWith\('@student\.gmi\.edu\.my'\);[\s\S]*?if \(!isStudent\) \{[\s\S]*?window\.location\.href = 'warden-dashboard\.html';[\s\S]*?return;[\s\S]*?\}/;
    
    const wardenRbac = `const isStudent = email.endsWith('@student.gmi.edu.my');
                
                if (isStudent) {
                    alert('🛡️ Access Denied: Student accounts cannot access Warden pages.');
                    window.location.href = 'student-dashboard.html';
                    return;
                }`;

    wardenContent = wardenContent.replace(rbacStudentRegex, wardenRbac);

    fs.writeFileSync('warden-profile.html', wardenContent);
    console.log("warden-profile.html created successfully.");
}
