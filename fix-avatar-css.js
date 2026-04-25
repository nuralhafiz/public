const fs = require('fs');
let content = fs.readFileSync('c:/Users/Al Hafiz/public/warden-students.html', 'utf8');

// 1. Remove the old avatar container block completely (which is causing the giant red shield)
const oldAvatarRegex = /\/\* Avatar in Header \*\/[\s\S]*?\.avatar-container i\s*\{[\s\S]*?box-shadow:[^}]*\}\s*\n/g;
content = content.replace(oldAvatarRegex, '');

// 2. Add the missing .avatar-container i to the unified logo style
const newAvatarICss = `        .avatar-container i {
            font-size: 22px;
            color: #ffffff;
            z-index: 2;
        }`;

if (!content.includes('.avatar-container i {') && !content.includes('font-size: 22px;')) {
    content = content.replace('.avatar-container:hover {', newAvatarICss + '\n        .avatar-container:hover {');
}

fs.writeFileSync('c:/Users/Al Hafiz/public/warden-students.html', content);
console.log('Fixed avatar CSS perfectly!');
