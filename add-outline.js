const fs = require('fs');

const outlineCss = `
            -webkit-text-stroke: 0.6px #000;
            text-shadow: -0.6px -0.6px 0 #000, 0.6px -0.6px 0 #000, -0.6px 0.6px 0 #000, 0.6px 0.6px 0 #000;
        }`;

// Fix student-login.html
let studentHtml = fs.readFileSync('student-login.html', 'utf8');
studentHtml = studentHtml.replace(/box-shadow: 0 6px 18px rgba\(79, 172, 254, 0\.35\);\s*}/g, `box-shadow: 0 6px 18px rgba(79, 172, 254, 0.35);${outlineCss}`);
fs.writeFileSync('student-login.html', studentHtml);

// Fix warden-login.html
let wardenHtml = fs.readFileSync('warden-login.html', 'utf8');
wardenHtml = wardenHtml.replace(/box-shadow: 0 6px 18px rgba\(79, 172, 254, 0\.35\);\s*}/g, `box-shadow: 0 6px 18px rgba(79, 172, 254, 0.35);${outlineCss}`);
fs.writeFileSync('warden-login.html', wardenHtml);

// Fix index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/box-shadow: 0 6px 18px rgba\(79, 172, 254, 0\.35\);\s*}/g, `box-shadow: 0 6px 18px rgba(79, 172, 254, 0.35);${outlineCss}`);
fs.writeFileSync('index.html', indexHtml);

console.log('Added outline successfully');
