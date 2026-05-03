const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the Warden button and add tap-hint
html = html.replace(
    /<div class="btn-action btn-warden" data-role="warden">\s*<span>Login<\/span>\s*<\/div>/,
    `<div class="tap-hint"><i class="fas fa-hand-pointer" style="margin-right: 5px;"></i> Tap to Login</div>`
);

// 2. Remove the Student button and add tap-hint
html = html.replace(
    /<div class="btn-action btn-student" data-role="student">\s*<span>Login<\/span>\s*<\/div>/,
    `<div class="tap-hint"><i class="fas fa-hand-pointer" style="margin-right: 5px;"></i> Tap to Login</div>`
);

// 3. Add CSS for tap-hint and hide tooltip on mobile
const cssToAdd = `
        .tap-hint {
            display: none;
            font-size: 0.9rem;
            margin-top: 15px;
            font-weight: 600;
            opacity: 0.9;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #ffffff;
            text-shadow: 0 2px 10px rgba(0,0,0,0.5);
            animation: pulseHint 2s infinite;
        }

        @keyframes pulseHint {
            0% { opacity: 0.7; transform: translateY(0); }
            50% { opacity: 1; transform: translateY(3px); }
            100% { opacity: 0.7; transform: translateY(0); }
        }
`;

// Insert the new CSS before </style>
html = html.replace(/(\s*)(<\/style>\s*<style id="unified-logo-style">)/, `$1${cssToAdd}$2`);

// 4. Modify max-width: 780px to hide tooltip and show tap-hint
const media780 = `        @media (max-width: 780px) {
            .brand-logo { font-size: 32px; }
            
            .tagline { font-size: 0.8rem; margin-top: 8px; }
            .content h2 { font-size: 2rem; letter-spacing: 2px; }
            .btn-action { padding: 10px 30px; font-size: 12px; }
            .header-overlay { top: 20px; }
            .hint-tooltip { display: none !important; }
            .tap-hint { display: block; }
        }`;
html = html.replace(/@media \(max-width: 780px\) \{[\s\S]*?\.header-overlay { top: 20px; }\s*}/, media780);

// 5. Also hide tooltip in 550px media query just to be safe
const media550 = `        @media (max-width: 550px) {
            .split-container { flex-direction: column; }
            .role-section { min-height: 50vh; }
            .role-section:hover { flex: 1.1; }
            .content h2 { font-size: 1.8rem; }
            .brand-logo { font-size: 28px; }
            .hint-tooltip { display: none !important; }
            .tap-hint { display: block; }
        }`;
html = html.replace(/@media \(max-width: 550px\) \{[\s\S]*?\.brand-logo { font-size: 28px; }\s*}/, media550);

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully.');
