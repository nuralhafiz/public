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
    'warden-reports.html',
    'register.html'
];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Move dot up to -0.22em and slightly adjust horizontal center to 48% to fix kerning offset
        content = content.replace(/\.brand-dot\s*{\s*position:\s*absolute;\s*top:\s*[-.\w]+;\s*left:\s*50%;/g, 
            '.brand-dot {\n            position: absolute;\n            top: -0.22em;\n            left: 47%;');

        fs.writeFileSync(file, content);
    }
}

console.log("Red dot adjusted vertically and horizontally!");
