const fs = require('fs');

if (fs.existsSync('index.html')) {
    let content = fs.readFileSync('index.html', 'utf8');

    // 1. Slow down overlay morphing
    content = content.replace(/overlay\.style\.transition\s*=\s*'opacity\s*0\.4s\s*ease-out';/g, 
        "overlay.style.transition = 'opacity 0.8s ease-out';");

    // 2. Slow down logo movement to 1.0s with a very smooth cinematic easing
    content = content.replace(/logo\.style\.transition\s*=\s*'all\s*0\.4s\s*cubic-bezier\(0\.25,\s*1,\s*0\.5,\s*1\)';/g, 
        "logo.style.transition = 'all 1.0s cubic-bezier(0.33, 1, 0.68, 1)';"); // Smooth ease-out

    // 3. Delay the actual redirect so the user can enjoy the 1.0s animation
    content = content.replace(/setTimeout\(\(\) => \{\s*window\.location\.href\s*=\s*targetUrl;\s*\}, 400\);/g, 
        "setTimeout(() => {\n                window.location.href = targetUrl;\n            }, 1000);");

    fs.writeFileSync('index.html', content);
    console.log("Made the logo transition slow and cinematic!");
}
