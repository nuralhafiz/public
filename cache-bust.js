const fs = require('fs');

if (fs.existsSync('index.html')) {
    let content = fs.readFileSync('index.html', 'utf8');

    // Add cache-busting query parameter to navigation links
    content = content.replace(/window\.location\.href = 'warden-login\.html';/g, "window.location.href = 'warden-login.html?v=3';");
    content = content.replace(/window\.location\.href = 'student-login\.html';/g, "window.location.href = 'student-login.html?v=3';");

    fs.writeFileSync('index.html', content);
    console.log("Cache busting applied to index.html links!");
}
