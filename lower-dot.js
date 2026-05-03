const fs = require('fs');

const files = [
    'index.html',
    'student-login.html',
    'warden-login.html',
    'student-dashboard.html',
    'room-apply.html',
    'maintenance.html',
    'move-out.html',
    'student-profile.html',
    'warden-dashboard.html',
    'warden-applications.html',
    'warden-rooms.html',
    'warden-maintenance.html',
    'warden-moveout.html',
    'warden-students.html',
    'warden-reports.html'
];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Lower the red dot by changing top: -0.18em to top: -0.10em
        content = content.replace(/\.brand-dot\s*{\s*position:\s*absolute;\s*top:\s*-0\.18em;/, 
            '.brand-dot {\n            position: absolute;\n            top: -0.10em;');

        fs.writeFileSync(file, content);
    }
}

console.log("Red dot lowered!");
