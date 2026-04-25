const fs = require('fs');

let studentHtml = fs.readFileSync('student-login.html', 'utf8');

// Update Titles and Texts
let wardenHtml = studentHtml
    .replace('<title>GMI HostelKu | Student Login</title>', '<title>GMI HostelKu | Warden Login</title>')
    .replace('<h2>Student Login</h2>', '<h2>Warden Login</h2>')
    .replace('placeholder="student@student.gmi.edu.my"', 'placeholder="warden@gmi.edu.my"');

// Remove the Create Account Section which is only for students
wardenHtml = wardenHtml.replace(/<div class="divider">[\s\S]*?<\/a>/, '');

// Update Validation Logic inside the script tag
wardenHtml = wardenHtml.replace(/if \(!email\.endsWith\('@student\.gmi\.edu\.my'\)\) \{[\s\S]*?return;\s*\}/g, `if (!email.endsWith('@gmi.edu.my') || email.includes('@student.')) {
            alert("❌ Invalid email format! Please use your official @gmi.edu.my email address.");
            emailInput.focus();
            return;
        }`);

// Update Redirect
wardenHtml = wardenHtml.replace('window.location.href = "student-dashboard.html";', 'window.location.href = "warden-dashboard.html";');

fs.writeFileSync('warden-login.html', wardenHtml);
console.log("Warden Login updated to match Student theme!");
