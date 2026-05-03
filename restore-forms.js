const fs = require('fs');

// 1. Fix student-login.html
if (fs.existsSync('student-login.html')) {
    let content = fs.readFileSync('student-login.html', 'utf8');
    
    const studentForm = `<div class="login-container">
            <h2>Student Login</h2>

            <form id="loginForm">
                <div class="form-group">
                    <div class="input-wrapper">
                        <i class="fas fa-envelope input-icon"></i>
                        <input type="email" id="email" placeholder="student@student.gmi.edu.my" required autocomplete="email">
                    </div>
                </div>
                <div class="form-group">
                    <div class="input-wrapper">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" id="password" placeholder="Enter your password" required autocomplete="current-password">
                    </div>
                </div>

                <a id="forgotPasswordBtn" class="forgot-password">Forgot Password?</a>

                <button type="submit" id="loginBtn" class="btn btn-login">
                    <span>Login</span>
                </button>
                
                <div class="divider">
                    <div class="divider-line"></div>
                    <span class="divider-text">New to HostelKu?</span>
                    <div class="divider-line"></div>
                </div>
                
                <a href="register.html" style="text-decoration: none;">
                    <button type="button" class="btn btn-create">Create an Account</button>
                </a>
            </form>
        </div>
    </div>
</div>

<script>`;

    content = content.replace(/<div class="login-container">[\s\S]*?<script>/, studentForm);
    fs.writeFileSync('student-login.html', content);
}

// 2. Fix warden-login.html
if (fs.existsSync('warden-login.html')) {
    let content = fs.readFileSync('warden-login.html', 'utf8');
    
    const wardenForm = `<div class="login-container">
            <h2>Warden Login</h2>

            <form id="loginForm">
                <div class="form-group">
                    <div class="input-wrapper">
                        <i class="fas fa-envelope input-icon"></i>
                        <input type="email" id="email" placeholder="warden@gmi.edu.my" required autocomplete="email">
                    </div>
                </div>
                <div class="form-group">
                    <div class="input-wrapper">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" id="password" placeholder="Enter your password" required autocomplete="current-password">
                    </div>
                </div>

                <a id="forgotPasswordBtn" class="forgot-password">Forgot Password?</a>

                <button type="submit" id="loginBtn" class="btn btn-login">
                    <span>Login</span>
                </button>
            </form>
        </div>
    </div>
</div>

<script>`;

    content = content.replace(/<div class="login-container">[\s\S]*?<script>/, wardenForm);
    fs.writeFileSync('warden-login.html', content);
}

console.log("Restored missing forms!");
