const fs = require('fs');
const content = fs.readFileSync('student-profile.html', 'utf8');
const start = content.indexOf('<script type="module">') + 22;
const end = content.lastIndexOf('</script>');
const script = content.substring(start, end);
fs.writeFileSync('test.js', script);

try {
    const { execSync } = require('child_process');
    execSync('node -c test.js');
    console.log('Syntax OK');
} catch (e) {
    console.log('Syntax Error');
    console.log(e.stderr.toString());
}
