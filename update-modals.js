const fs = require('fs');

// --- WARDEN PROFILE ---
if (fs.existsSync('warden-profile.html')) {
    let content = fs.readFileSync('warden-profile.html', 'utf8');

    // 1. Add IDs to the span tags if missing
    content = content.replace(
        /<span class="detail-label">Staff ID<\/span>\s*<span class="detail-value">(-)?<\/span>/,
        '<span class="detail-label">Staff ID</span>\n                        <span class="detail-value" id="profileStaffId">-</span>'
    );
    content = content.replace(
        /<span class="detail-label">Block In-Charge<\/span>\s*<span class="detail-value">(-)?<\/span>/,
        '<span class="detail-label">Block In-Charge</span>\n                        <span class="detail-value" id="profileBlock">-</span>'
    );

    // 2. Replace Modal HTML
    const newWardenModalHtml = `
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
                    <label>Staff ID</label>
                    <input type="text" id="editStaffId" required>
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" id="editPhone" required>
                </div>
                <div class="form-group">
                    <label>Block In-Charge</label>
                    <input type="text" id="editBlock" placeholder="e.g. Block A1">
                </div>
                <button type="submit" class="save-btn" id="saveProfileBtn">Save Changes</button>
            </form>
        </div>
    </div>`;
    
    content = content.replace(/<!-- Edit Profile Modal -->[\s\S]*?<\/div>\s*<\/div>/, newWardenModalHtml);

    // 3. Replace JS logic for editing
    const jsLogicRegex = /\/\/ Modal Logic[\s\S]*?async function loadProfileData\(user\) \{/g;
    const newWardenJsLogic = `// Modal Logic
        const modal = document.getElementById('editProfileModal');
        const editBtn = document.getElementById('editProfileBtn');
        const closeBtn = document.getElementById('closeModalBtn');
        const editForm = document.getElementById('editProfileForm');
        
        editBtn.addEventListener('click', () => {
            modal.classList.add('active');
            // Pre-fill form
            document.getElementById('editName').value = document.getElementById('profileName').textContent;
            document.getElementById('editStaffId').value = document.getElementById('profileStaffId').textContent !== '-' ? document.getElementById('profileStaffId').textContent : '';
            document.getElementById('editPhone').value = document.getElementById('profilePhone').textContent !== '-' ? document.getElementById('profilePhone').textContent : '';
            document.getElementById('editBlock').value = document.getElementById('profileBlock').textContent !== '-' ? document.getElementById('profileBlock').textContent : '';
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
            const newStaffId = document.getElementById('editStaffId').value;
            const newPhone = document.getElementById('editPhone').value;
            const newBlock = document.getElementById('editBlock').value || '-';
            const user = auth.currentUser;

            try {
                if (newName !== user.displayName) {
                    await updateProfile(user, { displayName: newName });
                    document.getElementById('profileName').textContent = newName;
                }

                await setDoc(doc(db, "users", user.uid), {
                    displayName: newName,
                    staffId: newStaffId,
                    phoneNumber: newPhone,
                    block: newBlock,
                    updatedAt: new Date()
                }, { merge: true });

                document.getElementById('profileStaffId').textContent = newStaffId;
                document.getElementById('profilePhone').textContent = newPhone;
                document.getElementById('profileBlock').textContent = newBlock;
                
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
        async function loadProfileData(user) {`;
    
    content = content.replace(jsLogicRegex, newWardenJsLogic);

    // 4. Update loadProfileData
    const loadProfileDataRegex = /if \(docSnap\.exists\(\)\) \{[\s\S]*?\} else if/g;
    const newWardenLoadProfile = `if (docSnap.exists()) {
                    const data = docSnap.data();
                    if(data.staffId) document.getElementById('profileStaffId').textContent = data.staffId;
                    if(data.phoneNumber) document.getElementById('profilePhone').textContent = data.phoneNumber;
                    if(data.block) document.getElementById('profileBlock').textContent = data.block;
                    if(data.displayName) document.getElementById('profileName').textContent = data.displayName;
                } else if`;
    content = content.replace(loadProfileDataRegex, newWardenLoadProfile);

    fs.writeFileSync('warden-profile.html', content);
    console.log('Updated warden-profile.html');
}

// --- STUDENT PROFILE ---
if (fs.existsSync('student-profile.html')) {
    let content = fs.readFileSync('student-profile.html', 'utf8');

    // 1. Add IDs if missing
    content = content.replace(
        /<span class="detail-label">Room<\/span>\s*<span class="detail-value">(-)?<\/span>/,
        '<span class="detail-label">Room</span>\n                        <span class="detail-value" id="profileRoom">-</span>'
    );
    // profileId and profilePhone already have IDs from previous edit

    // 2. Replace Modal HTML
    const newStudentModalHtml = `
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
                    <label>ID / IC Number</label>
                    <input type="text" id="editId" required>
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" id="editPhone" required>
                </div>
                <div class="form-group">
                    <label>Room</label>
                    <input type="text" id="editRoom" placeholder="e.g. A1-01-01" required>
                </div>
                <button type="submit" class="save-btn" id="saveProfileBtn">Save Changes</button>
            </form>
        </div>
    </div>`;
    
    content = content.replace(/<!-- Edit Profile Modal -->[\s\S]*?<\/div>\s*<\/div>/, newStudentModalHtml);

    // 3. Replace JS logic for editing
    const jsLogicRegex = /\/\/ Modal Logic[\s\S]*?async function loadProfileData\(user\) \{/g;
    const newStudentJsLogic = `// Modal Logic
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
            document.getElementById('editRoom').value = document.getElementById('profileRoom').textContent !== '-' ? document.getElementById('profileRoom').textContent : '';
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
            const newRoom = document.getElementById('editRoom').value || '-';
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
                    room: newRoom,
                    updatedAt: new Date()
                }, { merge: true });

                document.getElementById('profileId').textContent = newId;
                document.getElementById('profilePhone').textContent = newPhone;
                document.getElementById('profileRoom').textContent = newRoom;
                
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
        async function loadProfileData(user) {`;
    
    content = content.replace(jsLogicRegex, newStudentJsLogic);

    // 4. Update loadProfileData
    const loadProfileDataRegex = /if \(docSnap\.exists\(\)\) \{[\s\S]*?\} else if/g;
    const newStudentLoadProfile = `if (docSnap.exists()) {
                    const data = docSnap.data();
                    if(data.idNumber) document.getElementById('profileId').textContent = data.idNumber;
                    if(data.phoneNumber) document.getElementById('profilePhone').textContent = data.phoneNumber;
                    if(data.room) document.getElementById('profileRoom').textContent = data.room;
                    if(data.displayName) document.getElementById('profileName').textContent = data.displayName;
                } else if`;
    content = content.replace(loadProfileDataRegex, newStudentLoadProfile);

    fs.writeFileSync('student-profile.html', content);
    console.log('Updated student-profile.html');
}
