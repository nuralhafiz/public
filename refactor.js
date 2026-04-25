const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let changed = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // First, remove the initializeApp import
    let newContent = content.replace(/import\s*\{\s*initializeApp\s*\}\s*from\s*["']https:\/\/www\.gstatic\.com\/firebasejs\/10\.8\.0\/firebase-app\.js["'];\s*/g, '');
    
    // Pattern to match the config block and init
    const pattern = /const\s+firebaseConfig\s*=\s*\{[\s\S]*?appId:\s*["'][^"']+["']\s*\};\s*const\s+app\s*=\s*initializeApp\(firebaseConfig\);\s*const\s+auth\s*=\s*getAuth\(app\);(?:\s*const\s+db\s*=\s*getFirestore\(app\);)?/g;
    
    if (pattern.test(newContent)) {
        newContent = newContent.replace(pattern, 'import { auth, db } from "./js/firebase-config.js";');
        fs.writeFileSync(file, newContent);
        console.log(`Updated ${file}`);
        changed++;
    } else {
        console.log(`No match in ${file}`);
    }
});

console.log(`Successfully updated ${changed} files.`);
