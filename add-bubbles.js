const fs = require('fs');

const bubbleJS = `
    // Add smooth dynamic particles (seamless from welcome page)
    function createBubbles() {
        const container = document.getElementById('bubbleContainer');
        if (!container) return;
        const colors = ['#ccff00', '#ff3131', '#3b82f6', '#ffffff80'];
        for (let i = 0; i < 35; i++) {
            const particle = document.createElement('div');
            particle.classList.add('bubble'); // Changed to match the CSS class in login pages
            const size = Math.random() * 8 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.bottom = '-20px';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = 12 + Math.random() * 12 + 's';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.opacity = Math.random() * 0.4 + 0.1;
            container.appendChild(particle);
        }
    }
    createBubbles();
`;

const files = ['student-login.html', 'warden-login.html', 'register.html'];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Check if createBubbles already exists
        if (!content.includes('createBubbles()')) {
            // Find the last script tag or body end and inject it
            if (content.includes('</script>\n</body>')) {
                content = content.replace('</script>\n</body>', bubbleJS + '\n</script>\n</body>');
            } else if (content.includes('</body>')) {
                content = content.replace('</body>', '<script>\n' + bubbleJS + '\n</script>\n</body>');
            }
            
            fs.writeFileSync(file, content);
            console.log("Injected bubble effect into " + file);
        }
    }
}
