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

        // Fix .stats-badge on mobile across all files
        const statsBadgeRegex = /\.stats-badge\s*\{\s*flex-direction:\s*column;\s*width:\s*100%;\s*\}/g;
        if (content.match(statsBadgeRegex)) {
            content = content.replace(statsBadgeRegex, `.stats-badge { flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 8px; width: 100%; }`);
        }

        // Fix .stat-badge-item text-align center
        const statBadgeItemRegex = /\.stat-badge-item\s*\{\s*text-align:\s*center;\s*\}/g;
        if (content.match(statBadgeItemRegex)) {
            content = content.replace(statBadgeItemRegex, `.stat-badge-item { flex: 1 1 auto; justify-content: center; text-align: center; }`);
        }

        // Specific fix for warden-dashboard.html quick-action-btn
        if (file === 'warden-dashboard.html') {
            const mediaQueryInsertPoint = content.indexOf('@media (max-width: 768px) {');
            if (mediaQueryInsertPoint !== -1) {
                // Check if already injected
                if (!content.includes('.quick-action-btn { width: 100%;')) {
                    const insertIdx = mediaQueryInsertPoint + '@media (max-width: 768px) {'.length;
                    content = content.substring(0, insertIdx) + 
                        '\n            .quick-action-btn { width: 100%; box-sizing: border-box; justify-content: center; }' +
                        content.substring(insertIdx);
                }
            }
        }

        // Specific fix for warden-rooms.html filters wrap
        if (file === 'warden-rooms.html') {
            const filtersSectionRegex = /\.filters-section\s*\{\s*flex-direction:\s*column;\s*\}/g;
            if (content.match(filtersSectionRegex)) {
                content = content.replace(filtersSectionRegex, `.filters-section { flex-wrap: wrap !important; flex-direction: column; }`);
            }
            const filterGroupRegex = /\.filter-group\s*\{\s*width:\s*100%;\s*\}/g;
            if (content.match(filterGroupRegex)) {
                content = content.replace(filterGroupRegex, `.filter-group { flex-wrap: wrap !important; width: 100%; }`);
            }
            // Also ensure .filter-select wraps correctly on mobile
            const mediaQueryInsertPoint = content.indexOf('@media (max-width: 768px) {');
            if (mediaQueryInsertPoint !== -1 && !content.includes('.filter-select { flex: 1 1 45%; }')) {
                const insertIdx = mediaQueryInsertPoint + '@media (max-width: 768px) {'.length;
                content = content.substring(0, insertIdx) + 
                    '\n            .filter-select { flex: 1 1 45%; }' +
                    '\n            #refreshBtn { flex: 1 1 100%; }' +
                    content.substring(insertIdx);
            }
        }

        fs.writeFileSync(file, content);
        console.log(`Fixed mobile UI for ${file}`);
    }
});
