const fs = require('fs');

let content = fs.readFileSync('c:/Users/Al Hafiz/public/warden-students.html', 'utf8');

const imgRegex = /<img id="headerUserAvatar"[^>]*>/;
if (imgRegex.test(content)) {
    content = content.replace(imgRegex, '<i class="fas fa-user-shield"></i>');
    console.log("Header image replaced with icon!");
} else {
    console.log("Header image not found.");
}

fs.writeFileSync('c:/Users/Al Hafiz/public/warden-students.html', content);
