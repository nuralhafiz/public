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

        // Replace the main body and main background gradient with the new light background #f0f3fa
        // and keep the other instances of the old gradient for buttons/accents, replacing them with the cyan gradient
        
        // Let's just do a smart regex or multiple replaces.
        
        // 1. body and main backgrounds
        content = content.replace(/body\s*\{[^}]*background:\s*linear-gradient\(135deg,\s*#667eea\s*0%,\s*#764ba2\s*100%\)[^}]*\}/g, (match) => {
            return match.replace('linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '#f0f3fa');
        });
        
        content = content.replace(/main\s*\{[^}]*background:\s*linear-gradient\(135deg,\s*#667eea\s*0%,\s*#764ba2\s*100%\)[^}]*\}/g, (match) => {
            return match.replace('linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '#f0f3fa');
        });

        // 2. Also some files might have background in a single line like `main { flex: 1; padding: 30px; overflow-y: auto; background: linear-gradient...`
        content = content.replace(/background:\s*linear-gradient\(135deg,\s*#667eea\s*0%,\s*#764ba2\s*100%\);\s*overflow: hidden;/g, 'background: #f0f3fa; overflow: hidden;');
        content = content.replace(/background:\s*linear-gradient\(135deg,\s*#667eea\s*0%,\s*#764ba2\s*100%\);\s*overflow-y: auto;/g, 'background: #f0f3fa; overflow-y: auto;');

        // 3. For all other occurrences (buttons, active items, borders), replace with the cyan/blue gradient
        content = content.replace(/linear-gradient\(135deg,\s*#667eea\s*0%,\s*#764ba2\s*100%\)/g, 'linear-gradient(95deg, #4facfe, #00f2fe)');
        
        // 4. Change #667eea to #4facfe for solid colors
        content = content.replace(/#667eea/g, '#4facfe');

        // 5. Let's make sure the text color in the main content is dark enough if it was white on the old gradient
        // Actually, cards were white, so text inside them is already dark. 

        fs.writeFileSync(file, content);
    }
}

console.log("Theme update applied to all dashboard pages!");
