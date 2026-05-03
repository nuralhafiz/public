const fs = require('fs');

const cyanCssIndex = `/* Unified Login Button Style (from login page) */
        .btn-action {
            pointer-events: auto;
            padding: 15px 45px;
            border-radius: 50px;
            border: none;
            font-weight: 700;
            font-size: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            position: relative;
            overflow: hidden;
            
            /* Login page gradient */
            background: linear-gradient(95deg, #4facfe, #00f2fe);
            color: white;
            box-shadow: 0 6px 18px rgba(79, 172, 254, 0.35);
        }

        .btn-action:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 28px rgba(79, 172, 254, 0.45);
        }

        .btn-action:active {
            transform: translateY(0);
        }`;

const cyanCssLogin = `.btn-login { 
            background: linear-gradient(95deg, #4facfe, #00f2fe);
            color: white;
            box-shadow: 0 6px 18px rgba(79, 172, 254, 0.35);
        }

        .btn-login:hover { 
            transform: translateY(-3px);
            box-shadow: 0 12px 28px rgba(79, 172, 254, 0.45);
        }`;

try {
    // 1. Revert index.html
    let indexHtml = fs.readFileSync('index.html', 'utf8');
    const indexRegex = /\/\* Premium Royal Indigo Login Button \*\/[\s\S]*?\.btn-action:active\s*{\s*transform:\s*translateY\(1px\);\s*box-shadow:\s*0 4px 12px rgba\(30, 58, 138, 0\.3\);\s*}/;
    indexHtml = indexHtml.replace(indexRegex, cyanCssIndex);
    fs.writeFileSync('index.html', indexHtml);

    // 2. Revert student-login.html
    let studentHtml = fs.readFileSync('student-login.html', 'utf8');
    const loginRegex = /\.btn-login\s*{\s*background:\s*linear-gradient\(135deg,\s*#3b82f6\s*0%,\s*#1e3a8a\s*100%\);[\s\S]*?\.btn-login:hover\s*{[\s\S]*?}/;
    studentHtml = studentHtml.replace(loginRegex, cyanCssLogin);
    fs.writeFileSync('student-login.html', studentHtml);

    // 3. Revert warden-login.html
    let wardenHtml = fs.readFileSync('warden-login.html', 'utf8');
    wardenHtml = wardenHtml.replace(loginRegex, cyanCssLogin);
    fs.writeFileSync('warden-login.html', wardenHtml);

    console.log('Cyan design reverted successfully');
} catch (e) {
    console.error('Error reverting design:', e);
}
