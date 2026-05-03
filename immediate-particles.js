const fs = require('fs');

const files = ['index.html', 'student-login.html', 'warden-login.html', 'register.html'];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Replace positive delay with negative delay so particles are pre-rendered on screen
        // Also capture variations of the spacing just in case
        content = content.replace(/particle\.style\.animationDelay\s*=\s*Math\.random\(\)\s*\*\s*15\s*\+\s*'s';/g, 
            "particle.style.animationDelay = '-' + (Math.random() * 25) + 's';");

        fs.writeFileSync(file, content);
    }
}

console.log("Animation delays updated to negative values for immediate appearance!");
