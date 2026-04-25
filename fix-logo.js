const fs = require('fs');
let content = fs.readFileSync('c:/Users/Al Hafiz/public/warden-students.html', 'utf8');

const s1 = '.brand-container { display: flex; align-items: center; font-size: 28px; font-weight: 700; cursor: pointer; position: relative; margin-left: 10px; }';
const s2 = '.brand-blue { color: #2d72d2; text-shadow: 0 2px 10px rgba(45, 114, 210, 0.3); }';
const s3 = '.brand-lime { color: #ccff00; margin-left: 5px; text-shadow: 0 2px 10px rgba(204, 255, 0, 0.3); }';
const s4 = '.brand-dot { color: #ff3131; font-size: 28px; position: absolute; top: -16px; left: 42px; text-shadow: 0 2px 10px rgba(255, 49, 49, 0.3); }';

content = content.replace(s1, '');
content = content.replace(s2, '');
content = content.replace(s3, '');
content = content.replace(s4, '');

// And then I also need to update the unified logo CSS block so that .brand-container has font-size: 24px;
const unifiedLogoStyleOld = `        .brand-container {
            display: flex; 
            align-items: center; 
            font-size: 24px; 
            font-weight: 800; 
            cursor: pointer; 
            position: relative; 
            margin-left: 10px;
            letter-spacing: -0.5px;
        }`;
// Wait, in my perfect script I ALREADY set it to 24px! Let me check what is actually in the file.
fs.writeFileSync('c:/Users/Al Hafiz/public/warden-students.html', content);
