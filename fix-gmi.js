const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const oldLogoRegex = /<span class="gmi-wrapper">\s*<span class="brand-blue">GMI<\/span>\s*<span class="brand-dot"><\/span>\s*<\/span>\s*<span class="brand-lime">HostelKu\.<\/span>/g;
const newLogo = '<span class="brand-blue">GM<span class="i-wrapper">I<span class="brand-dot"></span></span></span><span class="brand-lime">HostelKu.</span>';

for (let f of files) {
    let c = fs.readFileSync(f, 'utf8');
    if (oldLogoRegex.test(c)) {
        c = c.replace(oldLogoRegex, newLogo);
        fs.writeFileSync(f, c);
        console.log('Fixed logo in ' + f);
    }
}
