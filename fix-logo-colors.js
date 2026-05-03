const fs = require('fs');

const loginHeaderSnippet = `
            <div class="form-header-logo" style="margin-bottom: 30px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <div class="brand-logo" style="font-size: 42px !important; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0; text-shadow: none !important;">
                    <span class="brand-blue" style="-webkit-text-stroke: 0 !important; text-shadow: none !important;">GM<span class="i-wrapper">I<span class="brand-dot"></span></span></span><span class="brand-lime" style="-webkit-text-stroke: 0 !important; text-shadow: none !important; color: #8cb300 !important;">HostelKu.</span>
                </div>
                <div class="tagline" style="color: #64748b !important; font-weight: 500; font-size: 0.9rem !important; margin-top: 8px; text-shadow: none !important; background: transparent !important;">
                    <i class="fas fa-door-open"></i> Smart Living, Seamless Management
                </div>
            </div>
`;

// 1. Update student-login.html
if (fs.existsSync('student-login.html')) {
    let content = fs.readFileSync('student-login.html', 'utf8');
    content = content.replace(/<div class="form-header-logo"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, loginHeaderSnippet);
    fs.writeFileSync('student-login.html', content);
}

// 2. Update warden-login.html
if (fs.existsSync('warden-login.html')) {
    let content = fs.readFileSync('warden-login.html', 'utf8');
    content = content.replace(/<div class="form-header-logo"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, loginHeaderSnippet);
    fs.writeFileSync('warden-login.html', content);
}

// 3. Update index.html
if (fs.existsSync('index.html')) {
    let content = fs.readFileSync('index.html', 'utf8');
    
    // Add morph-dark CSS
    if (!content.includes('.morph-dark')) {
        const morphCSS = `
        /* Dynamic transition classes for morphing */
        .header-overlay .brand-blue, .header-overlay .brand-lime, .header-overlay .tagline {
            transition: all 1.0s cubic-bezier(0.33, 1, 0.68, 1);
        }
        .header-overlay.morph-dark .brand-blue {
            -webkit-text-stroke: 0px transparent !important;
            text-shadow: none !important;
        }
        .header-overlay.morph-dark .brand-lime {
            -webkit-text-stroke: 0px transparent !important;
            text-shadow: none !important;
            color: #8cb300 !important;
        }
        .header-overlay.morph-dark .tagline {
            color: #64748b !important;
            text-shadow: none !important;
        }
        `;
        content = content.replace(/<\/style>\s*<style id="unified-logo-style">/, morphCSS + '\n    </style>\n    <style id="unified-logo-style">');
    }
    
    // Add morph-dark class to JS
    content = content.replace(/logo\.style\.transform = 'translate\(-50%, -50%\) scale\(0\.72\)';/, 
        `logo.style.transform = 'translate(-50%, -50%) scale(0.72)';\n                logo.classList.add('morph-dark');`);
                
    fs.writeFileSync('index.html', content);
}

console.log("Logo colors fixed for white background!");
