const fs = require('fs');

const loginHeaderSnippet = `
            <div class="form-header-logo" style="margin-bottom: 30px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <div class="brand-logo" style="font-size: 42px !important; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0; text-shadow: none !important;">
                    <span class="brand-blue">GM<span class="i-wrapper">I<span class="brand-dot"></span></span></span><span class="brand-lime">HostelKu.</span>
                </div>
                <div class="tagline" style="color: #64748b !important; font-weight: 500; font-size: 0.9rem !important; margin-top: 8px; text-shadow: none !important; background: transparent !important;">
                    <i class="fas fa-door-open"></i> Smart Living, Seamless Management
                </div>
            </div>
`;

// 1. Update student-login.html
if (fs.existsSync('student-login.html')) {
    let content = fs.readFileSync('student-login.html', 'utf8');
    
    // Remove logo-overlay
    content = content.replace(/<!-- LOGO AND TAGLINE[\s\S]*?<\/div>\s*<\/div>/, '');
    
    // Replace Student Login h2
    content = content.replace(/<h2>Student Login<\/h2>/, loginHeaderSnippet);
    
    fs.writeFileSync('student-login.html', content);
}

// 2. Update warden-login.html
if (fs.existsSync('warden-login.html')) {
    let content = fs.readFileSync('warden-login.html', 'utf8');
    
    // Remove logo-overlay
    content = content.replace(/<!-- LOGO AND TAGLINE[\s\S]*?<\/div>\s*<\/div>/, '');
    
    // Replace Warden Login h2
    content = content.replace(/<h2>Warden Login<\/h2>/, loginHeaderSnippet);
    
    fs.writeFileSync('warden-login.html', content);
}

// 3. Update index.html coordinates
if (fs.existsSync('index.html')) {
    let content = fs.readFileSync('index.html', 'utf8');
    
    content = content.replace(/logo\.style\.top = '50%';\s*if \(targetSectionId === 'studentLink'\) \{\s*logo\.style\.left = '71\.74%';.*?\s*\} else \{\s*logo\.style\.left = '28\.26%';.*?\s*\}/, 
        `logo.style.top = '25vh'; // Approx position of form header
                logo.style.transform = 'translate(-50%, -50%) scale(0.72)';
                if (targetSectionId === 'studentLink') {
                    logo.style.left = '21.74%'; // Center of left form
                } else {
                    logo.style.left = '78.26%'; // Center of right form
                }`);
                
    fs.writeFileSync('index.html', content);
}

console.log("Logo moved to form header!");
