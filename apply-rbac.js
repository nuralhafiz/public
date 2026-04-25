const fs = require('fs');

// Files to secure
const studentPages = [
    'student-dashboard.html',
    'student-profile.html',
    'room-apply.html',
    'maintenance.html',
    'move-out.html'
];

const wardenPages = [
    'warden-dashboard.html',
    'warden-applications.html',
    'warden-rooms.html',
    'warden-maintenance.html',
    'warden-moveout.html',
    'warden-students.html',
    'warden-reports.html'
];

const loginPages = [
    'student-login.html',
    'warden-login.html'
];

// 1. Process Student Pages
for (const file of studentPages) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Find onAuthStateChanged(auth, (user) => {
        const authRegex = /onAuthStateChanged\s*\(\s*auth\s*,\s*\(\s*user\s*\)\s*=>\s*\{/;
        if (content.match(authRegex)) {
            // Replace with RBAC logic
            content = content.replace(authRegex, `onAuthStateChanged(auth, (user) => {
            if (user) {
                const email = user.email ? user.email.toLowerCase() : '';
                const isStudent = email.endsWith('@student.gmi.edu.my');
                
                if (!isStudent) {
                    alert('🛡️ Access Denied: Warden accounts cannot access Student pages.');
                    window.location.href = 'warden-dashboard.html';
                    return;
                }
                // RBAC PASS
            `);
            fs.writeFileSync(file, content);
        }
    }
}

// 2. Process Warden Pages
for (const file of wardenPages) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        const authRegex = /onAuthStateChanged\s*\(\s*auth\s*,\s*\(\s*user\s*\)\s*=>\s*\{/;
        if (content.match(authRegex)) {
            // Replace with RBAC logic
            content = content.replace(authRegex, `onAuthStateChanged(auth, (user) => {
            if (user) {
                const email = user.email ? user.email.toLowerCase() : '';
                const isStudent = email.endsWith('@student.gmi.edu.my');
                
                if (isStudent) {
                    alert('🛡️ Access Denied: Student accounts cannot access Warden pages.');
                    window.location.href = 'student-dashboard.html';
                    return;
                }
                // RBAC PASS
            `);
            fs.writeFileSync(file, content);
        }
    }
}

// 3. Process Login Pages
for (const file of loginPages) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // In login pages, there is usually NO onAuthStateChanged natively handling redirect if already logged in.
        // Wait, some login pages MIGHT have it. Let's add it right after firebase-auth.js imports.
        // We'll look for: const auth = getAuth(app);
        
        const importRegex = /import\s*\{\s*auth\s*(?:,\s*db)?\s*\}\s*from\s*["']\.\/js\/firebase-config\.js["'];?/;
        if (content.match(importRegex) && !content.includes('// RBAC Auto-Redirect')) {
            content = content.replace(importRegex, `import { auth } from "./js/firebase-config.js";
    import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

    // RBAC Auto-Redirect: If already logged in, redirect to correct dashboard
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const email = user.email ? user.email.toLowerCase() : '';
            if (email.endsWith('@student.gmi.edu.my')) {
                window.location.href = 'student-dashboard.html';
            } else {
                window.location.href = 'warden-dashboard.html';
            }
        }
    });`);
            fs.writeFileSync(file, content);
        }
    }
}

console.log("RBAC fully applied to all pages!");
