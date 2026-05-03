const fs = require('fs');

const files = [
    'student-login.html',
    'warden-login.html',
    'register.html'
];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Check if flex-direction: row-reverse is already there
        if (!content.includes('flex-direction: row-reverse;')) {
            // Replace split-container base class to add row-reverse
            content = content.replace(/\.split-container\s*{\s*display:\s*flex;\s*height:\s*100vh;\s*width:\s*100vw;\s*position:\s*relative;\s*overflow:\s*hidden;\s*}/g, 
                '.split-container {\n            display: flex;\n            height: 100vh;\n            width: 100vw;\n            position: relative;\n            overflow: hidden;\n            flex-direction: row-reverse;\n        }');
            
            fs.writeFileSync(file, content);
            console.log(`Updated layout for ${file}`);
        } else {
            console.log(`${file} already has row-reverse`);
        }
    }
}
