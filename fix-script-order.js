const fs = require('fs');

function fixFile(filename) {
    if (!fs.existsSync(filename)) return;
    let content = fs.readFileSync(filename, 'utf8');

    // Extract the Modal HTML
    const modalRegex = /(<!-- Edit Profile Modal -->[\s\S]*?<\/div>\s*<\/div>)\s*/;
    const match = content.match(modalRegex);
    if (!match) return;

    const modalHtml = match[1];

    // Remove it from its current position
    content = content.replace(modalRegex, '');

    // Insert it right BEFORE the script tag
    const scriptPos = content.indexOf('<script type="module">');
    if (scriptPos !== -1) {
        content = content.slice(0, scriptPos) + modalHtml + '\n\n    ' + content.slice(scriptPos);
        fs.writeFileSync(filename, content);
        console.log('Fixed ' + filename);
    }
}

fixFile('student-profile.html');
fixFile('warden-profile.html');
