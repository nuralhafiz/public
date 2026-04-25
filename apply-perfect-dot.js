const fs = require('fs');

const files = [
    'index.html',
    'student-login.html',
    'warden-login.html',
    'student-dashboard.html',
    'room-apply.html',
    'maintenance.html',
    'move-out.html',
    'student-profile.html', // although already manually edited, doing it again is safe
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

        // Regex to find the .brand-dot block inside the unified-logo-style
        const dotRegex = /\.brand-dot\s*\{[\s\S]*?box-shadow:[^}]+\}/;
        
        const newDotCss = `.brand-dot {
            position: absolute;
            top: -0.24em;
            right: 0.05em;
            /* Shifted to perfectly align over the I */
            width: 0.32em;
            height: 0.32em;
            background-color: #f93144;
            /* Red dot from image */
            border-radius: 50%;
            box-shadow: 0 0 0 0.8px #fff, 0 4px 6px rgba(0, 0, 0, 0.3);
        }`;

        content = content.replace(dotRegex, newDotCss);

        fs.writeFileSync(file, content);
    }
}

console.log("Perfect dot alignment applied to all pages!");
