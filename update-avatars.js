const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Al Hafiz/public';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && (f.includes('student') || f.includes('warden') || f.includes('room-apply') || f.includes('maintenance') || f.includes('move-out') || f.includes('register')));

const studentCss = `        /* Premium Student Avatar */
        .avatar-container {
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ccff00 0%, #99cc00 100%);
            border: 2px solid rgba(255, 255, 255, 0.9);
            position: relative;
            overflow: hidden;
        }
        .avatar-container::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%);
        }
        .avatar-container:hover {
            transform: scale(1.1) translateY(-2px);
            border-color: #ffffff;
        }
        .avatar-container i {
            font-size: 22px;
            color: #0f1638;
            z-index: 2;
        }`;

const wardenCss = `        /* Premium Warden Avatar */
        .avatar-container {
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff3131 0%, #cc0000 100%);
            border: 2px solid rgba(255, 255, 255, 0.9);
            position: relative;
            overflow: hidden;
        }
        .avatar-container::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%);
        }
        .avatar-container:hover {
            transform: scale(1.1) translateY(-2px);
            border-color: #ffffff;
        }
        .avatar-container i {
            font-size: 22px;
            color: #ffffff;
            z-index: 2;
        }`;

// Exclude login pages since they don't have avatars
const excludeFiles = ['student-login.html', 'warden-login.html', 'register.html'];

files.forEach(file => {
    if (excludeFiles.includes(file)) return;
    
    let isWarden = file.includes('warden');
    let content = fs.readFileSync(path.join(dir, file), 'utf-8');
    
    // Replace CSS
    // The CSS block starts with .avatar-container { and ends before the next major selector like .container or nav or main
    // We will use a regex to replace the entire .avatar-container block
    const cssRegex = /\.avatar-container\s*{[\s\S]*?\.avatar-container i\s*{[\s\S]*?}/g;
    
    // Some files might have hover state as well. Let's make it more robust.
    // Replace all existing avatar styles
    const fullCssRegex = /\.avatar-container\s*{[^}]*}\s*\.avatar-container:hover\s*{[^}]*}\s*\.avatar-container i\s*{[^}]*}/g;
    
    if (fullCssRegex.test(content)) {
        content = content.replace(fullCssRegex, isWarden ? wardenCss : studentCss);
    } else {
        // Fallback if the regex doesn't match exactly
        const fallbackRegex = /\.avatar-container\s*{[\s\S]*?(?=\/\*|\.container|\.nav|\.sidebar|nav|header)/;
        // console.log("Trying fallback for", file);
        // Better: just replace it if we find the block
        content = content.replace(/\.avatar-container\s*{[\s\S]*?\.avatar-container i\s*{[\s\S]*?}/g, isWarden ? wardenCss : studentCss);
    }
    
    // Replace Icons
    // Some have <i class="fas fa-user-circle"></i>, some <i class="fas fa-user"></i>, some <i class="fa fa-user"></i>
    // Let's replace ONLY the one inside <a class="avatar-container">
    const newIcon = isWarden ? '<i class="fas fa-user-shield"></i>' : '<i class="fas fa-user-graduate"></i>';
    
    content = content.replace(/(<a[^>]*class="[^"]*avatar-container[^"]*"[^>]*>\s*)<i class="[^"]*"><\/i>(\s*<\/a>)/g, `$1${newIcon}$2`);
    content = content.replace(/(<div[^>]*class="[^"]*avatar-container[^"]*"[^>]*>\s*)<i class="[^"]*"><\/i>(\s*<\/div>)/g, `$1${newIcon}$2`);

    fs.writeFileSync(path.join(dir, file), content);
    console.log("Updated", file);
});
