const fs = require('fs');
const path = require('path');
const files = [
    'import-students.html',
    'seed-db.html',
    'warden-applications.html',
    'warden-dashboard.html',
    'warden-maintenance.html',
    'warden-moveout.html',
    'warden-reports.html',
    'warden-rooms.html',
    'warden-students.html'
];
files.forEach(f => {
    let p = path.join('c:\\Users\\Al Hafiz\\public', f);
    if(fs.existsSync(p)){
        let content = fs.readFileSync(p, 'utf8');
        // We use a regular expression to find the exact target line, handling possible indentation differences.
        let targetRegex = /([ \t]*)if \(!user\.email\.endsWith\('@gmi\.edu\.my'\) \|\| user\.email\.includes\('@student\.'\)\) \{/g;
        
        let newContent = content.replace(
            targetRegex,
            "$1const isSuperAdmin = (user.email === 'admin.gmihostelku@gmail.com');\n$1if (!isSuperAdmin && (!user.email.endsWith('@gmi.edu.my') || user.email.includes('@student.'))) {"
        );
        fs.writeFileSync(p, newContent, 'utf8');
        console.log(`Updated ${f}`);
    }
});
