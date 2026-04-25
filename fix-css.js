const fs = require('fs');

function fixStudent() {
    let content = fs.readFileSync('student-profile.html', 'utf8');

    // Remove the accidentally injected CSS block
    const badCssRegex = /\s*\.profile-avatar i \{\s*background: #ccff00;\s*border-radius: 50%;\s*padding: 20px;\s*color: #1118a8;\s*box-shadow: 0 10px 30px rgba\(204, 255, 0, 0\.4\);\s*\}\s*\.profile-avatar:after \{\s*content: '👤';\s*position: absolute;\s*bottom: 10px;\s*right: 10px;\s*background: #1118a8;\s*color: white;\s*border-radius: 50%;\s*padding: 5px;\s*font-size: 20px;\s*box-shadow: 0 2px 10px rgba\(0, 0, 0, 0\.2\);\s*\}/g;
    content = content.replace(badCssRegex, '');

    // Now correctly replace the actual .profile-avatar i and :after
    const correctTargetRegex = /\.profile-avatar i\s*\{\s*background: linear-gradient\(135deg, #1e3a8a 0%, #2d72d2 100%\);\s*border-radius: 50%;\s*padding: 20px;\s*color: white;\s*box-shadow: 0 10px 30px rgba\(102, 126, 234, 0\.4\);\s*\}\s*\.profile-avatar:after\s*\{\s*content: '👤';\s*position: absolute;\s*bottom: 10px;\s*right: 10px;\s*background: #ccff00;\s*border-radius: 50%;\s*padding: 5px;\s*font-size: 20px;\s*box-shadow: 0 2px 10px rgba\(0, 0, 0, 0\.2\);\s*\}/;

    const replacement = `.profile-avatar i {
            background: #ccff00;
            border-radius: 50%;
            padding: 20px;
            color: #1118a8;
            box-shadow: 0 10px 30px rgba(204, 255, 0, 0.4);
        }

        .profile-avatar:after {
            content: '👤';
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: #1118a8;
            color: white;
            border-radius: 50%;
            padding: 5px;
            font-size: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }`;

    content = content.replace(correctTargetRegex, replacement);
    fs.writeFileSync('student-profile.html', content);
    console.log("Fixed student-profile.html");
}

function fixWarden() {
    let content = fs.readFileSync('warden-profile.html', 'utf8');

    const correctTargetRegex = /\.profile-avatar i\s*\{\s*background: linear-gradient\(135deg, #1e3a8a 0%, #2d72d2 100%\);\s*border-radius: 50%;\s*padding: 20px;\s*color: white;\s*box-shadow: 0 10px 30px rgba\(102, 126, 234, 0\.4\);\s*\}\s*\.profile-avatar:after\s*\{\s*content: '👤';\s*position: absolute;\s*bottom: 10px;\s*right: 10px;\s*background: #ccff00;\s*border-radius: 50%;\s*padding: 5px;\s*font-size: 20px;\s*box-shadow: 0 2px 10px rgba\(0, 0, 0, 0\.2\);\s*\}/;

    const replacement = `.profile-avatar i {
            background: #f93144;
            border-radius: 50%;
            padding: 20px;
            color: white;
            box-shadow: 0 10px 30px rgba(249, 49, 68, 0.4);
        }

        .profile-avatar:after {
            content: '👤';
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: #f93144;
            border-radius: 50%;
            padding: 5px;
            font-size: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }`;

    content = content.replace(correctTargetRegex, replacement);

    // Also header avatar
    const headerRegex = /\.avatar-container i\s*\{\s*font-size: 36px;\s*color: #ccff00;\s*background: rgba\(255, 255, 255, 0\.1\);\s*border-radius: 50%;\s*padding: 5px;\s*box-shadow: 0 0 20px rgba\(204, 255, 0, 0\.3\);\s*\}/;
    const headerReplacement = `.avatar-container i {
            font-size: 36px;
            color: #f93144;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            padding: 5px;
            box-shadow: 0 0 20px rgba(249, 49, 68, 0.3);
        }`;
    content = content.replace(headerRegex, headerReplacement);

    fs.writeFileSync('warden-profile.html', content);
    console.log("Fixed warden-profile.html");
}

fixStudent();
fixWarden();
