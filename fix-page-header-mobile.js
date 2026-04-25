const fs = require('fs');

const files = [
    'warden-dashboard.html',
    'warden-applications.html',
    'warden-moveout.html',
    'warden-maintenance.html',
    'warden-rooms.html',
    'warden-reports.html',
    'warden-students.html'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        const mediaQueryInsertPoint = content.indexOf('@media (max-width: 768px) {');
        if (mediaQueryInsertPoint !== -1) {
            // Check if already injected
            if (!content.includes('.page-header { flex-direction: column;')) {
                const insertIdx = mediaQueryInsertPoint + '@media (max-width: 768px) {'.length;
                content = content.substring(0, insertIdx) + 
                    '\n            .page-header { flex-direction: column; align-items: flex-start; gap: 15px; }' +
                    content.substring(insertIdx);
            }
        }

        fs.writeFileSync(file, content);
        console.log(`Fixed page-header mobile UI for ${file}`);
    }
});
