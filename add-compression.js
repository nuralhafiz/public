const fs = require('fs');

function addCompression(filename) {
    if (!fs.existsSync(filename)) return;
    let content = fs.readFileSync(filename, 'utf8');

    const compressionHelper = `
        // Image compression helper
        async function compressImage(file, maxWidth = 500, maxHeight = 500) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = event => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        let width = img.width;
                        let height = img.height;
                        
                        if (width > height) {
                            if (width > maxWidth) {
                                height *= maxWidth / width;
                                width = maxWidth;
                            }
                        } else {
                            if (height > maxHeight) {
                                width *= maxHeight / height;
                                height = maxHeight;
                            }
                        }
                        
                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        canvas.toBlob(blob => {
                            resolve(new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            }));
                        }, 'image/jpeg', 0.8);
                    };
                    img.onerror = error => reject(error);
                };
                reader.onerror = error => reject(error);
            });
        }

        function updateAvatarUI`;

    // Inject compression helper
    if (!content.includes('async function compressImage')) {
        content = content.replace('function updateAvatarUI', compressionHelper);
    }

    // Use compression helper in the upload logic
    const oldUploadLogic = `const storageRef = ref(storage, \`profile_pictures/\${user.uid}_\${Date.now()}\`);
                    await uploadBytes(storageRef, photoFile);`;
    const newUploadLogic = `saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Compressing & Uploading...';
                    const compressedFile = await compressImage(photoFile);
                    const storageRef = ref(storage, \`profile_pictures/\${user.uid}_\${Date.now()}.jpg\`);
                    await uploadBytes(storageRef, compressedFile);`;

    if (!content.includes('await compressImage(photoFile)')) {
        content = content.replace(/saveBtn\.innerHTML = '<i class="fas fa-spinner fa-spin"><\/i> Uploading Image\.\.\.';\s*const storageRef = ref\(storage, `profile_pictures\/\$\{user\.uid\}_\$\{Date\.now\(\)\}`\);\s*await uploadBytes\(storageRef, photoFile\);/g, newUploadLogic);
    }

    fs.writeFileSync(filename, content);
    console.log('Added compression to ' + filename);
}

addCompression('student-profile.html');
addCompression('warden-profile.html');
