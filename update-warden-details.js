const fs = require('fs');

if (fs.existsSync('warden-profile.html')) {
    let content = fs.readFileSync('warden-profile.html', 'utf8');

    const detailsRegex = /<div class="detail-item">\s*<i class="fas fa-id-card"><\/i>[\s\S]*?<span class="detail-label">Joined<\/span>\s*<span class="detail-value">-<\/span>\s*<\/div>/;

    const wardenDetails = `<div class="detail-item">
                        <i class="fas fa-id-badge"></i>
                        <span class="detail-label">Staff ID</span>
                        <span class="detail-value">-</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <span class="detail-label">Phone</span>
                        <span class="detail-value">-</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-building"></i>
                        <span class="detail-label">Block In-Charge</span>
                        <span class="detail-value">-</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span class="detail-label">Joined</span>
                        <span class="detail-value">-</span>
                    </div>`;

    if (content.match(detailsRegex)) {
        content = content.replace(detailsRegex, wardenDetails);
        fs.writeFileSync('warden-profile.html', content);
        console.log("Warden details updated to be more relevant!");
    } else {
        console.log("Could not find the details block in warden-profile.html");
    }
}
