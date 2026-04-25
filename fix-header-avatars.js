const fs = require('fs');

const studentFiles = [
    'maintenance.html',
    'move-out.html',
    'room-apply.html',
    'student-dashboard.html',
    'student-profile.html'
];

const wardenFiles = [
    'warden-applications.html',
    'warden-dashboard.html',
    'warden-maintenance.html',
    'warden-profile.html',
    'warden-moveout.html',
    'warden-reports.html',
    'warden-rooms.html',
    'warden-students.html'
];

const regex = /\.avatar-container i\s*\{[\s\S]*?\}/g;

const studentReplacement = `.avatar-container i {
            font-size: 36px;
            color: white;
            background: #ccff00;
            border: 2px solid #0f1638;
            border-radius: 50%;
            padding: 5px;
            box-shadow: 0 0 20px rgba(204, 255, 0, 0.3);
        }`;

const wardenReplacement = `.avatar-container i {
            font-size: 36px;
            color: white;
            background: #f93144;
            border: 2px solid #0f1638;
            border-radius: 50%;
            padding: 5px;
            box-shadow: 0 0 20px rgba(249, 49, 68, 0.3);
        }`;

function updateFiles(files, replacement) {
    for (const file of files) {
        if (!fs.existsSync(file)) continue;
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(regex, replacement);
        fs.writeFileSync(file, content);
        console.log("Fixed " + file);
    }
}

updateFiles(studentFiles, studentReplacement);
updateFiles(wardenFiles, wardenReplacement);
