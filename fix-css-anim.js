const fs = require('fs');

if (fs.existsSync('index.html')) {
    let content = fs.readFileSync('index.html', 'utf8');

    // 1. Fix header-overlay CSS so it can be animated properly
    const oldCSS = /\.header-overlay\s*{\s*position:\s*absolute;\s*top:\s*32px;\s*left:\s*0;\s*right:\s*0;\s*z-index:\s*30;\s*text-align:\s*center;\s*width:\s*100%;\s*pointer-events:\s*none;\s*}/;
    
    const newCSS = `.header-overlay {
            position: absolute;
            top: 80px;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 30;
            text-align: center;
            width: max-content;
            pointer-events: none;
        }`;

    content = content.replace(oldCSS, newCSS);

    fs.writeFileSync('index.html', content);
    console.log("Fixed header-overlay CSS in index.html");
}

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

        // Stealth fix the red dot to be slightly lower (-0.19em) and centered properly
        content = content.replace(/\.brand-dot\s*{\s*position:\s*absolute;\s*top:\s*-0\.22em;\s*left:\s*47%;/g, 
            '.brand-dot {\n            position: absolute;\n            top: -0.19em;\n            left: 48.5%;');

        fs.writeFileSync(file, content);
    }
}
console.log("Red dot adjusted!");

