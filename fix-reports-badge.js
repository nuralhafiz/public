const fs = require('fs');

if (fs.existsSync('warden-reports.html')) {
    let content = fs.readFileSync('warden-reports.html', 'utf8');

    const mediaQueryInsertPoint = content.indexOf('@media (max-width: 768px) {');
    if (mediaQueryInsertPoint !== -1) {
        // Check if already injected
        if (!content.includes('.stats-badge { flex-direction: row; flex-wrap: wrap;')) {
            const insertIdx = mediaQueryInsertPoint + '@media (max-width: 768px) {'.length;
            content = content.substring(0, insertIdx) + 
                '\n            .stats-badge { flex-direction: row; flex-wrap: wrap; justify-content: flex-start; gap: 8px; width: 100%; }' +
                '\n            .stat-badge-item { flex: 1 1 auto; justify-content: center; text-align: center; }' +
                content.substring(insertIdx);
        }
    }

    fs.writeFileSync('warden-reports.html', content);
    console.log(`Fixed stats-badge mobile UI for warden-reports.html`);
}
