const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !f.includes('preview-logo.html'));

for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if favicon already exists
    if (!content.includes('favicon.svg')) {
        // Insert favicon link before closing </head>
        content = content.replace('</head>', '    <link rel="icon" href="/favicon.svg" type="image/svg+xml">\n</head>');
        fs.writeFileSync(file, content);
        console.log('Added favicon to ' + file);
    }
}
