const fs = require('fs');

if (fs.existsSync('index.html')) {
    let content = fs.readFileSync('index.html', 'utf8');

    const triggerFuncRegex = /function triggerMorphTransition\(event, targetUrl, targetSectionId\) \{[\s\S]*?(?=if \(wardenBtn\))/;

    const newFunc = `function triggerMorphTransition(event, targetUrl, targetSectionId) {
            event.preventDefault();
            event.stopPropagation();
            
            const isMobile = window.innerWidth <= 768;

            // --- MOBILE BEHAVIOR (Classic fast redirect) ---
            if (isMobile) {
                const btn = event.currentTarget;
                if (btn && btn.classList && btn.classList.contains('btn-action')) {
                    btn.style.transform = 'scale(0.97)';
                    setTimeout(() => { btn.style.transform = ''; }, 120);
                }
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400);
                return;
            }
            
            // --- DESKTOP BEHAVIOR (Advanced Morphing) ---
            const otherSectionId = targetSectionId === 'studentLink' ? 'wardenLink' : 'studentLink';
            const otherSection = document.getElementById(otherSectionId);
            const clickedSection = document.getElementById(targetSectionId);
            
            if (otherSection) {
                // White Morph
                const overlay = document.createElement('div');
                overlay.style.position = 'absolute';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)';
                overlay.style.zIndex = '50';
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 0.8s ease-out';
                otherSection.appendChild(overlay);
                
                clickedSection.style.flex = '1.3';
                otherSection.style.flex = '1';
                
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        overlay.style.opacity = '1';
                    });
                });
            }

            // Animate Logo to new position
            const logo = document.querySelector('.header-overlay');
            if (logo) {
                logo.style.transition = 'all 1.0s cubic-bezier(0.33, 1, 0.68, 1)';
                logo.style.top = '50%';
                if (targetSectionId === 'studentLink') {
                    logo.style.left = '71.74%'; // Center of the right 56.5% section
                } else {
                    logo.style.left = '28.26%'; // Center of the left 56.5% section
                }
            }
            
            const btn = event.currentTarget;
            if (btn && btn.classList && btn.classList.contains('btn-action')) {
                btn.style.transform = 'scale(0.97)';
                setTimeout(() => { btn.style.transform = ''; }, 120);
            }
            
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 1000);
        }

        `;

    content = content.replace(triggerFuncRegex, newFunc);

    fs.writeFileSync('index.html', content);
    console.log("Morphing restricted to Desktop only!");
}
