const fs = require('fs');

if (fs.existsSync('index.html')) {
    let content = fs.readFileSync('index.html', 'utf8');

    // Regex to match the entire click handling logic from line 467 to 526
    const oldLogicRegex = /\/\/\s*Enhance button click interactions[\s\S]*?(?=\/\/\s*Add smooth dynamic particles)/;

    const newLogic = `// Enhance button click interactions for CROSS-PAGE MORPHING effect
        const wardenBtn = document.querySelector('#wardenLink .btn-action');
        const studentBtn = document.querySelector('#studentLink .btn-action');
        const wardenSection = document.getElementById('wardenLink');
        const studentSection = document.getElementById('studentLink');

        function triggerMorphTransition(event, targetUrl, targetSectionId) {
            event.preventDefault();
            event.stopPropagation();
            
            // Find the opposite section to fade out
            const otherSectionId = targetSectionId === 'studentLink' ? 'wardenLink' : 'studentLink';
            const otherSection = document.getElementById(otherSectionId);
            const clickedSection = document.getElementById(targetSectionId);
            
            if (otherSection) {
                // Create white morphing overlay
                const overlay = document.createElement('div');
                overlay.style.position = 'absolute';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                // The gradient matches the login page background perfectly!
                overlay.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)';
                overlay.style.zIndex = '50';
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 0.4s ease-out';
                
                otherSection.appendChild(overlay);
                
                // Lock the expanded layout state so it doesn't snap back when moving mouse
                clickedSection.style.flex = '1.3';
                otherSection.style.flex = '1';
                
                // Trigger fade-in to white
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        overlay.style.opacity = '1';
                    });
                });
            }
            
            // Button click micro-interaction if a button was clicked
            const btn = event.currentTarget;
            if (btn && btn.classList && btn.classList.contains('btn-action')) {
                btn.style.transform = 'scale(0.97)';
                setTimeout(() => { btn.style.transform = ''; }, 120);
            }
            
            // Navigate right as the white fade completes
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 400);
        }

        if (wardenBtn) {
            wardenBtn.addEventListener('click', (e) => {
                triggerMorphTransition(e, 'warden-login.html?v=4', 'wardenLink');
            });
        }
        if (studentBtn) {
            studentBtn.addEventListener('click', (e) => {
                triggerMorphTransition(e, 'student-login.html?v=4', 'studentLink');
            });
        }

        if (wardenSection) {
            wardenSection.addEventListener('click', (e) => {
                if (e.target.closest('.btn-action')) return; 
                triggerMorphTransition(e, 'warden-login.html?v=4', 'wardenLink');
            });
        }
        if (studentSection) {
            studentSection.addEventListener('click', (e) => {
                if (e.target.closest('.btn-action')) return;
                triggerMorphTransition(e, 'student-login.html?v=4', 'studentLink');
            });
        }

        // extra safety for any child link default
        document.querySelectorAll('.role-section').forEach(section => {
            section.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') e.preventDefault();
            });
        });

        `;

    content = content.replace(oldLogicRegex, newLogic);

    fs.writeFileSync('index.html', content);
    console.log("Cross-page morphing transition injected!");
}
