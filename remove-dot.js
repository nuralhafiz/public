const fs = require('fs');
let c = fs.readFileSync('preview-logo.html', 'utf8');

const newOption = `
        <!-- Option 15 (Final) -->
        <div class="option">
            <div class="label">Opsyen 15 (Final): Kaca GH Bersih</div>
            <div class="desc">Rekaan "Kaca Terapung" G dan H tanpa titik merah. Lebih kemas dan minimalis.</div>
            <svg class="icon-large" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <rect x="15" y="20" width="50" height="50" rx="15" fill="#1118a8" stroke="#ffffff" stroke-width="2"/>
                <text x="40" y="55" font-family="Arial, sans-serif" font-weight="900" font-size="35" fill="#ffffff" text-anchor="middle">G</text>
                
                <rect x="40" y="45" width="45" height="45" rx="15" fill="#ccff00" opacity="0.9" stroke="#000000" stroke-width="2"/>
                <text x="62.5" y="78" font-family="Poppins, Arial, sans-serif" font-weight="900" font-size="32" fill="#000000" text-anchor="middle">H</text>
            </svg>
            <div class="browser-tab">
                <div class="tab">
                    <svg class="icon-small" viewBox="0 0 100 100">
                        <rect x="15" y="20" width="50" height="50" rx="15" fill="#1118a8" stroke="#ffffff" stroke-width="2"/>
                        <text x="40" y="55" font-family="Arial, sans-serif" font-weight="900" font-size="35" fill="#ffffff" text-anchor="middle">G</text>
                        <rect x="40" y="45" width="45" height="45" rx="15" fill="#ccff00" opacity="0.9" stroke="#000000" stroke-width="2"/>
                        <text x="62.5" y="78" font-family="Poppins, Arial, sans-serif" font-weight="900" font-size="32" fill="#000000" text-anchor="middle">H</text>
                    </svg>
                    Student Dashboard
                </div>
            </div>
        </div>
    </div>
`;
c = c.replace(/    <\/div>\s*<\/body>/, newOption + '\n</body>');
fs.writeFileSync('preview-logo.html', c);
