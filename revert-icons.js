const fs = require('fs');

const files = [
    'warden-dashboard.html',
    'warden-applications.html',
    'warden-moveout.html',
    'warden-maintenance.html',
    'warden-rooms.html',
    'warden-reports.html',
    'warden-students.html',
    'warden-profile.html'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Remove the unified icon style block
        const oldStyleRegex = /<style id="unified-icon-style">[\s\S]*?<\/style>/;
        if (content.match(oldStyleRegex)) {
            content = content.replace(oldStyleRegex, '');
            fs.writeFileSync(file, content);
            console.log(`Reverted icons for ${file}`);
        } else {
            console.log(`No unified icon style found in ${file}`);
        }
    }
});
