const fs = require('fs');

if (fs.existsSync('warden-profile.html')) {
    let content = fs.readFileSync('warden-profile.html', 'utf8');

    // Remove active class from dashboard
    content = content.replace(/<a href="warden-dashboard\.html" class="nav-item active">/, '<a href="warden-dashboard.html" class="nav-item">');
    
    fs.writeFileSync('warden-profile.html', content);
    console.log("Made Dashboard inactive in warden-profile.html sidebar.");
}
