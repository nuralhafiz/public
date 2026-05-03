const fs = require('fs');

const studentFiles = ['student-login.html', 'register.html'];
const wardenFiles = ['warden-login.html'];

function processFile(file, isWarden) {
    if (!fs.existsSync(file)) return;
    
    let content = fs.readFileSync(file, 'utf8');

    // Remove old flex properties
    content = content.replace(/\.login-section\s*{\s*flex:\s*[\d\.]+;/, '.login-section {\n            flex: none;');
    content = content.replace(/\.image-section\s*{\s*flex:\s*[\d\.]+;/, '.image-section {\n            flex: none;');

    // Inject explicit widths
    if (isWarden) {
        // Warden: Left (Login) is larger (56.522%), Right (Image) is smaller (43.478%)
        content = content.replace(/\.login-section\s*{/, '.login-section {\n            width: 56.522%;');
        content = content.replace(/\.image-section\s*{/, '.image-section {\n            width: 43.478%;');
    } else {
        // Student/Register: Left (Login) is smaller (43.478%), Right (Image) is larger (56.522%)
        content = content.replace(/\.login-section\s*{/, '.login-section {\n            width: 43.478%;');
        content = content.replace(/\.image-section\s*{/, '.image-section {\n            width: 56.522%;');
    }

    // Fix mobile responsive widths
    if (!content.includes('width: 100% !important;')) {
        content = content.replace(/@media \(max-width: 768px\)\s*{[\s\S]*?\.login-section\s*{/, 
            '$&\n            width: 100% !important;');
        content = content.replace(/@media \(max-width: 768px\)\s*{[\s\S]*?\.image-section\s*{/, 
            '$&\n            width: 100% !important;');
    }

    fs.writeFileSync(file, content);
}

studentFiles.forEach(f => processFile(f, false));
wardenFiles.forEach(f => processFile(f, true));

console.log("Forced exact percentage widths applied!");
