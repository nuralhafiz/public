const fs = require('fs');

if (fs.existsSync('register.html')) {
    let content = fs.readFileSync('register.html', 'utf8');

    // Replace the entire <style> block
    const newStyle = `<style>
        :root {
            --bg-light: #f0f3fa;
            --primary-blue: #2d72d2;
            --dark-blue: #1e3a8a;
            --text-dark: #1e293b;
            --text-gray: #64748b;
            --accent-red: #ff3131;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Poppins', sans-serif;
            background-color: var(--bg-light);
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .register-container {
            width: 100%;
            max-width: 420px;
            background: #ffffff;
            padding: 40px;
            border-radius: 24px;
            text-align: center;
            color: var(--text-dark);
            box-shadow: 0 15px 40px rgba(0,0,0,0.08);
            border: 1px solid rgba(0,0,0,0.02);
        }

        .brand-logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .brand-blue { color: var(--primary-blue); }
        .brand-lime { color: var(--dark-blue); }
        .brand-dot {
            color: var(--accent-red);
            font-size: 20px;
            position: absolute;
            top: -2px;
            left: 50%;
            transform: translateX(11px);
        }

        h2 { 
            font-weight: 500; 
            margin-bottom: 30px; 
            font-size: 22px;
            position: relative;
            color: var(--text-dark);
        }

        h2:after {
            content: '';
            display: block;
            width: 50px;
            height: 4px;
            background: var(--primary-blue);
            margin: 15px auto 0;
            border-radius: 2px;
        }

        .form-group { 
            margin-bottom: 22px; 
            text-align: left; 
        }
        
        label { 
            font-size: 13px; 
            font-weight: 500;
            color: var(--text-gray); 
            margin-left: 5px;
            display: block;
            margin-bottom: 8px;
        }

        input {
            width: 100%;
            padding: 15px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            color: var(--text-dark);
            outline: none;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
            transition: all 0.3s ease;
            font-size: 14px;
        }

        input:focus {
            border-color: var(--primary-blue);
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(45, 114, 210, 0.15);
        }

        input::placeholder {
            color: #94a3b8;
            font-size: 13px;
        }

        .btn-submit {
            width: 100%;
            padding: 15px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--dark-blue) 0%, var(--primary-blue) 100%);
            border: none;
            color: white;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            margin-top: 15px;
            transition: all 0.3s;
            box-shadow: 0 10px 20px rgba(45, 114, 210, 0.25);
        }

        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px rgba(45, 114, 210, 0.35);
        }

        .login-link {
            display: inline-block;
            margin-top: 25px;
            font-size: 14px;
            color: var(--text-gray);
            text-decoration: none;
            transition: color 0.3s;
            font-weight: 500;
        }

        .login-link span {
            color: var(--primary-blue);
            font-weight: 600;
        }

        .login-link:hover span {
            text-decoration: underline;
        }

        .email-hint {
            font-size: 11px;
            color: var(--primary-blue);
            margin-top: 6px;
            margin-left: 5px;
            text-align: left;
            font-weight: 500;
        }
    </style>`;

    // Replace from <style> to </style>
    content = content.replace(/<style>[\s\S]*?<\/style>/, newStyle);

    // Also update the login link HTML to match the new styling setup
    content = content.replace(
        '<a href="student-login.html" class="login-link">Already have an account? Login here</a>',
        '<a href="student-login.html" class="login-link">Already have an account? <span>Login here</span></a>'
    );

    fs.writeFileSync('register.html', content);
    console.log("register.html updated to Light Theme successfully.");
}
