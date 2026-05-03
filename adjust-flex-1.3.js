const fs = require('fs');

// For student-login.html and register.html (Line moves Left -> Right side is larger)
const studentFiles = ['student-login.html', 'register.html'];
for (const file of studentFiles) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        // Set image-section (Right) to 1.3
        content = content.replace(/\.image-section\s*{\s*flex:\s*1\.1;/, '.image-section {\n            flex: 1.3;');
        // Set login-section (Left) to 1
        content = content.replace(/\.login-section\s*{\s*flex:\s*1\.1;/, '.login-section {\n            flex: 1;');
        fs.writeFileSync(file, content);
    }
}

// For warden-login.html (Line moves Right -> Left side is larger)
if (fs.existsSync('warden-login.html')) {
    let content = fs.readFileSync('warden-login.html', 'utf8');
    // Set login-section (Left) to 1.3
    content = content.replace(/\.login-section\s*{\s*flex:\s*1\.1;/, '.login-section {\n            flex: 1.3;');
    // Set image-section (Right) to 1
    content = content.replace(/\.image-section\s*{\s*flex:\s*1\.1;/, '.image-section {\n            flex: 1;');
    fs.writeFileSync('warden-login.html', content);
}

console.log("Flex ratios adjusted to 1.3 to match welcome page hover!");
