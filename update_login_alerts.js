const fs = require('fs');
const path = require('path');

const files = ['warden-login.html', 'student-login.html'];
files.forEach(f => {
    let p = path.join('c:\\Users\\Al Hafiz\\public', f);
    if(fs.existsSync(p)){
        let content = fs.readFileSync(p, 'utf8');

        // Insert sweetalert2 script if not present
        if(!content.includes('sweetalert2')) {
            content = content.replace('</head>', '    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>\n</head>');
        }

        // Replace specific alerts
        content = content.replace(/alert\("📧 Please enter your email address\."\);/g, `Swal.fire({ title: 'Missing Email', text: 'Please enter your email address.', icon: 'warning', confirmButtonColor: '#2d72d2', heightAuto: false });`);
        
        content = content.replace(/alert\("❌ Invalid email format! Please use your official @gmi\.edu\.my email address\."\);/g, `Swal.fire({ title: 'Invalid Email', text: 'Please use your official @gmi.edu.my email address.', icon: 'error', confirmButtonColor: '#f44336', heightAuto: false });`);
        
        content = content.replace(/alert\("❌ Invalid email format! Please use your official @student\.gmi\.edu\.my email address\."\);/g, `Swal.fire({ title: 'Invalid Email', text: 'Please use your official @student.gmi.edu.my email address.', icon: 'error', confirmButtonColor: '#f44336', heightAuto: false });`);

        content = content.replace(/alert\("🔒 Please enter your password\."\);/g, `Swal.fire({ title: 'Missing Password', text: 'Please enter your password.', icon: 'warning', confirmButtonColor: '#2d72d2', heightAuto: false });`);

        content = content.replace(/alert\(errorMessage\);/g, `Swal.fire({ title: 'Login Failed', text: errorMessage, icon: 'error', confirmButtonColor: '#f44336', heightAuto: false });`);

        content = content.replace(/alert\("📧 Please enter your email address first to reset your password\."\);/g, `Swal.fire({ title: 'Missing Email', text: 'Please enter your email address first to reset your password.', icon: 'warning', confirmButtonColor: '#2d72d2', heightAuto: false });`);

        content = content.replace(/alert\("❌ Invalid email format! Password reset requires your official @gmi\.edu\.my email address\."\);/g, `Swal.fire({ title: 'Invalid Email', text: 'Password reset requires your official @gmi.edu.my email address.', icon: 'error', confirmButtonColor: '#f44336', heightAuto: false });`);

        content = content.replace(/alert\("❌ Invalid email format! Password reset requires your @student\.gmi\.edu\.my email address\."\);/g, `Swal.fire({ title: 'Invalid Email', text: 'Password reset requires your @student.gmi.edu.my email address.', icon: 'error', confirmButtonColor: '#f44336', heightAuto: false });`);

        content = content.replace(/alert\(`✅ Password reset email sent!\\nWe've sent a secure link to \${emailAddress}\.\\n\\n📬 Please check your inbox \(and spam folder\) to reset your password\.`\);/g, `Swal.fire({ title: 'Email Sent!', html: \`We've sent a secure link to <strong>\${emailAddress}</strong>.<br><br>Please check your inbox (and spam folder) to reset your password.\`, icon: 'success', confirmButtonColor: '#4caf50', heightAuto: false });`);

        content = content.replace(/alert\(errorMsg\);/g, `Swal.fire({ title: 'Reset Failed', text: errorMsg, icon: 'error', confirmButtonColor: '#f44336', heightAuto: false });`);

        fs.writeFileSync(p, content, 'utf8');
        console.log(`Updated ${f}`);
    }
});
