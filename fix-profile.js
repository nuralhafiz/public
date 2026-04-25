const fs = require('fs');

if (fs.existsSync('student-profile.html')) {
    let content = fs.readFileSync('student-profile.html', 'utf8');

    // Find the start of mainContent
    const mainStart = content.indexOf('<main id="mainContent">');
    if (mainStart !== -1) {
        content = content.substring(0, mainStart);
        
        const fixedMainAndScript = `
        <main id="mainContent">
            <div class="profile-card">
                <div class="profile-header">
                    <div class="profile-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="profile-name" id="profileName">Loading...</div>
                    <div class="profile-role">
                        Student
                        <span class="status-badge">Active</span>
                    </div>
                </div>

                <div class="profile-details">
                    <!-- Email with copy button -->
                    <div class="detail-item">
                        <i class="fas fa-envelope"></i>
                        <span class="detail-label">Email</span>
                        <div class="detail-value">
                            <div class="email-container">
                                <span class="email-value" id="profileEmail">-</span>
                                <button class="copy-btn" id="copyEmailBtn" title="Copy email to clipboard">
                                    <i class="far fa-copy"></i> Copy
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="detail-item">
                        <i class="fas fa-id-card"></i>
                        <span class="detail-label">Student ID</span>
                        <span class="detail-value" id="studentId">-</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <span class="detail-label">Phone</span>
                        <span class="detail-value" id="phoneNumber">-</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span class="detail-label">Room</span>
                        <span class="detail-value" id="roomNumber">-</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span class="detail-label">Joined</span>
                        <span class="detail-value" id="joinDate">-</span>
                    </div>
                </div>

                <button class="edit-profile-btn" id="editProfileBtn">
                    <i class="fas fa-edit"></i> Edit Profile
                </button>
            </div>
        </main>
    </div>

    <script type="module">
        import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
        import { auth, db } from "./js/firebase-config.js";

        const hamburger = document.getElementById('hamburger');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const menuOverlay = document.getElementById('menuOverlay');

        function closeSidebar() {
            sidebar.classList.remove('open');
            menuOverlay.classList.remove('active');
        }

        function openSidebar() {
            sidebar.classList.add('open');
            menuOverlay.classList.add('active');
        }

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });

        menuOverlay.addEventListener('click', () => {
            closeSidebar();
        });

        mainContent.addEventListener('click', () => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('open');
                menuOverlay.classList.remove('active');
            }
        });

        // Copy email function
        function copyEmailToClipboard(email) {
            navigator.clipboard.writeText(email).then(() => {
                const copyBtn = document.getElementById('copyEmailBtn');
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.style.background = '#4caf50';
                copyBtn.style.color = 'white';
                copyBtn.style.borderColor = '#4caf50';

                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
                    copyBtn.style.background = 'none';
                    copyBtn.style.color = '#2d72d2';
                    copyBtn.style.borderColor = '#2d72d2';
                }, 2000);
            }).catch(err => {
                alert('Failed to copy email');
            });
        }

        // Load user profile
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Display user info
                document.getElementById('profileName').textContent = user.email.split('@')[0];

                // Set email with proper display
                const emailElement = document.getElementById('profileEmail');
                emailElement.textContent = user.email;
                emailElement.title = user.email; // Show full email on hover

                // Add copy email functionality
                document.getElementById('copyEmailBtn').addEventListener('click', () => {
                    copyEmailToClipboard(user.email);
                });
            } else {
                window.location.href = "student-login.html";
            }
        });

        // Logout button functionality
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            signOut(auth).then(() => {
                sessionStorage.clear();
                window.location.href = "index.html";
            }).catch((error) => {
                alert("Logout failed: " + error.message);
            });
        });

        // Edit profile button
        document.getElementById('editProfileBtn').addEventListener('click', () => {
            alert('✨ Profile editing will be available soon!\\n\\nYou will be able to update your:\\n• Phone number\\n• Address\\n• Profile picture\\n• And more...');
        });
    </script>
</body>
</html>`;

        content += fixedMainAndScript;
        fs.writeFileSync('student-profile.html', content);
        console.log("Student profile fixed and details restored as blank!");
    }
}
