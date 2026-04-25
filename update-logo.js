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

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Update the HTML
        // Note: the original HTML is:
        // <div class="brand-container">
        //     <span class="brand-dot">•</span> <span class="brand-blue">GMI</span>
        //     <span class="brand-lime">-HK</span>
        // </div>
        // Let's use regex to replace the entire brand-container contents
        content = content.replace(/<div class="brand-container">[\s\S]*?<\/div>/g, 
`<div class="brand-container" onclick="window.location.href='index.html'">
            <span class="brand-blue">GMI</span><span class="brand-dot">&bull;</span><span class="brand-lime">HostelKu.</span>
        </div>`);

        // Now replace the CSS. The CSS might be slightly different in spacing, so we use a robust regex or we replace specific blocks.
        // Let's replace the .brand-container, .brand-blue, .brand-lime, .brand-dot blocks.
        
        // Remove old CSS blocks
        content = content.replace(/\.brand-container\s*\{[^}]+\}/g, '');
        content = content.replace(/\.brand-blue\s*\{[^}]+\}/g, '');
        content = content.replace(/\.brand-lime\s*\{[^}]+\}/g, '');
        content = content.replace(/\.brand-dot\s*\{[^}]+\}/g, '');

        // Add the new CSS right before the menu-toggle
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
            -webkit-text-stroke: 1.5px #ffffff;
            text-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        .brand-lime { 
            color: #ccff00; 
            margin-left: 2px;
            -webkit-text-stroke: 0.5px #ffffff;
            text-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        .brand-dot { 
            color: #ff3131; 
            font-size: 40px; 
            line-height: 0;
            position: relative; 
            top: -15px; 
            margin-left: -10px; 
            margin-right: 2px;
            -webkit-text-stroke: 1.5px #ffffff;
        }
        `;

        content = content.replace(/\.menu-toggle\s*\{/, newCss + '\n        .menu-toggle {');

        fs.writeFileSync(file, content);
    }
}

console.log("Logo updated to 'GMI HostelKu.' with outline!");
