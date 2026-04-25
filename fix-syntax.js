const fs = require('fs');

const pages = [
    'student-dashboard.html',
    'student-profile.html',
    'room-apply.html',
    'maintenance.html',
    'move-out.html',
    'warden-dashboard.html',
    'warden-applications.html',
    'warden-rooms.html',
    'warden-maintenance.html',
    'warden-moveout.html',
    'warden-students.html',
    'warden-reports.html',
    'warden-profile.html'
];

for (const file of pages) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Look for the missing brace condition
        if (content.includes('// RBAC PASS') && !content.includes('// RBAC PASS\n            }')) {
            content = content.replace(/\/\/\s*RBAC PASS\s*/, '// RBAC PASS\n            }\n            ');
            fs.writeFileSync(file, content);
            console.log("Fixed syntax in " + file);
        }
    }
}
