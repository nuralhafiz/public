const fs = require('fs');

if (fs.existsSync('room-apply.html')) {
    let content = fs.readFileSync('room-apply.html', 'utf8');

    // Remove the old .floor-plan-container if it exists
    const containerRegex = /\.floor-plan-container\s*\{[\s\S]*?\}/g;
    content = content.replace(containerRegex, '');

    // Add the new CSS for mobile scrolling
    const newMobileCSS = `
        .floor-plan-container {
            display: block; /* Safe for horizontal overflow */
            background: #f8fafc;
            padding: 20px 10px; /* Smaller padding for mobile */
            border-radius: 16px;
            border: 2px dashed #cbd5e1;
            position: relative;
            overflow-x: auto; /* Allows swiping horizontally */
            width: 100%;
            /* Custom scrollbar for better UI */
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
        }

        .floor-plan-container::-webkit-scrollbar {
            height: 6px;
        }
        .floor-plan-container::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 10px;
        }

        .blueprint-container {
            width: max-content; /* Critical: prevents the flex children from shrinking */
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 20px;
        }`;

    // Replace old .blueprint-container and add both
    const blueprintContainerRegex = /\.blueprint-container\s*\{[\s\S]*?\}/;
    content = content.replace(blueprintContainerRegex, newMobileCSS);

    fs.writeFileSync('room-apply.html', content);
    console.log("Fixed horizontal overflow for mobile devices.");
}
