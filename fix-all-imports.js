const fs = require('fs');

function processFile(file) {
    let content = fs.readFileSync(file, 'utf8');

    // Remove literal '\n' at the end of the script
    content = content.replace(/\\n\s*<\/script>\s*\\n\s*<\/body>/g, '\n    </script>\n</body>');
    content = content.replace(/\\n\s*<\/script>\s*<\/body>/g, '\n    </script>\n</body>');

    // Fix duplicated firestore imports
    // 1. Remove all firestore imports
    // 2. Add a single unified firestore import
    let unifiedImport = 'import { getFirestore, collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch, addDoc, serverTimestamp, getDoc, setDoc, getDocs, limit, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";\n';
    
    // Find where firebase-auth.js is imported
    const authImportRegex = /import\s+\{[^}]+\}\s+from\s+"https:\/\/www\.gstatic\.com\/firebasejs\/10\.8\.0\/firebase-auth\.js";\n?/;
    
    // Remove all lines containing firebase-firestore.js
    let lines = content.split('\n');
    lines = lines.filter(line => !line.includes('firebase-firestore.js'));
    content = lines.join('\n');
    
    // Insert the unified import right after auth import
    content = content.replace(authImportRegex, match => {
        // Ensure there is exactly one newline between them
        let cleanMatch = match.trim();
        return cleanMatch + '\n' + unifiedImport;
    });

    fs.writeFileSync(file, content);
    console.log("Processed " + file);
}

const files = [
    'student-profile.html',
    'room-apply.html',
    'move-out.html',
    'student-dashboard.html',
    'maintenance.html'
];

files.forEach(processFile);
