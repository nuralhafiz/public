const fs = require('fs');
const files = [
    'maintenance.html',
    'move-out.html',
    'room-apply.html',
    'student-dashboard.html',
    'student-profile.html'
];
files.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    // Replace the literal string \n with an actual newline
    c = c.split('\\n    </script>\\n</body>').join('\n    </script>\n</body>');
    fs.writeFileSync(f, c);
    console.log('Fixed ' + f);
});
