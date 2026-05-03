const fs = require('fs');

if (fs.existsSync('index.html')) {
    let content = fs.readFileSync('index.html', 'utf8');

    // Add a flag to prevent multiple clicks during the 1.0s transition
    if (!content.includes('let isTransitioning = false;')) {
        content = content.replace(/function triggerMorphTransition\(event, targetUrl, targetSectionId\) \{/, 
            `let isTransitioning = false;\n        function triggerMorphTransition(event, targetUrl, targetSectionId) {\n            if (isTransitioning) return;\n            isTransitioning = true;`);
        
        // Ensure mobile path also returns properly but resets flag? Actually mobile navigates anyway.
        // It's safe to just block all clicks once any click is registered.
    }

    fs.writeFileSync('index.html', content);
    console.log("Added click debounce to prevent double-click white screen bug!");
}
