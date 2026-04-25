const fs = require('fs');

const files = [
    'c:/Users/Al Hafiz/public/student-login.html',
    'c:/Users/Al Hafiz/public/warden-login.html'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // 1. Update the imports
    const oldImport = 'import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";';
    const newImport = 'import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";';
    content = content.replace(oldImport, newImport);
    
    // 2. Add setPersistence before sign in
    const oldSignIn = '        try {\n            await signInWithEmailAndPassword(auth, email, password);';
    const newSignIn = '        try {\n            await setPersistence(auth, browserSessionPersistence);\n            await signInWithEmailAndPassword(auth, email, password);';
    content = content.replace(oldSignIn, newSignIn);
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
});
