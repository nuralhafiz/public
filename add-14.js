const fs = require('fs');

let c = fs.readFileSync('preview-logo.html', 'utf8');

const newOptions = `
        <!-- Option 14: Glassmorphism GMIHostelKu Edition -->
        <div class="option">
            <div class="label">Opsyen 14: Kaca Terapung (Edisi GMI)</div>
            <div class="desc">Versi yang dinaik taraf menggunakan KESEMUA warna rasmi logo GMI HostelKu.</div>
            <svg class="icon-large" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <circle cx="38" cy="42" r="28" fill="#1118a8" stroke="#ffffff" stroke-width="3" />
                <circle cx="70" cy="22" r="8" fill="#f93144" stroke="#ffffff" stroke-width="2" />
                <rect x="35" y="38" width="50" height="50" rx="12" fill="#ccff00" opacity="0.95" stroke="#000000" stroke-width="2"/>
                <text x="60" y="74" font-family="Poppins, Arial, sans-serif" font-weight="900" font-size="38" fill="#000000" stroke="#ffffff" stroke-width="1" text-anchor="middle">H</text>
            </svg>
            <div class="browser-tab">
                <div class="tab">
                    <svg class="icon-small" viewBox="0 0 100 100">
                        <circle cx="38" cy="42" r="28" fill="#1118a8" stroke="#ffffff" stroke-width="3" />
                        <circle cx="70" cy="22" r="8" fill="#f93144" stroke="#ffffff" stroke-width="2" />
                        <rect x="35" y="38" width="50" height="50" rx="12" fill="#ccff00" opacity="0.95" stroke="#000000" stroke-width="2"/>
                        <text x="60" y="74" font-family="Poppins, Arial, sans-serif" font-weight="900" font-size="38" fill="#000000" stroke="#ffffff" stroke-width="1" text-anchor="middle">H</text>
                    </svg>
                    Student Dashboard
                </div>
            </div>
        </div>

        <!-- Option 15: Glassmorphism (G & H) -->
        <div class="option">
            <div class="label">Opsyen 15: Kaca Terapung (GH)</div>
            <div class="desc">Gabungan G dan H menggunakan tema warna yang sama.</div>
            <svg class="icon-large" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <rect x="15" y="20" width="50" height="50" rx="15" fill="#1118a8" stroke="#ffffff" stroke-width="2"/>
                <text x="40" y="55" font-family="Arial, sans-serif" font-weight="900" font-size="35" fill="#ffffff" text-anchor="middle">G</text>
                <circle cx="70" cy="25" r="7" fill="#f93144" stroke="#ffffff" stroke-width="2"/>
                <rect x="40" y="45" width="45" height="45" rx="15" fill="#ccff00" opacity="0.9" stroke="#000000" stroke-width="2"/>
                <text x="62.5" y="78" font-family="Poppins, Arial, sans-serif" font-weight="900" font-size="32" fill="#000000" text-anchor="middle">H</text>
            </svg>
            <div class="browser-tab">
                <div class="tab">
                    <svg class="icon-small" viewBox="0 0 100 100">
                        <rect x="15" y="20" width="50" height="50" rx="15" fill="#1118a8" stroke="#ffffff" stroke-width="2"/>
                        <text x="40" y="55" font-family="Arial, sans-serif" font-weight="900" font-size="35" fill="#ffffff" text-anchor="middle">G</text>
                        <circle cx="70" cy="25" r=\"7\" fill=\"#f93144\" stroke=\"#ffffff\" stroke-width=\"2\"/>
                        <rect x="40" y="45" width="45" height="45" rx="15" fill="#ccff00" opacity="0.9" stroke="#000000" stroke-width="2"/>
                        <text x="62.5" y="78" font-family="Poppins, Arial, sans-serif" font-weight="900" font-size="32" fill="#000000" text-anchor="middle">H</text>
                    </svg>
                    Student Dashboard
                </div>
            </div>
        </div>
    </div>
`;

c = c.replace(/    <\/div>\s*<\/body>/, newOptions + '\n</body>');
fs.writeFileSync('preview-logo.html', c);
console.log("Done");
