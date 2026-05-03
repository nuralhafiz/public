const fs = require('fs');

const particleCSS = `
    <style>
        .floating-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        .particle {
            position: absolute;
            background: rgba(204, 255, 0, 0.2);
            border-radius: 50%;
            filter: blur(3px);
            animation: float 20s infinite;
        }
        @keyframes float {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            20% { opacity: 0.5; }
            80% { opacity: 0.3; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
    </style>
`;

const particleJS = `
    <script>
        function createParticles() {
            const container = document.getElementById('particlesContainer');
            if (!container) return;
            const colors = ['#ccff00', '#ff3131', '#3b82f6', '#ffffff80'];
            for (let i = 0; i < 35; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
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
        createParticles();
    </script>
`;

const files = ['student-login.html', 'warden-login.html', 'register.html'];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // 1. Remove old bubble CSS
        content = content.replace(/\/\* FLOATING BUBBLE EFFECT \*\/[\s\S]*?\.image-section::before/g, '.image-section::before');
        
        // 2. Remove old bubble HTML container
        content = content.replace(/<div class="floating-bubbles" id="bubbleContainer"><\/div>/g, '');

        // 3. Remove old bubble JS
        content = content.replace(/\/\/\s*Enhanced floating bubbles[\s\S]*?createBubbles\(\);/g, '');
        // Also catch simple createBubbles logic if present
        content = content.replace(/function createBubbles\(\) {[\s\S]*?}\s*createBubbles\(\);/g, '');

        // 4. Inject new particle HTML after <body>
        if (!content.includes('id="particlesContainer"')) {
            content = content.replace(/<body>/, '<body>\n<div class="floating-bg" id="particlesContainer"></div>');
        }

        // 5. Inject new CSS just before </head>
        if (!content.includes('animation: float 20s infinite')) {
            content = content.replace(/<\/head>/, particleCSS + '</head>');
        }

        // 6. Inject new JS just before </body>
        if (!content.includes('function createParticles()')) {
            content = content.replace(/<\/body>/, particleJS + '\n</body>');
        }
        
        // Let's also make sure .login-section has z-index so particles float behind the form box (form box should be above)
        if (!content.includes('.login-section {\n            z-index: 10;')) {
            content = content.replace(/\.login-section {/, '.login-section {\n            z-index: 10;');
        }

        fs.writeFileSync(file, content);
    }
}
console.log("Unified particle effect applied!");
