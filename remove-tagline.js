const fs = require('fs');

const files = ['index.html', 'student-login.html', 'warden-login.html'];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Match <div class="tagline"> ... </div>
        const regex = /<div class="tagline">[\s\S]*?<\/div>/g;
        
        if (regex.test(content)) {
            content = content.replace(regex, '');
            fs.writeFileSync(file, content);
            console.log(`Removed tagline from ${file}`);
        } else {
            console.log(`No tagline found in ${file}`);
        }
    }
});
