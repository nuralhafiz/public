const fs = require('fs');

if (fs.existsSync('index.html')) {
    let content = fs.readFileSync('index.html', 'utf8');

    // 1. Speed up the flex layout transition from 0.65s to 0.35s
    content = content.replace(/transition: flex 0\.65s ease-out;/g, 'transition: flex 0.35s ease-out;');

    // 2. Speed up the background scale transition from 0.8s to 0.35s
    content = content.replace(/transition: transform 0\.8s ease-out;/g, 'transition: transform 0.35s ease-out;');

    // 3. Speed up the redirect delay from 800ms to 400ms (to perfectly match the 0.35s animation)
    content = content.replace(/setTimeout\(\(\) => \{ window\.location\.href = 'warden-login\.html'; \}, 800\);/g, "setTimeout(() => { window.location.href = 'warden-login.html'; }, 400);");
    content = content.replace(/setTimeout\(\(\) => \{ window\.location\.href = 'student-login\.html'; \}, 800\);/g, "setTimeout(() => { window.location.href = 'student-login.html'; }, 400);");

    fs.writeFileSync('index.html', content);
    console.log("Welcome page hover speed increased successfully!");
} else {
    console.log("index.html not found.");
}
