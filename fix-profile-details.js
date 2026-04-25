const fs = require('fs');

const files = ['student-profile.html', 'warden-profile.html'];

const detailsHtml = `
                    <div class="detail-item">
                        <i class="fas fa-id-card"></i>
                        <span class="detail-label">ID / IC Number</span>
                        <span class="detail-value">-</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <span class="detail-label">Phone</span>
                        <span class="detail-value">-</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span class="detail-label">Room</span>
                        <span class="detail-value">-</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span class="detail-label">Joined</span>
                        <span class="detail-value">-</span>
                    </div>
                </div>`;

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Find the end of the email detail item
        // It ends with:
        //                         </div>
        //                     </div>
        //                 </div>
        
        // Let's replace the closing tag of the profile-details div
        // We look for the <button class="edit-profile-btn"
        const buttonIndex = content.indexOf('<button class="edit-profile-btn"');
        if (buttonIndex !== -1) {
            // Find the </div> just before the button
            const divEndRegex = /<\/div>\s*<button class="edit-profile-btn"/;
            
            if (content.match(divEndRegex)) {
                content = content.replace(divEndRegex, detailsHtml + '\n\n                <button class="edit-profile-btn"');
                fs.writeFileSync(file, content);
                console.log("Restored blank details for " + file);
            }
        }
    }
}
