const fs = require('fs');

let content = fs.readFileSync('warden-dashboard.html', 'utf8');

// 1. Fix the CSS block that was broken
const brokenCssRegex = /\.status-badge\s*\{[\s\S]*?display:\s*inline-block;\s*\}\s*font-size:\s*12px;\s*font-weight:\s*500;\s*cursor:\s*pointer;\s*border:\s*none;\s*margin:\s*0\s*3px;\s*transition:\s*all\s*0\.3s;\s*\}/;

const fixedCss = `.status-badge {
            padding: 5px 12px;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
        }

        .status-pending {
            background: #fff3e0;
            color: #ff9800;
        }

        .status-approved {
            background: #e8f5e9;
            color: #4caf50;
        }

        .status-rejected {
            background: #ffebee;
            color: #f44336;
        }

        .action-buttons {
            display: flex;
            gap: 5px;
        }

        .action-btn {
            width: 35px;
            height: 35px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            margin: 0 3px;
        }`;

content = content.replace(brokenCssRegex, fixedCss);

// Also fix the hover shadow to be exactly like applications page (it is mostly fine but we can standardize)
content = content.replace(/\.action-view\s*\{\s*background:\s*#e3f2fd;\s*color:\s*#2196f3;\s*\}/, '.action-view { background: rgba(33, 150, 243, 0.1); color: #2196F3; }');
content = content.replace(/\.action-approve\s*\{\s*background:\s*#e8f5e9;\s*color:\s*#4caf50;\s*\}/, '.action-approve { background: rgba(76, 175, 80, 0.1); color: #4CAF50; }');
content = content.replace(/\.action-reject\s*\{\s*background:\s*#ffebee;\s*color:\s*#f44336;\s*\}/, '.action-reject { background: rgba(244, 67, 54, 0.1); color: #F44336; }');

// 2. Ensure updateApplicationStatus is added to the script
if (!content.includes('window.updateApplicationStatus =')) {
    const scriptInsertPoint = content.indexOf('window.viewApplication =');
    if (scriptInsertPoint !== -1) {
        const updateFunc = `
        window.updateApplicationStatus = async (id, status) => {
            if (confirm(\`Are you sure you want to \${status} this application?\`)) {
                try {
                    const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
                    await updateDoc(doc(db, "applications", id), {
                        status: status,
                        reviewedAt: new Date()
                    });
                    alert(\`Application \${status} successfully!\`);
                } catch (error) {
                    alert("Error updating application: " + error.message);
                }
            }
        };\n\n        `;
        content = content.substring(0, scriptInsertPoint) + updateFunc + content.substring(scriptInsertPoint);
    }
}

fs.writeFileSync('warden-dashboard.html', content);
console.log('Fixed warden-dashboard.html styling and functionality');
