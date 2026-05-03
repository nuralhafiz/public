const fs = require('fs');

const premiumCssIndex = `/* Premium Royal Indigo Login Button */
        .btn-action {
            pointer-events: auto;
            padding: 15px 45px;
            border-radius: 50px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            font-weight: 600;
            font-size: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            cursor: pointer;
            font-family: 'Poppins', sans-serif;
            position: relative;
            overflow: hidden;
            
            background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
            color: #ffffff;
            box-shadow: 0 8px 25px rgba(30, 58, 138, 0.4), inset 0 1px 1px rgba(255,255,255,0.2);
            letter-spacing: 0.5px;
        }

        .btn-action:hover {
            transform: translateY(-3px);
            background: linear-gradient(135deg, #60a5fa 0%, #1e40af 100%);
            box-shadow: 0 14px 30px rgba(30, 58, 138, 0.5), inset 0 1px 2px rgba(255,255,255,0.3);
        }

        .btn-action:active {
            transform: translateY(1px);
            box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);
        }`;

const premiumCssLogin = `.btn-login { 
            background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 8px 25px rgba(30, 58, 138, 0.4), inset 0 1px 1px rgba(255,255,255,0.2);
            letter-spacing: 0.5px;
            transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .btn-login:hover { 
            transform: translateY(-3px);
            background: linear-gradient(135deg, #60a5fa 0%, #1e40af 100%);
            box-shadow: 0 14px 30px rgba(30, 58, 138, 0.5), inset 0 1px 2px rgba(255,255,255,0.3);
        }`;

try {
    // 1. Fix index.html
    let indexHtml = fs.readFileSync('index.html', 'utf8');
    const indexRegex = /\/\* Unified Login Button Style \(from login page\) \*\/[\s\S]*?\.btn-action:active\s*{\s*transform:\s*translateY\(0\);\s*}/;
    indexHtml = indexHtml.replace(indexRegex, premiumCssIndex);
    fs.writeFileSync('index.html', indexHtml);

    // 2. Fix student-login.html
    let studentHtml = fs.readFileSync('student-login.html', 'utf8');
    const loginRegex = /\.btn-login\s*{\s*background:\s*linear-gradient\([\s\S]*?\.btn-login:hover\s*{[\s\S]*?}/;
    studentHtml = studentHtml.replace(loginRegex, premiumCssLogin);
    fs.writeFileSync('student-login.html', studentHtml);

    // 3. Fix warden-login.html
    let wardenHtml = fs.readFileSync('warden-login.html', 'utf8');
    wardenHtml = wardenHtml.replace(loginRegex, premiumCssLogin);
    fs.writeFileSync('warden-login.html', wardenHtml);

    console.log('Premium design applied successfully');
} catch (e) {
    console.error('Error applying premium design:', e);
}
