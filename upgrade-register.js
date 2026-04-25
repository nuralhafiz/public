const fs = require('fs');

if (fs.existsSync('student-login.html') && fs.existsSync('register.html')) {
    let loginContent = fs.readFileSync('student-login.html', 'utf8');
    let registerContent = fs.readFileSync('register.html', 'utf8');

    // Extract the script block from original register.html
    const scriptRegex = /<script type="module">[\s\S]*?<\/script>/;
    const scriptMatch = registerContent.match(scriptRegex);
    const registerScript = scriptMatch ? scriptMatch[0] : '';

    // We will build the new register.html by using student-login.html as a template
    let newRegister = loginContent;

    // 1. Change title
    newRegister = newRegister.replace('<title>GMI HostelKu | Student Login</title>', '<title>GMI HostelKu | Create Account</title>');

    // 2. Change Tagline below logo
    newRegister = newRegister.replace('<div class="tagline"><i class="fas fa-user-graduate"></i> Student Portal</div>', '<div class="tagline"><i class="fas fa-user-plus"></i> Create Account</div>');

    // 3. Replace the form section
    const formSectionRegex = /<div class="form-section">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<script type="module">/;
    
    const newFormHTML = `<div class="form-section">
            <div class="form-header">
                <h2>Join GMI HostelKu</h2>
                <p>Register your official student account</p>
            </div>

            <form class="login-form" id="registerForm">
                <div class="input-group">
                    <div class="input-icon"><i class="fas fa-user"></i></div>
                    <input type="text" id="fullName" placeholder="Full Name (e.g. Ahmad Faiz)" required>
                </div>
                
                <div class="input-group">
                    <div class="input-icon"><i class="fas fa-envelope"></i></div>
                    <input type="email" id="email" placeholder="username@student.gmi.edu.my" pattern=".*@student\\.gmi\\.edu\\.my$" title="Must use @student.gmi.edu.my" required>
                </div>
                
                <div class="input-group">
                    <div class="input-icon"><i class="fas fa-lock"></i></div>
                    <input type="password" id="password" placeholder="Password (Min. 6 characters)" minlength="6" required>
                </div>

                <button type="submit" class="submit-btn" id="loginBtn">
                    <span>Create Account</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </form>

            <div class="admin-link">
                Already have an account? <a href="student-login.html" style="color: #2d72d2; text-decoration: none; font-weight: 600;">Login Here</a>
            </div>
        </div>
    </div>
</div>

`;
    
    // Replace the form
    newRegister = newRegister.replace(formSectionRegex, newFormHTML + '<script type="module">');

    // 4. Replace the entire script block at the bottom
    newRegister = newRegister.replace(/<script type="module">[\s\S]*?<\/script>/, registerScript);

    // Write it
    fs.writeFileSync('register.html', newRegister);
    console.log("register.html UI upgraded successfully!");
}
