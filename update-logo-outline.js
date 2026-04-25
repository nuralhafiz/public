const fs = require('fs');

const files = [
    'student-dashboard.html',
    'room-apply.html',
    'maintenance.html',
    'move-out.html',
    'student-profile.html',
    'warden-dashboard.html',
    'warden-applications.html',
    'warden-rooms.html',
    'warden-maintenance.html',
    'warden-reports.html'
];

const outerOutline = (color, thickness, dropShadow) => {
    return 'text-shadow: ' +
        '-' + thickness + 'px -' + thickness + 'px 0 ' + color + ', ' +
        '0px -' + thickness + 'px 0 ' + color + ', ' +
        thickness + 'px -' + thickness + 'px 0 ' + color + ', ' +
        thickness + 'px 0px 0 ' + color + ', ' +
        thickness + 'px ' + thickness + 'px 0 ' + color + ', ' +
        '0px ' + thickness + 'px 0 ' + color + ', ' +
        '-' + thickness + 'px ' + thickness + 'px 0 ' + color + ', ' +
        '-' + thickness + 'px 0px 0 ' + color +
        (dropShadow ? ', ' + dropShadow : '') + ';';
};

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Remove old CSS blocks
        content = content.replace(/\.brand-container\s*\{[^}]+\}/g, '');
        content = content.replace(/\.brand-blue\s*\{[^}]+\}/g, '');
        content = content.replace(/\.brand-lime\s*\{[^}]+\}/g, '');
        content = content.replace(/\.brand-dot\s*\{[^}]+\}/g, '');

        const newCss = `
        .brand-container { 
            display: flex; 
            align-items: center; 
            font-size: 24px; 
            font-weight: 800; 
            cursor: pointer; 
            position: relative; 
            margin-left: 10px;
            letter-spacing: -0.5px;
        }
        .brand-blue { 
            color: #2d72d2; 
            ${outerOutline('#ffffff', 1.5, '0 4px 6px rgba(0,0,0,0.3)')}
        }
        .brand-lime { 
            color: #ccff00; 
            margin-left: 2px;
            ${outerOutline('#ffffff', 0.5, '0 2px 4px rgba(0,0,0,0.3)')}
        }
        .brand-dot { 
            color: #ff3131; 
            font-size: 40px; 
            line-height: 0;
            position: relative; 
            top: -15px; 
            margin-left: -10px; 
            margin-right: 2px;
            ${outerOutline('#ffffff', 1.5, '0 2px 4px rgba(0,0,0,0.3)')}
        }
        `;

        content = content.replace(/\.menu-toggle\s*\{/, newCss + '\n        .menu-toggle {');

        fs.writeFileSync(file, content);
    }
}

console.log("Logo updated with OUTER outline using text-shadow!");
