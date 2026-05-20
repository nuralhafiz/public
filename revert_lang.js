const fs = require('fs');

let content = fs.readFileSync('warden-rooms.html', 'utf8');

// HTML Dropdown text replacements
content = content.replace('<option value="occupied">Occupied (Ada Pelajar)</option>', '<option value="occupied">Partially Occupied</option>');
content = content.replace('<option value="full">Dah Penuh</option>', '<option value="full">Fully Occupied</option>');

// UI Badge fixes
content = content.replace("badgeText = 'Dah Penuh';", "badgeText = 'Fully Occupied';");
content = content.replace("badgeText = 'Occupied (Ada Pelajar)';", "badgeText = 'Partially Occupied';");

fs.writeFileSync('warden-rooms.html', content);
console.log('Language reverted!');
