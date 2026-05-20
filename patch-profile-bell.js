const fs = require('fs');
let c = fs.readFileSync('student-profile.html', 'utf8');

const target = '<div style="display: flex; align-items: center; gap: 10px;">\\n            <a href="student-profile.html" class="avatar-container" title="Navigation Link">';
const replacement = '<div style="display: flex; align-items: center; gap: 10px;">\\n            <!-- Notification Bell -->\\n            <a href="#" class="notification-container" id="notificationBell" title="Notifications">\\n                <i class="fas fa-bell notification-bell"></i>\\n                <span class="notification-badge hidden" id="notificationBadge">0</span>\\n            </a>\\n            <a href="student-profile.html" class="avatar-container" title="Navigation Link">';

c = c.replace(target, replacement);
fs.writeFileSync('student-profile.html', c);
console.log('Fixed profile HTML bell');
