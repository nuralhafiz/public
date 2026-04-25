const fs = require('fs');

const files = ['student-profile.html', 'warden-profile.html'];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Remove the newly added blank details
        const detailsRegex = /<div class="detail-item">\s*<i class="fas fa-id-card"><\/i>[\s\S]*?<span class="detail-label">Joined<\/span>\s*<span class="detail-value">-<\/span>\s*<\/div>\s*<\/div>/;
        
        if (content.match(detailsRegex)) {
            content = content.replace(detailsRegex, '</div>');
            fs.writeFileSync(file, content);
            console.log("Removed blank details from " + file);
        } else {
            console.log("Could not find the block in " + file);
        }
    }
}
