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

        // Replace Cyan Gradient with Corporate Blue Gradient
        content = content.replace(/linear-gradient\(95deg,\s*#4facfe,\s*#00f2fe\)/g, 'linear-gradient(135deg, #1e3a8a 0%, #2d72d2 100%)');
        content = content.replace(/linear-gradient\(135deg,\s*#4facfe\s*0%,\s*#00f2fe\s*100%\)/g, 'linear-gradient(135deg, #1e3a8a 0%, #2d72d2 100%)');
        
        // Replace solid Cyan with Corporate Blue
        content = content.replace(/#4facfe/g, '#2d72d2');

        fs.writeFileSync(file, content);
    }
}

console.log("Corporate theme applied to all dashboard pages!");
