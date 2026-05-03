const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Al Hafiz/public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let changed = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find incorrect pattern: <span class="gmi-wrapper"><span class="brand-blue">GMI</span><span class="brand-dot"></span></span><span class="brand-lime">HostelKu.</span> (could span multiple lines)
    // Actually just use regex
    const regex = /<span class="gmi-wrapper">\s*<span class="brand-blue">GMI<\/span>\s*<span class="brand-dot"><\/span>\s*<\/span>\s*<span[^>]*class="brand-lime"[^>]*>HostelKu\.<\/span>/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, '<span class="brand-blue">GM<span class="i-wrapper">I<span class="brand-dot"></span></span></span><span class="brand-lime">HostelKu.</span>');
        fs.writeFileSync(filePath, content);
        console.log(`Fixed logo structure in ${file}`);
        changed++;
    }
});

if (changed === 0) console.log('No files needed fixing.');
