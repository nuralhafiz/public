const fs = require('fs');

function fixStudent() {
    let content = fs.readFileSync('student-profile.html', 'utf8');

    const targetRegex = /\.profile-avatar i\s*\{\s*background: #ccff00;\s*border-radius: 50%;\s*padding: 20px;\s*color: #1118a8;\s*box-shadow: 0 10px 30px rgba\(204, 255, 0, 0\.4\);\s*\}\s*\.profile-avatar:after\s*\{\s*content: '👤';\s*position: absolute;\s*bottom: 10px;\s*right: 10px;\s*background: #1118a8;\s*color: white;\s*border-radius: 50%;\s*padding: 5px;\s*font-size: 20px;\s*box-shadow: 0 2px 10px rgba\(0, 0, 0, 0\.2\);\s*\}/;

    const replacement = `.profile-avatar i {
            background: #ccff00;
            border-radius: 50%;
            padding: 20px;
            color: white;
            border: 3px solid #0f1638;
            box-shadow: 0 10px 30px rgba(204, 255, 0, 0.4);
        }
        
        /* Removed the emoji badge to eliminate the blue color */`;

    content = content.replace(targetRegex, replacement);
    fs.writeFileSync('student-profile.html', content);
    console.log("Fixed student-profile.html");
}

function fixWarden() {
    let content = fs.readFileSync('warden-profile.html', 'utf8');

    const targetRegex = /\.profile-avatar i\s*\{\s*background: #f93144;\s*border-radius: 50%;\s*padding: 20px;\s*color: white;\s*box-shadow: 0 10px 30px rgba\(249, 49, 68, 0\.4\);\s*\}\s*\.profile-avatar:after\s*\{\s*content: '👤';\s*position: absolute;\s*bottom: 10px;\s*right: 10px;\s*background: #f93144;\s*border-radius: 50%;\s*padding: 5px;\s*font-size: 20px;\s*box-shadow: 0 2px 10px rgba\(0, 0, 0, 0\.2\);\s*\}/;

    const replacement = `.profile-avatar i {
            background: #f93144;
            border-radius: 50%;
            padding: 20px;
            color: white;
            border: 3px solid #0f1638;
            box-shadow: 0 10px 30px rgba(249, 49, 68, 0.4);
        }
        
        /* Removed the emoji badge to eliminate the blue color */`;

    content = content.replace(targetRegex, replacement);
    fs.writeFileSync('warden-profile.html', content);
    console.log("Fixed warden-profile.html");
}

fixStudent();
fixWarden();
