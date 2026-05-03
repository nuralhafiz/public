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

        // Change top: -0.10em to top: -0.15em to find the perfect middle ground
        content = content.replace(/\.brand-dot\s*{\s*position:\s*absolute;\s*top:\s*-0\.10em;/, 
            '.brand-dot {\n            position: absolute;\n            top: -0.15em;');

        fs.writeFileSync(file, content);
    }
}

console.log("Red dot adjusted to -0.15em!");
