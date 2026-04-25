const fs = require('fs');

const files = [
    'warden-moveout.html',
    'warden-students.html'
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

        // 1. apply-theme & corporate theme (combine)
        content = content.replace(/body\s*\{[^}]*background:\s*linear-gradient\(135deg,\s*#667eea\s*0%,\s*#764ba2\s*100%\)[^}]*\}/g, (match) => match.replace('linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '#f0f3fa'));
        content = content.replace(/main\s*\{[^}]*background:\s*linear-gradient\(135deg,\s*#667eea\s*0%,\s*#764ba2\s*100%\)[^}]*\}/g, (match) => match.replace('linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '#f0f3fa'));
        content = content.replace(/background:\s*linear-gradient\(135deg,\s*#667eea\s*0%,\s*#764ba2\s*100%\);\s*overflow: hidden;/g, 'background: #f0f3fa; overflow: hidden;');
        content = content.replace(/background:\s*linear-gradient\(135deg,\s*#667eea\s*0%,\s*#764ba2\s*100%\);\s*overflow-y: auto;/g, 'background: #f0f3fa; overflow-y: auto;');
        
        // For remaining indigo gradients, change them straight to corporate blue
        content = content.replace(/linear-gradient\(135deg,\s*#667eea\s*0%,\s*#764ba2\s*100%\)/g, 'linear-gradient(135deg, #1e3a8a 0%, #2d72d2 100%)');
        content = content.replace(/#667eea/g, '#2d72d2');

        // 2. update-header
        content = content.replace(/header\s*\{\s*background:\s*rgba\(15,\s*22,\s*56,\s*0\.95\);/g, 'header { background: linear-gradient(135deg, #1e3a8a 0%, #2d72d2 100%);');

        // 3. update-logo & update-logo-outline
        content = content.replace(/<div class="brand-container">[\s\S]*?<\/div>/g, 
`<div class="brand-container" onclick="window.location.href='index.html'">
            <span class="brand-blue">GMI</span><span class="brand-dot">&bull;</span><span class="brand-lime">HostelKu.</span>
        </div>`);

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

console.log("Missed files (Moveout & Students) updated successfully!");
