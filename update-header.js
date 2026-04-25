const fs = require('fs');

const files = [
    'student-dashboard.html',
    'room-apply.html',
    'maintenance.html',
    'move-out.html',
    'student-profile.html',
    'warden-dashboard.html',
    'warden-applications.html',
    'warden-rooms.html',
    'warden-maintenance.html',
    'warden-reports.html'
];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Replace the dark navy header with the Corporate Blue Gradient
        content = content.replace(/header\s*\{\s*background:\s*rgba\(15,\s*22,\s*56,\s*0\.95\);/g, 'header { background: linear-gradient(135deg, #1e3a8a 0%, #2d72d2 100%);');
        
        fs.writeFileSync(file, content);
    }
}

console.log("Header color updated to Corporate Blue Gradient!");
