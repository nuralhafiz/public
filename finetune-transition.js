const fs = require('fs');

// For student-login.html and register.html
const studentFiles = ['student-login.html', 'register.html'];
for (const file of studentFiles) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/\.image-section\s*{\s*flex:\s*1\.3;/, '.image-section {\n            flex: 1.15;');
        fs.writeFileSync(file, content);
    }
}

// For warden-login.html
if (fs.existsSync('warden-login.html')) {
    let content = fs.readFileSync('warden-login.html', 'utf8');
    content = content.replace(/\.login-section\s*{\s*flex:\s*1\.3;/, '.login-section {\n            flex: 1.15;');
    fs.writeFileSync('warden-login.html', content);
}

// Update index.html delay so animation finishes more
let indexContent = fs.readFileSync('index.html', 'utf8');
indexContent = indexContent.replace(/setTimeout\(\(\) => \{ window.location.href = 'warden-login.html'; \}, 120\);/g, "setTimeout(() => { window.location.href = 'warden-login.html'; }, 350);");
indexContent = indexContent.replace(/setTimeout\(\(\) => \{ window.location.href = 'student-login.html'; \}, 120\);/g, "setTimeout(() => { window.location.href = 'student-login.html'; }, 350);");
fs.writeFileSync('index.html', indexContent);

console.log("Flex and delay adjusted!");
