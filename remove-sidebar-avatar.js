const fs = require('fs');

let content = fs.readFileSync('c:/Users/Al Hafiz/public/warden-students.html', 'utf8');

// Replace the extraneous sidebar block
const sidebarRegex = /<div class="warden-profile-sidebar"[\s\S]*?<\/div>\s*<\/div>\s*<div class="nav-menu">/;
if (sidebarRegex.test(content)) {
    content = content.replace(sidebarRegex, '<div class="nav-menu">');
    console.log("Sidebar profile block removed!");
} else {
    console.log("Sidebar profile block not found.");
}

fs.writeFileSync('c:/Users/Al Hafiz/public/warden-students.html', content);
