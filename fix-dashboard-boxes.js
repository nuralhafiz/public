const fs = require('fs');

if (fs.existsSync('warden-dashboard.html')) {
    let content = fs.readFileSync('warden-dashboard.html', 'utf8');

    // Add min-width: 0, width: 100%, overflow: hidden to the cards
    content = content.replace(/\.applications-card\s*\{/g, '.applications-card { min-width: 0; overflow: hidden; width: 100%;');
    content = content.replace(/\.info-card\s*\{/g, '.info-card { min-width: 0; overflow: hidden; width: 100%;');
    content = content.replace(/\.stat-card\s*\{/g, '.stat-card { min-width: 0; overflow: hidden; width: 100%;');

    // Add main padding override for mobile
    const mediaQueryInsertPoint = content.indexOf('@media (max-width: 768px) {');
    if (mediaQueryInsertPoint !== -1 && !content.includes('main { padding: 15px; }')) {
        const insertIdx = mediaQueryInsertPoint + '@media (max-width: 768px) {'.length;
        content = content.substring(0, insertIdx) + 
            '\n            main { padding: 15px; overflow-x: hidden; width: 100vw; box-sizing: border-box; }' +
            content.substring(insertIdx);
    }

    fs.writeFileSync('warden-dashboard.html', content);
    console.log("Fixed box sizes in warden-dashboard.html");
}
