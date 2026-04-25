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
            padding-right: 0.15em; /* Space for the dot */
        }
        .brand-blue {
            color: #1118a8; /* Deep blue from image */
            font-weight: 900;
            font-family: 'Arial', sans-serif;
            letter-spacing: -1px;
            text-shadow: 
                -1.5px -1.5px 0 #fff, 0px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, 1.5px 0px 0 #fff, 1.5px 1.5px 0 #fff, 0px 1.5px 0 #fff, -1.5px 1.5px 0 #fff, -1.5px 0px 0 #fff, 0 4px 6px rgba(0,0,0,0.3);
        }
        .brand-dot {
            position: absolute;
            top: -0.12em;
            right: 0;
            width: 0.3em;
            height: 0.3em;
            background-color: #f93144; /* Red dot from image */
            border-radius: 50%;
            box-shadow: 0 0 0 1.5px #fff, 0 4px 6px rgba(0,0,0,0.3);
        }
        .brand-lime {
            color: #ccff00;
            margin-left: 4px;
            font-family: 'Poppins', sans-serif;
            font-weight: 800;
            text-shadow: 
                -1.5px -1.5px 0 #fff, 0px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, 1.5px 0px 0 #fff, 1.5px 1.5px 0 #fff, 0px 1.5px 0 #fff, -1.5px 1.5px 0 #fff, -1.5px 0px 0 #fff, 0 4px 6px rgba(0,0,0,0.3);
        }
    </style>
`;

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Clean up old CSS
        content = content.replace(/\.brand-blue\s*\{[^}]+\}/g, '');
        content = content.replace(/\.brand-lime\s*\{[^}]+\}/g, '');
        content = content.replace(/\.brand-dot\s*\{[^}]+\}/g, '');
        content = content.replace(/\.gmi-wrapper\s*\{[^}]+\}/g, '');
        content = content.replace(/\.red-dot\s*\{[^}]+\}/g, '');

        // Add unified CSS if not already there
        if (!content.includes('id="unified-logo-style"')) {
            content = content.replace(/<\/head>/, unifiedCss + '</head>');
        } else {
            content = content.replace(/<style id="unified-logo-style">[\s\S]*?<\/style>/, unifiedCss.trim());
        }

        // Replace Dashboard Logo HTML
        content = content.replace(/<div class="brand-container"[^>]*>[\s\S]*?<\/div>/g, 
`<div class="brand-container" onclick="window.location.href='index.html'">
            <span class="gmi-wrapper"><span class="brand-blue">GMI</span><span class="brand-dot"></span></span><span class="brand-lime">HostelKu.</span>
        </div>`);

        // Replace Index/Login Logo HTML
        content = content.replace(/<div class="brand-logo"[^>]*>[\s\S]*?<\/div>/g, 
`<div class="brand-logo">
            <span class="gmi-wrapper"><span class="brand-blue">GMI</span><span class="brand-dot"></span></span><span class="brand-lime">HostelKu.</span>
        </div>`);

        fs.writeFileSync(file, content);
    }
}

console.log("Unified logo with perfect outline applied to ALL pages!");
