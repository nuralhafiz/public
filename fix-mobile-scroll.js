const fs = require('fs');

const files = ['student-login.html', 'warden-login.html', 'register.html'];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Fix the mobile split-container so it can scroll instead of cutting off the login form
        if (content.includes('.split-container { flex-direction: column; }')) {
            content = content.replace(/\.split-container { flex-direction: column; }/, 
                '.split-container { flex-direction: column; height: auto; min-height: 100vh; overflow-y: auto; overflow-x: hidden; }');
        }

        fs.writeFileSync(file, content);
    }
}

console.log("Mobile split-container scrolling fixed!");
