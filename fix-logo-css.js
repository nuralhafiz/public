const fs = require('fs');

let content = fs.readFileSync('c:/Users/Al Hafiz/public/warden-students.html', 'utf8');

// Remove legacy logo CSS
content = content.replace(/.*\.brand-container\s*{[\s\S]*?margin-left:\s*10px;\s*}\n/g, '');
content = content.replace(/.*\.brand-blue\s*{[\s\S]*?0\.3\);\s*}\n/g, '');
content = content.replace(/.*\.brand-lime\s*{[\s\S]*?0\.3\);\s*}\n/g, '');

// Update unifiedLogoCSS brand-container to 24px like dashboard
content = content.replace(/font-size:\s*32px\s*!important;/g, 'font-size: 24px;');

fs.writeFileSync('c:/Users/Al Hafiz/public/warden-students.html', content);
console.log("Logo CSS standardized!");
