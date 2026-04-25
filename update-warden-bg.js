const fs = require('fs');

let html = fs.readFileSync('warden-login.html', 'utf8');

// Replace background images
html = html.replace(/images\/Hostel-1-1\.jpg/g, 'images/photo_2026-03-14_11-20-42.jpg');
html = html.replace(/images\/HOSTEL-BILIK-7-scaled\.jpg/g, 'images/photo_2026-03-14_11-20-43 (2).jpg');

fs.writeFileSync('warden-login.html', html);
console.log("Warden Login background images updated successfully!");
