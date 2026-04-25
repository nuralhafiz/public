const fs = require('fs');
let content = fs.readFileSync('c:/Users/Al Hafiz/public/warden-students.html', 'utf8');

const target = '<div class="nav-menu">\r\n                <a href="warden-dashboard.html" class="nav-item"><i class="fas fa-home"></i> Dashboard</a>';
const target2 = '<div class="nav-menu">\n                <a href="warden-dashboard.html" class="nav-item"><i class="fas fa-home"></i> Dashboard</a>';
const replacement = '<div class="nav-menu">\n                <a href="warden-profile.html" class="nav-item"><i class="fas fa-user"></i> My Profile</a>\n                <a href="warden-dashboard.html" class="nav-item"><i class="fas fa-home"></i> Dashboard</a>';

if (content.includes(target)) {
    content = content.replace(target, replacement);
} else if (content.includes(target2)) {
    content = content.replace(target2, replacement);
} else {
    // regex fallback
    content = content.replace(/<div class="nav-menu">\s*<a href="warden-dashboard\.html"/, '<div class="nav-menu">\n                <a href="warden-profile.html" class="nav-item"><i class="fas fa-user"></i> My Profile</a>\n                <a href="warden-dashboard.html"');
}

fs.writeFileSync('c:/Users/Al Hafiz/public/warden-students.html', content);
console.log('Profile link added!');
