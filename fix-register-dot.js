const fs = require('fs');

if (fs.existsSync('register.html')) {
    let content = fs.readFileSync('register.html', 'utf8');

    // Fix the brand-dot CSS to match the perfect alignment
    const oldDotCss = /\.brand-dot\s*\{\s*color:\s*red;\s*font-size:\s*24px;\s*margin:\s*0\s*2px;\s*position:\s*relative;\s*top:\s*-12px;\s*\}/;
    
    const newDotCss = `.brand-dot {
            color: #ff3131;
            font-size: 20px;
            position: absolute;
            top: -2px;
            left: 50%;
            transform: translateX(11px);
        }
        
        .brand-logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }`;

    content = content.replace(oldDotCss, newDotCss);
    
    // Also remove the old .brand-logo if it exists so we don't duplicate
    const oldLogoCss = /\.brand-logo\s*\{\s*font-size:\s*28px;\s*font-weight:\s*700;\s*margin-bottom:\s*15px;\s*display:\s*flex;\s*align-items:\s*center;\s*justify-content:\s*center;\s*\}/;
    content = content.replace(oldLogoCss, '');

    // Replace the HTML logo so it uses the absolute positioning
    const oldHtmlLogo = /<span class="brand-blue">GMI<\/span><span class="brand-dot">•<\/span><span class="brand-lime">HostelKu\.<\/span>/;
    const newHtmlLogo = `<span class="brand-blue">GMI</span>
            <span class="brand-dot">•</span>
            <span class="brand-lime">HostelKu</span>`;
    content = content.replace(oldHtmlLogo, newHtmlLogo);

    fs.writeFileSync('register.html', content);
    console.log("Brand dot fixed in register.html");
}
