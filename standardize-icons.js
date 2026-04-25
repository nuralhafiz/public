const fs = require('fs');

const files = [
    'warden-dashboard.html',
    'warden-applications.html',
    'warden-moveout.html',
    'warden-maintenance.html',
    'warden-rooms.html',
    'warden-reports.html',
    'warden-students.html',
    'warden-profile.html'
];

const unifiedIconStyle = `
    <style id="unified-icon-style">
        /* Global Icon Standardization */
        .nav-item i { color: #64748b; transition: color 0.3s; }
        .nav-item:hover i, .nav-item.active i { color: white; }
        .page-header h2 i { color: #2d72d2; }
        .welcome-banner h2 i { color: white; }
        .quick-action-btn i { color: #2d72d2; transition: color 0.3s; }
        .quick-action-btn:hover i { color: white; }
    </style>
`;

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Remove old if exists
        const oldStyleRegex = /<style id="unified-icon-style">[\s\S]*?<\/style>/;
        content = content.replace(oldStyleRegex, '');

        // Also clean up any inline existing rules that might conflict (optional, but CSS specificity should handle it or we can just inject at the end of head)
        // Inject right before </head>
        content = content.replace('</head>', unifiedIconStyle + '</head>');

        fs.writeFileSync(file, content);
        console.log(`Standardized icons for ${file}`);
    }
});
