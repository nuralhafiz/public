const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

const regex = /\/\* premium glassmorphic buttons[\s\S]*?\/\* ripple effect for buttons \*\//;
const newStr = `/* Unified Login Button Style */
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
        }

        /* ripple effect for buttons */`;

c = c.replace(regex, newStr);
fs.writeFileSync('index.html', c);
