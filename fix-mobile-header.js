const fs = require('fs');

// 1. Append Media Query for smaller logo on Mobile
const cssFix = `

/* Mobile Logo Size Fix */
@media (max-width: 480px) {
    .brand-container {
        font-size: 20px !important;
    }
    header {
        padding: 0 15px !important;
    }
}
`;
fs.appendFileSync('css/global.css', cssFix);
console.log('Appended mobile logo fix to global.css');

// 2. Bump CSS version from v=3 to v=4 in all HTML files
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('css/global.css?v=3')) {
        content = content.replace(/css\/global\.css\?v=3["']/g, 'css/global.css?v=4"');
        fs.writeFileSync(file, content);
        console.log('Bumped CSS version to v=4 in ' + file);
    }
}
