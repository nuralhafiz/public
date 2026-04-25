const fs = require('fs');

function processFile(filename) {
    if (!fs.existsSync(filename)) return;
    let content = fs.readFileSync(filename, 'utf8');

    // 1. Add storage imports
    if (!content.includes('firebase-storage.js')) {
        content = content.replace(
            /import \{ doc, getDoc, setDoc \} from "https:\/\/www.gstatic.com\/firebasejs\/10.8.0\/firebase-firestore.js";/,
            'import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";\n        import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";'
        );
    }
    if (!content.includes('db, storage')) {
        content = content.replace(
            /import \{ auth, db \} from "\.\/js\/firebase-config.js";/,
            'import { auth, db, storage } from "./js/firebase-config.js";'
        );
    }

    // 2. Add input file to Modal Form
    const inputPicHtml = `
                <div class="form-group">
                    <label>Profile Picture</label>
                    <input type="file" id="editPhoto" accept="image/png, image/jpeg, image/webp">
                </div>
                <div class="form-group">
                    <label>Full Name</label>`;
    if (!content.includes('id="editPhoto"')) {
        content = content.replace(/<div class="form-group">\s*<label>Full Name<\/label>/, inputPicHtml);
    }

    // 3. Helper function to update UI avatars
    const avatarHelper = `
        function updateAvatarUI(url) {
            const avatarHtml = \`<img src="\${url}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">\`;
            const mainAvatar = document.querySelector('.profile-avatar');
            if(mainAvatar) mainAvatar.innerHTML = avatarHtml;
            const headerAvatar = document.querySelector('.avatar-container');
            if(headerAvatar) headerAvatar.innerHTML = avatarHtml;
        }
    `;
    if (!content.includes('function updateAvatarUI')) {
        content = content.replace('// Load profile data function', avatarHelper + '\n        // Load profile data function');
    }

    // 4. Submit event logic for photo upload
    const uploadLogic = `
            const newName = document.getElementById('editName').value;
            const photoFile = document.getElementById('editPhoto').files[0];
            const user = auth.currentUser;
            let newPhotoUrl = user.photoURL;

            try {
                if (photoFile) {
                    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading Image...';
                    const storageRef = ref(storage, \`profile_pictures/\${user.uid}\`);
                    await uploadBytes(storageRef, photoFile);
                    newPhotoUrl = await getDownloadURL(storageRef);
                    updateAvatarUI(newPhotoUrl);
                }
    `;
    
    // We replace the beginning of try block in the submit listener
    const oldSubmitStart = /const newName = document\.getElementById\('editName'\)\.value;[\s\S]*?const user = auth\.currentUser;\s*try \{/g;
    
    // Different variables based on file (warden vs student)
    if (filename === 'warden-profile.html') {
        const wardenUploadLogic = `
            const newName = document.getElementById('editName').value;
            const newStaffId = document.getElementById('editStaffId').value;
            const newPhone = document.getElementById('editPhone').value;
            const newBlock = document.getElementById('editBlock').value || '-';
            const photoFile = document.getElementById('editPhoto').files[0];
            const user = auth.currentUser;
            let newPhotoUrl = user.photoURL;

            try {
                if (photoFile) {
                    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading Image...';
                    const storageRef = ref(storage, \`profile_pictures/\${user.uid}_\${Date.now()}\`);
                    await uploadBytes(storageRef, photoFile);
                    newPhotoUrl = await getDownloadURL(storageRef);
                    updateAvatarUI(newPhotoUrl);
                }
        `;
        content = content.replace(/const newName = document\.getElementById\('editName'\)\.value;[\s\S]*?const user = auth\.currentUser;\s*try \{/, wardenUploadLogic);
    } else {
        const studentUploadLogic = `
            const newName = document.getElementById('editName').value;
            const newId = document.getElementById('editId').value;
            const newPhone = document.getElementById('editPhone').value;
            const newRoom = document.getElementById('editRoom').value || '-';
            const photoFile = document.getElementById('editPhoto').files[0];
            const user = auth.currentUser;
            let newPhotoUrl = user.photoURL;

            try {
                if (photoFile) {
                    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading Image...';
                    const storageRef = ref(storage, \`profile_pictures/\${user.uid}_\${Date.now()}\`);
                    await uploadBytes(storageRef, photoFile);
                    newPhotoUrl = await getDownloadURL(storageRef);
                    updateAvatarUI(newPhotoUrl);
                }
        `;
        content = content.replace(/const newName = document\.getElementById\('editName'\)\.value;[\s\S]*?const user = auth\.currentUser;\s*try \{/, studentUploadLogic);
    }

    // 5. Update Profile with photoURL
    if (content.includes('await updateProfile(user, { displayName: newName });')) {
        content = content.replace('await updateProfile(user, { displayName: newName });', 'await updateProfile(user, { displayName: newName, photoURL: newPhotoUrl });');
    } else if (!content.includes('photoURL: newPhotoUrl')) {
         // if it was updated previously, or if it wasn't, let's just make sure we update it
         const updateProfileBlock = `
                if (newName !== user.displayName || photoFile) {
                    await updateProfile(user, { displayName: newName, photoURL: newPhotoUrl });
                    document.getElementById('profileName').textContent = newName;
                }
         `;
         content = content.replace(/if \(newName !== user\.displayName\) \{[\s\S]*?\}/, updateProfileBlock);
    }

    // 6. Update Firestore setDoc with photoURL
    if (!content.includes('photoURL: newPhotoUrl')) {
        content = content.replace(/updatedAt: new Date\(\)/, 'photoURL: newPhotoUrl,\n                    updatedAt: new Date()');
    }

    // 7. loadProfileData to update avatar on load
    const loadDataRegex = /if\(data\.displayName\) document\.getElementById\('profileName'\)\.textContent = data\.displayName;/;
    const appendPhotoData = `if(data.displayName) document.getElementById('profileName').textContent = data.displayName;
                    if(data.photoURL) updateAvatarUI(data.photoURL);
                    else if(user.photoURL) updateAvatarUI(user.photoURL);`;
    
    if (!content.includes('if(data.photoURL) updateAvatarUI(data.photoURL);')) {
        content = content.replace(loadDataRegex, appendPhotoData);
    }

    fs.writeFileSync(filename, content);
    console.log("Updated " + filename);
}

processFile('student-profile.html');
processFile('warden-profile.html');
