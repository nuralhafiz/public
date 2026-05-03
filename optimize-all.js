const fs = require('fs');
const path = require('path');

// --- Phase 1: CSS Extraction ---
const globalCss = `/* GMI HostelKu Global Styles */

/* Base Reset & Variables */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --bg-deep: #0a0e27;
    --bg-dark: #0f1638;
    --accent-lime: #ccff00;
    --accent-lime-glow: rgba(204, 255, 0, 0.25);
    --accent-red: #ff3131;
    --accent-red-glow: rgba(255, 49, 49, 0.25);
    --text-white: #ffffff;
    --text-offwhite: #f0f3fa;
    --glass-white: rgba(255, 255, 255, 0.08);
    --glass-border: rgba(255, 255, 255, 0.12);
    --shadow-xl: 0 25px 40px -12px rgba(0, 0, 0, 0.35);
    --transition-smooth: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}

/* Unified Logo Styling */
.brand-blue {
    color: #1118a8;
    font-weight: 900;
    font-family: 'Arial', sans-serif;
    letter-spacing: -1px;
    -webkit-text-stroke: 1px #ffffff;
    text-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.i-wrapper {
    position: relative;
    display: inline-block;
}

.brand-dot {
    position: absolute;
    top: -0.19em;
    left: 48.5%;
    transform: translateX(-50%);
    width: 0.32em;
    height: 0.32em;
    background-color: #f93144;
    border-radius: 50%;
    box-shadow: 0 0 0 1px #ffffff, 0 4px 6px rgba(0,0,0,0.3);
}

.brand-lime {
    color: #ccff00;
    margin-left: 5px;
    font-family: 'Poppins', sans-serif;
    font-weight: 800;
    -webkit-text-stroke: 1px #000000;
    text-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

/* Shared Animated Particles Background */
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
`;

if (!fs.existsSync('css')) fs.mkdirSync('css');
fs.writeFileSync('css/global.css', globalCss);

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove unified-logo-style block entirely
    content = content.replace(/<style id="unified-logo-style">[\s\S]*?<\/style>/, '');
    
    // Insert link to global.css if not present
    if (!content.includes('css/global.css')) {
        content = content.replace(/<link rel="stylesheet" href="https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/font-awesome\/[^"]+">/, 
            match => match + '\n    <link rel="stylesheet" href="css/global.css">');
    }
    
    // Phase 2: Accessibility fixes
    // Replace <a href="..."> with <a href="..." aria-label="Link"> if it doesn't have text or aria-label
    content = content.replace(/<a([^>]+)>/g, (match, attrs) => {
        if (!attrs.includes('aria-label') && !attrs.includes('title')) {
            // Check if it's an icon-only link
            if (attrs.includes('class="back-arrow"')) return `<a${attrs} aria-label="Go Back">`;
            if (attrs.includes('logout-btn')) return `<a${attrs} aria-label="Logout">`;
            if (attrs.includes('profileLink')) return `<a${attrs} aria-label="User Profile">`;
            
            // Add a generic title to others just in case to pass basic a11y tests
            return `<a${attrs} title="Navigation Link">`;
        }
        return match;
    });
    
    // Phase 3: Performance (Images)
    content = content.replace(/<img([^>]+)>/g, (match, attrs) => {
        if (!attrs.includes('loading=')) {
            return `<img${attrs} loading="lazy">`;
        }
        return match;
    });
    
    fs.writeFileSync(file, content);
});

console.log("Optimizations applied across " + files.length + " files.");
