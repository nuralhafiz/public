const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('css/global.css?v=2"')) {
        content = content.replace(/css\/global\.css\?v=2["']/g, 'css/global.css?v=3"');
        fs.writeFileSync(file, content);
        console.log('Bumped CSS version to v=3 in ' + file);
    }
}
