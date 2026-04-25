const fs = require('fs');

const modalCss = `
    /* Modal Styling */
    .profile-modal {
        display: none;
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 2000;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(5px);
    }
    .profile-modal.active {
        display: flex;
    }
    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 20px;
        width: 90%;
        max-width: 450px;
        box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        animation: slideUp 0.3s ease;
    }
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
    }
    .modal-header h3 {
        margin: 0;
        color: #1e3a8a;
    }
    .close-modal {
        background: none;
        border: none;
        font-size: 20px;
        color: #999;
        cursor: pointer;
    }
    .form-group {
        margin-bottom: 20px;
    }
    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        font-size: 14px;
        color: #333;
    }
    .form-group input {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #eee;
        border-radius: 10px;
        font-size: 14px;
        font-family: inherit;
        box-sizing: border-box;
        transition: border-color 0.3s;
    }
    .form-group input:focus {
        border-color: #2d72d2;
        outline: none;
    }
    .save-btn {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #1e3a8a 0%, #2d72d2 100%);
        color: white;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        font-size: 15px;
        transition: transform 0.2s;
    }
    .save-btn:hover {
        transform: translateY(-2px);
    }
    .save-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

function processFile(filename, isStudent) {
    if (!fs.existsSync(filename)) return;
    
    let content = fs.readFileSync(filename, 'utf8');

    // 1. Inject CSS
    if (!content.includes('.profile-modal {')) {
        content = content.replace('</style>', modalCss + '\n    </style>');
    }

    // 2. Add IDs to detail values
    content = content.replace(/<span class="detail-value">-<\/span>/g, (match, offset, str) => {
        // Look at previous sibling to determine what it is
        const prevText = str.substring(offset - 100, offset);
        if (prevText.includes('ID / IC Number') || prevText.includes('Department')) return '<span class="detail-value" id="profileId">-</span>';
        if (prevText.includes('Phone') || prevText.includes('Contact')) return '<span class="detail-value" id="profilePhone">-</span>';
        if (prevText.includes('Room')) return '<span class="detail-value" id="profileRoom">-</span>';
        if (prevText.includes('Joined') || prevText.includes('Joined Date')) return '<span class="detail-value" id="profileJoined">-</span>';
        return match;
    });

    // 3. Inject Modal HTML before </body>
    const modalHtml = `
    <!-- Edit Profile Modal -->
    <div class="profile-modal" id="editProfileModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Profile</h3>
                <button class="close-modal" id="closeModalBtn"><i class="fas fa-times"></i></button>
            </div>
            <form id="editProfileForm">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="editName" required>
                </div>
                <div class="form-group">
                    <label>${isStudent ? 'Student ID / IC Number' : 'Staff ID / Department'}</label>
                    <input type="text" id="editId" required>
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" id="editPhone" placeholder="012-3456789" required>
                </div>
                <button type="submit" class="save-btn" id="saveProfileBtn">Save Changes</button>
            </form>
        </div>
    </div>
    `;

    if (!content.includes('id="editProfileModal"')) {
        content = content.replace('</body>', modalHtml + '\n</body>');
    }

    // 4. Update JS imports and logic
    if (!content.includes('updateProfile')) {
        content = content.replace(
            /import { getAuth, signOut, onAuthStateChanged } from "https:\/\/www\.gstatic\.com\/firebasejs\/10\.8\.0\/firebase-auth\.js";/,
            'import { getAuth, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";'
        );
    }
    
    if (!content.includes('doc, getDoc, setDoc')) {
        content = content.replace(
            /import { auth, db } from ".\/js\/firebase-config.js";/,
            'import { auth, db } from "./js/firebase-config.js";\n        import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";'
        );
    }

    // Replace old edit button logic
    const oldEditLogic = `document.getElementById('editProfileBtn').addEventListener('click', () => {
            alert('✨ Profile editing will be available soon!\\n\\nYou will be able to update your:\\n• Phone number\\n• Address\\n• Profile picture\\n• And more...');
        });`;
    
    const newEditLogic = `
        // Modal Logic
        const modal = document.getElementById('editProfileModal');
        const editBtn = document.getElementById('editProfileBtn');
        const closeBtn = document.getElementById('closeModalBtn');
        const editForm = document.getElementById('editProfileForm');
        
        editBtn.addEventListener('click', () => {
            modal.classList.add('active');
            // Pre-fill form
            document.getElementById('editName').value = document.getElementById('profileName').textContent;
            document.getElementById('editId').value = document.getElementById('profileId').textContent !== '-' ? document.getElementById('profileId').textContent : '';
            document.getElementById('editPhone').value = document.getElementById('profilePhone').textContent !== '-' ? document.getElementById('profilePhone').textContent : '';
        });

        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', (e) => {
            if(e.target === modal) modal.classList.remove('active');
        });

        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const saveBtn = document.getElementById('saveProfileBtn');
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

            const newName = document.getElementById('editName').value;
            const newId = document.getElementById('editId').value;
            const newPhone = document.getElementById('editPhone').value;
            const user = auth.currentUser;

            try {
                if (newName !== user.displayName) {
                    await updateProfile(user, { displayName: newName });
                    document.getElementById('profileName').textContent = newName;
                }

                await setDoc(doc(db, "users", user.uid), {
                    displayName: newName,
                    idNumber: newId,
                    phoneNumber: newPhone,
                    updatedAt: new Date()
                }, { merge: true });

                document.getElementById('profileId').textContent = newId;
                document.getElementById('profilePhone').textContent = newPhone;
                
                modal.classList.remove('active');
                alert("Profile updated successfully!");
            } catch (error) {
                alert("Error updating profile: " + error.message);
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Changes';
            }
        });

        // Load profile data function
        async function loadProfileData(user) {
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if(data.idNumber) document.getElementById('profileId').textContent = data.idNumber;
                    if(data.phoneNumber) document.getElementById('profilePhone').textContent = data.phoneNumber;
                    if(data.displayName) document.getElementById('profileName').textContent = data.displayName;
                } else if (user.displayName) {
                    document.getElementById('profileName').textContent = user.displayName;
                }
                
                // Joined date logic
                const createTime = user.metadata.creationTime;
                if(createTime) {
                    const d = new Date(createTime);
                    document.getElementById('profileJoined').textContent = d.toLocaleDateString('en-MY', { month: 'long', year: 'numeric' });
                }
            } catch(e) {
                console.error("Error loading profile", e);
            }
        }
    `;

    if (content.includes(oldEditLogic)) {
        content = content.replace(oldEditLogic, newEditLogic);
    } else if (!content.includes('const modal = document.getElementById')) {
        // Append it just before </script> if it doesn't exist
        content = content.replace('</script>\n</body>', newEditLogic + '\n    </script>\n</body>');
    }

    // Call loadProfileData inside onAuthStateChanged
    const authChangeHook = `document.getElementById('profileName').textContent = user.email.split('@')[0];`;
    if (content.includes(authChangeHook) && !content.includes('loadProfileData(user);')) {
        content = content.replace(authChangeHook, `document.getElementById('profileName').textContent = user.displayName || user.email.split('@')[0];\n                loadProfileData(user);`);
    }

    fs.writeFileSync(filename, content);
    console.log("Processed " + filename);
}

processFile('student-profile.html', true);
processFile('warden-profile.html', false);
