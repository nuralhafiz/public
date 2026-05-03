const fs = require('fs');

const filesToAudit = [
    'index.html', 
    'student-login.html', 
    'warden-login.html', 
    'student-dashboard.html', 
    'warden-dashboard.html',
    'register.html'
];

let report = "=== GMI HostelKu Codebase Audit Report ===\n\n";

filesToAudit.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        report += `--- File: ${file} ---\n`;
        
        // 1. Meta Tags
        if (!content.includes('<meta name="viewport"')) {
            report += "  [Warning] Missing viewport meta tag.\n";
        }
        
        // 2. CSS Issues
        const styleTags = (content.match(/<style[^>]*>/g) || []).length;
        if (styleTags > 2) {
            report += `  [Warning] Excessive <style> tags (${styleTags}). Consider externalizing CSS.\n`;
        }
        const importants = (content.match(/!important/g) || []).length;
        if (importants > 10) {
            report += `  [Notice] High usage of !important (${importants} times). Could cause specificity hell.\n`;
        }
        
        // 3. Images
        const imgTags = content.match(/<img[^>]+src="([^">]+)"/g) || [];
        imgTags.forEach(img => {
            if (img.toLowerCase().includes('.jpg') || img.toLowerCase().includes('.png')) {
                report += `  [Optimization] Image ${img.match(/src="([^">]+)"/)[1]} could be converted to WebP for faster loading.\n`;
            }
        });
        
        // 4. Firebase Config Security Check
        if (content.includes('apiKey: "AIza')) {
            report += "  [Security Notice] Firebase API key exposed in HTML. Ensure Firebase Security Rules are strict.\n";
        }
        
        // 5. Hardcoded Paths or IDs
        if (content.includes('localhost') || content.includes('127.0.0.1')) {
            report += "  [Warning] Hardcoded localhost URL found.\n";
        }
        
        // 6. Accessibility
        const aTags = content.match(/<a[^>]+>/g) || [];
        let missingAriaLinks = 0;
        aTags.forEach(a => {
            if (!a.includes('aria-label') && !a.includes('title')) missingAriaLinks++;
        });
        if (missingAriaLinks > 0) {
            report += `  [Accessibility] ${missingAriaLinks} <a> tags missing aria-label or title.\n`;
        }
        
        report += "\n";
    } else {
        report += `--- File: ${file} (NOT FOUND) ---\n\n`;
    }
});

fs.writeFileSync('audit-report.txt', report);
console.log("Audit complete. Report generated at audit-report.txt");
