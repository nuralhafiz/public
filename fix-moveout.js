const fs = require('fs');
const files = ['move-out.html'];

for(let f of files) {
    let c = fs.readFileSync(f, 'utf8');
    if(!c.includes('global.css')) {
        c = c.replace('</head>', '    <link rel="stylesheet" href="css/global.css?v=3">\n</head>');
        fs.writeFileSync(f, c);
        console.log('Fixed ' + f);
    }
}
