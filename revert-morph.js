const fs = require('fs');

// 1. Revert student-login.html
if (fs.existsSync('student-login.html')) {
    let content = fs.readFileSync('student-login.html', 'utf8');
    
    // Revert form header
    content = content.replace(/<div class="form-header-logo"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '<h2>Student Login</h2>');
    
    // Add logo-overlay back to image-section
    const logoOverlay = `
        <!-- LOGO AND TAGLINE -->
        <div class="logo-overlay">
            <div class="brand-logo">
            <span class="brand-blue">GM<span class="i-wrapper">I<span class="brand-dot"></span></span></span><span class="brand-lime">HostelKu.</span>
        </div>
            <div class="tagline">
                <i class="fas fa-door-open"></i> Seamless Living Experience
            </div>
        </div>
        `;
    
    // Insert before back-arrow
    if (!content.includes('class="logo-overlay"')) {
        content = content.replace(/<!-- BACK ARROW/, logoOverlay + '\n        <!-- BACK ARROW');
    }
    
    fs.writeFileSync('student-login.html', content);
}

// 2. Revert warden-login.html
if (fs.existsSync('warden-login.html')) {
    let content = fs.readFileSync('warden-login.html', 'utf8');
    
    // Revert form header
    content = content.replace(/<div class="form-header-logo"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '<h2>Warden Login</h2>');
    
    // Add logo-overlay back to image-section
    const logoOverlay = `
        <!-- LOGO AND TAGLINE -->
        <div class="logo-overlay">
            <div class="brand-logo">
            <span class="brand-blue">GM<span class="i-wrapper">I<span class="brand-dot"></span></span></span><span class="brand-lime">HostelKu.</span>
        </div>
            <div class="tagline">
                <i class="fas fa-door-open"></i> Seamless Living Experience
            </div>
        </div>
        `;
    
    if (!content.includes('class="logo-overlay"')) {
        content = content.replace(/<!-- BACK ARROW/, logoOverlay + '\n        <!-- BACK ARROW');
    }
    
    fs.writeFileSync('warden-login.html', content);
}

// 3. Revert index.html
if (fs.existsSync('index.html')) {
    let content = fs.readFileSync('index.html', 'utf8');
    
    // Revert header-overlay CSS
    content = content.replace(/\.header-overlay\s*{\s*position:\s*absolute;\s*top:\s*80px;\s*left:\s*50%;\s*transform:\s*translate\(-50%, -50%\);\s*z-index:\s*30;\s*text-align:\s*center;\s*width:\s*max-content;\s*pointer-events:\s*none;\s*}/, 
        `.header-overlay {
            position: absolute;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            text-align: center;
        }`);
        
    // Remove morph-dark CSS
    content = content.replace(/\/\* Dynamic transition classes for morphing \*\/[\s\S]*?(?=<\/style>\s*<style id="unified-logo-style">)/, '');
    
    // Revert click logic
    const oldLogicRegex = /\/\/\s*Enhance button click interactions for CROSS-PAGE MORPHING effect[\s\S]*?(?=\/\/\s*extra safety for any child link default)/;
    
    const simpleLogic = `// Enhance button click interactions (prevent double navigation, smooth delay)
        const wardenBtn = document.querySelector('#wardenLink .btn-action');
        const studentBtn = document.querySelector('#studentLink .btn-action');
        const wardenSection = document.getElementById('wardenLink');
        const studentSection = document.getElementById('studentLink');

        function handleNavigate(event, targetUrl) {
            if (!targetUrl) return;
            event.preventDefault();
            event.stopPropagation();
            // add micro-interaction
            const btn = event.currentTarget;
            if (btn && btn.classList.contains('btn-action')) {
                btn.style.transform = 'scale(0.97)';
                setTimeout(() => { btn.style.transform = ''; }, 120);
            }
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 160);
        }

        if (wardenBtn) {
            wardenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigate(e, 'warden-login.html?v=3');
            });
        }
        if (studentBtn) {
            studentBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigate(e, 'student-login.html?v=3');
            });
        }

        // ensure clicking on the whole section also leads to correct link (as backup)
        if (wardenSection) {
            wardenSection.addEventListener('click', (e) => {
                if (e.target.closest('.btn-action')) return;
                e.preventDefault();
                setTimeout(() => { window.location.href = 'warden-login.html?v=3'; }, 400);
            });
        }
        if (studentSection) {
            studentSection.addEventListener('click', (e) => {
                if (e.target.closest('.btn-action')) return;
                e.preventDefault();
                setTimeout(() => { window.location.href = 'student-login.html?v=3'; }, 400);
            });
        }

        `;
        
    content = content.replace(oldLogicRegex, simpleLogic);
    
    // Also remove the "let isTransitioning = false;" if it's outside the regex
    content = content.replace(/let isTransitioning = false;\s*/g, '');
    
    fs.writeFileSync('index.html', content);
}

console.log("Reverted to original behavior!");
