const fs = require('fs');

const files = [
    'student-login.html',
    'warden-login.html',
    'register.html'
];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Change flex: 1.5 to flex: 1 in image-section
        content = content.replace(/\.image-section\s*{\s*flex:\s*1\.5;/, '.image-section {\n            flex: 1;');

        fs.writeFileSync(file, content);
    }
}

console.log("Image section flex value updated to 1!");
