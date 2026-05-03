const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// The CSS chunk to extract and move
const tapHintCssRegex = /\s*\.tap-hint\s*{\s*display:\s*none;[\s\S]*?100%\s*{\s*opacity:\s*0\.7;\s*transform:\s*translateY\(0\);\s*}\s*}/;

// Extract it (if it exists)
const match = html.match(tapHintCssRegex);

if (match) {
    const tapHintCss = match[0];
    
    // Remove it from its current position
    html = html.replace(tapHintCssRegex, '');
    
    // Insert it before the responsive touches media queries
    html = html.replace(/\s*\/\* responsive touches \*\//, `\n${tapHintCss}\n\n        /* responsive touches */`);
    
    fs.writeFileSync('index.html', html);
    console.log('Fixed tap-hint CSS order successfully.');
} else {
    console.log('Could not find tap-hint CSS.');
}
