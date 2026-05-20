const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname);

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    
    // Process warden-*.html files and move-out.html just in case
    const targetFiles = files.filter(file => file.startsWith('warden-') && file.endsWith('.html'));
    
    let updatedCount = 0;

    targetFiles.forEach(file => {
        const filePath = path.join(directoryPath, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // 1. Ensure global.css is linked
        if (!content.includes('href="css/global.css"')) {
            content = content.replace(
                /<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.0\.0\/css\/all\.min\.css">/,
                '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">\n    <link rel="stylesheet" href="css/global.css">'
            );
        }

        // 2. Update the logo HTML structure
        const oldLogoRegex = /<span class="gmi-wrapper">\s*<span class="brand-blue">GMI<\/span>\s*<span class="brand-dot"><\/span>\s*<\/span>\s*<span class="brand-lime">HostelKu\.<\/span>/g;
        const newLogoHTML = '<span class="brand-blue">GM<span class="i-wrapper">I<span class="brand-dot"></span></span></span><span class="brand-lime">HostelKu.</span>';
        
        content = content.replace(oldLogoRegex, newLogoHTML);

        // 3. Remove the old inline logo styles from unified-logo-style
        // We will remove anything from .gmi-wrapper up to the closing } of .brand-container
        const logoStylesRegex = /\.gmi-wrapper\s*\{[\s\S]*?\.brand-container\s*\{\s*font-size:\s*32px\s*!important;\s*\}\n?/g;
        content = content.replace(logoStylesRegex, '');

        // 4. If unified-logo-style is now empty (or only contains whitespace), remove the tag entirely
        const emptyStyleRegex = /<style id="unified-logo-style">\s*<\/style>/g;
        content = content.replace(emptyStyleRegex, '');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${file}`);
            updatedCount++;
        }
    });

    console.log(`Total files updated: ${updatedCount}`);
});
