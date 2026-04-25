const fs = require('fs');

if (fs.existsSync('room-apply.html')) {
    let content = fs.readFileSync('room-apply.html', 'utf8');

    // Add <style> at the beginning
    if (content.includes('/* Floor Plan Styles */') && !content.includes('<style>\\n        /* Floor Plan Styles */') && !content.includes('<style>\\n\\n        /* Floor Plan Styles */') && !content.includes('<style>\\n        \\n        /* Floor Plan Styles */')) {
        content = content.replace('/* Floor Plan Styles */', '<style>\\n        /* Floor Plan Styles */');
    }

    // Add </style> at the end
    const cssEndTarget = "margin-left: 8px;\\n        }";
    const newCssEnd = "margin-left: 8px;\\n        }\\n    </style>";
    
    // Make sure we only add it if we successfully added the opening <style> and it hasn't been added yet
    if (content.includes('<style>\\n        /* Floor Plan Styles */') && !content.includes(newCssEnd)) {
        content = content.replace(cssEndTarget, newCssEnd);
    }

    fs.writeFileSync('room-apply.html', content);
    console.log("Fixed CSS tags in room-apply.html");
}
