const fs = require('fs');

const bubbleJS = `
<script>
    // Add smooth dynamic particles (seamless from welcome page)
    function createBubbles() {
        const container = document.getElementById('bubbleContainer');
        if (!container) return;
        const colors = ['#ccff00', '#ff3131', '#3b82f6', '#ffffff80'];
        for (let i = 0; i < 35; i++) {
            const particle = document.createElement('div');
            particle.classList.add('bubble'); 
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
</script>
</body>
`;

const files = ['student-login.html', 'warden-login.html'];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        if (!content.includes('createBubbles()')) {
            content = content.replace('</body>', bubbleJS);
            fs.writeFileSync(file, content);
            console.log("Injected bubble effect into " + file);
        }
    }
}
