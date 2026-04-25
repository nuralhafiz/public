const fs = require('fs');

const files = ['student-profile.html', 'warden-profile.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Fix the updateProfile call (remove photoURL update)
    const oldUpdateAuth = /if \(newName !== user\.displayName \|\| photoFile\) \{\s*await updateProfile\(user, \{ displayName: newName, photoURL: newPhotoUrl \}\);\s*document\.getElementById\('profileName'\)\.textContent = newName;\s*\}/g;
    
    const newUpdateAuth = `if (newName !== user.displayName) {
                    await updateProfile(user, { displayName: newName });
                    document.getElementById('profileName').textContent = newName;
                }
                // photoURL is too long for Firebase Auth when using Base64.
                // We intentionally skip updating Auth photoURL and only rely on Firestore photoURL.`;

    content = content.replace(oldUpdateAuth, newUpdateAuth);

    // 2. Fix the updateAvatarUI image sizing
    const oldUpdateAvatar = /function updateAvatarUI\(url\) \{\s*const avatarHtml = `<img src="\$\{url\}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;\s*const mainAvatar = document\.querySelector\('\.profile-avatar'\);\s*if\(mainAvatar\) mainAvatar\.innerHTML = avatarHtml;\s*const headerAvatar = document\.querySelector\('\.avatar-container'\);\s*if\(headerAvatar\) headerAvatar\.innerHTML = avatarHtml;\s*\}/g;

    const newUpdateAvatar = `function updateAvatarUI(url) {
            const mainAvatar = document.querySelector('.profile-avatar');
            if(mainAvatar) mainAvatar.innerHTML = \`<img src="\${url}" style="width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 3px solid #0f1638; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">\`;
            
            const headerAvatar = document.querySelector('.avatar-container');
            if(headerAvatar) headerAvatar.innerHTML = \`<img src="\${url}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #0f1638;">\`;
            
            // Also try to update header avatars on the wider application if applicable
            document.querySelectorAll('.avatar-container').forEach(container => {
                container.innerHTML = \`<img src="\${url}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #0f1638;">\`;
            });
        }`;

    content = content.replace(oldUpdateAvatar, newUpdateAvatar);

    fs.writeFileSync(file, content);
    console.log("Fixed " + file);
});
