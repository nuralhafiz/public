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

const unifiedCss = `
    <style id="unified-logo-style">
        .gmi-wrapper {
            position: relative;
            display: inline-block;
            line-height: 1;
            padding-right: 0.05em; /* Padding for the wrapper */
        }
        .brand-blue {
            color: #1118a8; /* Deep blue from image */
            font-weight: 900;
            font-family: 'Arial', sans-serif;
            letter-spacing: -1px;
            text-shadow: 
                -0.8px -0.8px 0 #fff, 0px -0.8px 0 #fff, 0.8px -0.8px 0 #fff, 0.8px 0px 0 #fff, 0.8px 0.8px 0 #fff, 0px 0.8px 0 #fff, -0.8px 0.8px 0 #fff, -0.8px 0px 0 #fff, 0 4px 6px rgba(0,0,0,0.3);
        }
        .brand-dot {
            position: absolute;
            top: -0.18em;
            right: -0.02em; /* Shifted to perfectly align over the I */
            width: 0.32em;
            height: 0.32em;
            background-color: #f93144; /* Red dot from image */
            border-radius: 50%;
            box-shadow: 0 0 0 0.8px #fff, 0 4px 6px rgba(0,0,0,0.3);
        }
        .brand-lime {
            color: #ccff00;
            margin-left: 5px;
            font-family: 'Poppins', sans-serif;
            font-weight: 800;
            text-shadow: 
                -0.8px -0.8px 0 #fff, 0px -0.8px 0 #fff, 0.8px -0.8px 0 #fff, 0.8px 0px 0 #fff, 0.8px 0.8px 0 #fff, 0px 0.8px 0 #fff, -0.8px 0.8px 0 #fff, -0.8px 0px 0 #fff, 0 4px 6px rgba(0,0,0,0.3);
        }
        /* Increased font size for dashboards */
        .brand-container {
            font-size: 32px !important;
        }
    </style>
`;

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Replace the unified CSS block
        if (content.includes('id="unified-logo-style"')) {
            content = content.replace(/<style id="unified-logo-style">[\s\S]*?<\/style>/, unifiedCss.trim());
        }

        fs.writeFileSync(file, content);
    }
}

console.log("Unified logo outline thinned and dot alignment fixed!");
