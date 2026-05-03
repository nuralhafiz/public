const fs = require('fs');
const html = fs.readFileSync('move-out.html', 'utf8');
const scriptMatch = html.match(/<script type=\"module\">([\s\S]*?)<\/script>/);
if (scriptMatch) {
  try {
    const vm = require('vm');
    new vm.Script(scriptMatch[1].replace(/import /g, '// import '));
    console.log('No syntax errors found in module script.');
  } catch(e) {
    console.log('Syntax Error in move-out.html module script:', e);
  }
} else {
  console.log('No script found');
}
