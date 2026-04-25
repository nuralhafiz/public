const fs = require('fs');

const wardenPages = [
    'warden-dashboard.html',
    'warden-applications.html',
    'warden-rooms.html',
    'warden-maintenance.html',
    'warden-moveout.html',
    'warden-students.html',
    'warden-reports.html'
];

for (const file of wardenPages) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        if (!content.includes('My Profile')) {
            content = content.replace(/<div class="nav-menu">\s*/, '<div class="nav-menu">\n                <a href="warden-profile.html" class="nav-item"><i class="fas fa-user"></i> My Profile</a>\n                ');
            fs.writeFileSync(file, content);
        }
    }
}

console.log("Warden sidebar updated with My Profile link!");
