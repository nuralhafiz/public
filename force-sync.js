const fs = require('fs');

// Set login pages to EXACTLY 1.3 (the final resting state of the welcome page hover)
const studentFiles = ['student-login.html', 'register.html'];
for (const file of studentFiles) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/\.image-section\s*{\s*flex:\s*1\.\d+;/, '.image-section {\n            flex: 1.3;');
        fs.writeFileSync(file, content);
    }
}

if (fs.existsSync('warden-login.html')) {
    let content = fs.readFileSync('warden-login.html', 'utf8');
    content = content.replace(/\.login-section\s*{\s*flex:\s*1\.\d+;/, '.login-section {\n            flex: 1.3;');
    fs.writeFileSync('warden-login.html', content);
}

// Update index.html delay to 800ms to guarantee the animation finishes settling at exactly 1.3
let indexContent = fs.readFileSync('index.html', 'utf8');
indexContent = indexContent.replace(/setTimeout\(\(\) => \{ window.location.href = 'warden-login.html'; \}, 350\);/g, "setTimeout(() => { window.location.href = 'warden-login.html'; }, 800);");
indexContent = indexContent.replace(/setTimeout\(\(\) => \{ window.location.href = 'student-login.html'; \}, 350\);/g, "setTimeout(() => { window.location.href = 'student-login.html'; }, 800);");

// Also let's make sure the role-section transition uses an ease-out rather than a bounce so it doesn't overshoot wildly.
// The overshoot was cubic-bezier(0.2, 0.9, 0.4, 1.2)
indexContent = indexContent.replace(/transition: flex 0.65s cubic-bezier\(0.2, 0.9, 0.4, 1.2\);/g, "transition: flex 0.65s ease-out;");

fs.writeFileSync('index.html', indexContent);

console.log("Flex and delay forcefully synced to exactly 1.3 and ease-out!");
