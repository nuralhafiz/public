const fs = require('fs');
let c = fs.readFileSync('preview-logo.html', 'utf8');

const newOptions = `
        <!-- Option 15A -->
        <div class="option">
            <div class="label">15A: Titik di Atas Kanan 'G'</div>
            <div class="desc">Titik merah diletakkan seimbang di bucu kanan atas blok biru.</div>
            <svg class="icon-large" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <rect x="15" y="20" width="50" height="50" rx="15" fill="#1118a8" stroke="#ffffff" stroke-width="2"/>
                <text x="40" y="55" font-family="Arial, sans-serif" font-weight="900" font-size="35" fill="#ffffff" text-anchor="middle">G</text>
                <!-- Dot at top right inside the blue block -->
                <circle cx="53" cy="30" r="6" fill="#f93144" stroke="#1118a8" stroke-width="1.5"/>
                <rect x="40" y="45" width="45" height="45" rx="15" fill="#ccff00" opacity="0.9" stroke="#000000" stroke-width="2"/>
                <text x="62.5" y="78" font-family="Poppins, Arial, sans-serif" font-weight="900" font-size="32" fill="#000000" text-anchor="middle">H</text>
            </svg>
            <div class="browser-tab">
                <div class="tab">
                    <svg class="icon-small" viewBox="0 0 100 100">
                        <rect x="15" y="20" width="50" height="50" rx="15" fill="#1118a8" stroke="#ffffff" stroke-width="2"/>
                        <text x="40" y="55" font-family="Arial, sans-serif" font-weight="900" font-size="35" fill="#ffffff" text-anchor="middle">G</text>
                        <circle cx="53" cy="30" r="6" fill="#f93144" stroke="#1118a8" stroke-width="1.5"/>
                        <rect x="40" y="45" width="45" height="45" rx="15" fill="#ccff00" opacity="0.9" stroke="#000000" stroke-width="2"/>
                        <text x="62.5" y="78" font-family="Poppins, Arial, sans-serif" font-weight="900" font-size="32" fill="#000000" text-anchor="middle">H</text>
                    </svg>
                    Student Dashboard
                </div>
            </div>
        </div>

        <!-- Option 15B -->
        <div class="option">
            <div class="label">15B: Titik Terapung Tengah</div>
            <div class="desc">Titik merah bersambung di titik pertemuan antara G dan H.</div>
            <svg class="icon-large" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <rect x="15" y="20" width="50" height="50" rx="15" fill="#1118a8" stroke="#ffffff" stroke-width="2"/>
                <text x="40" y="55" font-family="Arial, sans-serif" font-weight="900" font-size="35" fill="#ffffff" text-anchor="middle">G</text>
                <rect x="40" y="45" width="45" height="45" rx="15" fill="#ccff00" opacity="0.9" stroke="#000000" stroke-width="2"/>
                <text x="62.5" y="78" font-family="Poppins, Arial, sans-serif" font-weight="900" font-size="32" fill="#000000" text-anchor="middle">H</text>
                <!-- Dot floating right at the top left corner of the Lime block -->
                <circle cx="40" cy="45" r="7.5" fill="#f93144" stroke="#ffffff" stroke-width="2"/>
            </svg>
            <div class="browser-tab">
                <div class="tab">
                    <svg class="icon-small" viewBox="0 0 100 100">
                        <rect x="15" y="20" width="50" height="50" rx="15" fill="#1118a8" stroke="#ffffff" stroke-width="2"/>
                        <text x="40" y="55" font-family="Arial, sans-serif" font-weight="900" font-size="35" fill="#ffffff" text-anchor="middle">G</text>
                        <rect x="40" y="45" width="45" height="45" rx="15" fill="#ccff00" opacity="0.9" stroke="#000000" stroke-width="2"/>
                        <text x="62.5" y="78" font-family="Poppins, Arial, sans-serif" font-weight="900" font-size="32" fill="#000000" text-anchor="middle">H</text>
                        <circle cx="40" cy="45" r="7.5" fill="#f93144" stroke="#ffffff" stroke-width="2"/>
                    </svg>
                    Student Dashboard
                </div>
            </div>
        </div>

        <!-- Option 15C -->
        <div class="option">
            <div class="label">15C: Titik di Atas 'H'</div>
            <div class="desc">Titik merah diletakkan ala-ala Notifikasi di atas blok hijau.</div>
            <svg class="icon-large" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <rect x="15" y="20" width="50" height="50" rx="15" fill="#1118a8" stroke="#ffffff" stroke-width="2"/>
                <text x="40" y="55" font-family="Arial, sans-serif" font-weight="900" font-size="35" fill="#ffffff" text-anchor="middle">G</text>
                <rect x="40" y="45" width="45" height="45" rx="15" fill="#ccff00" opacity="0.9" stroke="#000000" stroke-width="2"/>
                <text x="62.5" y="78" font-family="Poppins, Arial, sans-serif" font-weight="900" font-size="32" fill="#000000" text-anchor="middle">H</text>
                <!-- Dot floating on top right of the Lime block -->
                <circle cx="85" cy="45" r="8" fill="#f93144" stroke="#ffffff" stroke-width="2"/>
            </svg>
            <div class="browser-tab">
                <div class="tab">
                    <svg class="icon-small" viewBox="0 0 100 100">
                        <rect x="15" y="20" width="50" height="50" rx="15" fill="#1118a8" stroke="#ffffff" stroke-width="2"/>
                        <text x="40" y="55" font-family="Arial, sans-serif" font-weight="900" font-size="35" fill="#ffffff" text-anchor="middle">G</text>
                        <rect x="40" y="45" width="45" height="45" rx="15" fill="#ccff00" opacity="0.9" stroke="#000000" stroke-width="2"/>
                        <text x="62.5" y="78" font-family="Poppins, Arial, sans-serif" font-weight="900" font-size="32" fill="#000000" text-anchor="middle">H</text>
                        <circle cx="85" cy="45" r="8" fill="#f93144" stroke="#ffffff" stroke-width="2"/>
                    </svg>
                    Student Dashboard
                </div>
            </div>
        </div>
    </div>
`;
c = c.replace(/    <\/div>\s*<\/body>/, newOptions + '\n</body>');
fs.writeFileSync('preview-logo.html', c);
