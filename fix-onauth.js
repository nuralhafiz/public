const fs = require('fs');

let content = fs.readFileSync('warden-dashboard.html', 'utf8');

// The replacement was messed up and removed the validation logic, and likely the user block.
// I will just locate // RBAC PASS and rebuild the if (user) block below it.

const rbacPassRegex = /\/\/\s*RBAC PASS\s*\}\s*return;\s*\}/;

// Wait, the diff said:
//                 }
//                 // RBAC PASS
//             }
//                 return;
//             }

// Let me just replace the entire onAuthStateChanged block.
const authStateStart = content.indexOf('onAuthStateChanged(auth, (user) => {');
const endScript = content.indexOf('</script>', authStateStart);

if (authStateStart !== -1 && endScript !== -1) {
    const newAuthBlock = `onAuthStateChanged(auth, (user) => {
        if (user) {
            const email = user.email ? user.email.toLowerCase() : '';
            const isStudent = email.endsWith('@student.gmi.edu.my');
            
            if (isStudent) {
                alert('🛡️ Access Denied: Student accounts cannot access Warden pages.');
                window.location.href = 'student-dashboard.html';
                return;
            }
            // RBAC PASS
        }
        
        if (user) {
            // Load live data
            loadWardenDashboardData();
            
            // Validate email domain
            if (!user.email.endsWith('@gmi.edu.my') || user.email.includes('@student.')) {
                alert("Access Denied: This portal is for wardens only.");
                signOut(auth).then(() => {
                    window.location.href = "warden-login.html";
                });
                return;
            }

            // Display user info
            document.getElementById('userName').textContent = user.email.split('@')[0];
            const profileAvatar = document.getElementById('profileAvatar');
            if (profileAvatar) {
                profileAvatar.textContent = user.email.charAt(0).toUpperCase();
            }
        } else {
            // No user is signed in, redirect to login page
            window.location.href = "warden-login.html";
        }
    });

    // Logout Functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signOut(auth).then(() => {
                sessionStorage.clear();
                window.location.href = "index.html";
            }).catch((error) => {
                console.error("Logout Error:", error);
                alert("Error logging out.");
            });
        });
    }`;
    
    // Check if Logout Functionality exists further down to not duplicate it
    const logoutIndex = content.indexOf('// Logout Functionality', authStateStart);
    let endReplace = endScript;
    if (logoutIndex !== -1 && logoutIndex < endScript) {
        // We replace from authStateStart to endScript
        content = content.substring(0, authStateStart) + newAuthBlock + '\\n' + content.substring(endScript);
        fs.writeFileSync('warden-dashboard.html', content);
        console.log("Fixed onAuthStateChanged");
    } else {
        // It's already there
        content = content.substring(0, authStateStart) + newAuthBlock + '\\n' + content.substring(endScript);
        fs.writeFileSync('warden-dashboard.html', content);
        console.log("Fixed onAuthStateChanged");
    }
}
