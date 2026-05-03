const fs = require('fs');

if (fs.existsSync('css/global.css')) {
    let css = fs.readFileSync('css/global.css', 'utf8');
    
    // Add logo sizing rules
    const sizingRules = `
/* Global Logo Sizing */
.brand-logo {
    font-size: 58px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    text-shadow: 0 4px 15px rgba(0,0,0,0.5);
    gap: 0;
}

.brand-container { 
    font-size: 36px !important; /* Increased from 24px as requested */
}
`;
    
    if (!css.includes('.brand-container {')) {
        css += sizingRules;
        fs.writeFileSync('css/global.css', css);
        console.log("Added logo sizing to global.css");
    }
}
