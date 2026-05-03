const fs = require('fs');

if (fs.existsSync('warden-login.html')) {
    let content = fs.readFileSync('warden-login.html', 'utf8');

    // 1. Remove flex-direction: row-reverse from split-container
    content = content.replace(/flex-direction:\s*row-reverse;/g, '');

    // 2. Set login-section to 43.478% (Right side, smaller)
    content = content.replace(/\.login-section\s*{\s*width:\s*56\.522%;/g, '.login-section {\n            width: 43.478%;');

    // 3. Set image-section to 56.522% (Left side, larger, pushing the line to the right to match welcome page)
    content = content.replace(/\.image-section\s*{\s*width:\s*43\.478%;/g, '.image-section {\n            width: 56.522%;');

    fs.writeFileSync('warden-login.html', content);
    console.log("Warden login layout updated!");
} else {
    console.log("File not found");
}
