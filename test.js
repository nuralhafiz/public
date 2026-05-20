
        import { getAuth, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";import { getFirestore, collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch, addDoc, serverTimestamp, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
\n
        import { auth, db, storage } from "./js/firebase-config.js?v=2";
        import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

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
                const email = user.email ? user.email.toLowerCase() : '';
                const isStudent = email.endsWith('@student.gmi.edu.my');
                
                if (!isStudent) {
                    alert('🛡️ Access Denied: Warden accounts cannot access Student pages.');
                    window.location.href = 'warden-dashboard.html';
                    return;
                }
                // RBAC PASS
            }
            if (user) {
                const cachedAvatar = localStorage.getItem('avatar_' + user.uid);
                if (cachedAvatar) updateAvatarUI(cachedAvatar);

                // Display user info
                document.getElementById('profileName').textContent = user.displayName || user.email.split('@')[0];
                loadProfileData(user);

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
            const photoFile = document.getElementById('editPhoto').files[0];
            const user = auth.currentUser;
            let newPhotoUrl = user.photoURL;

            try {
                if (photoFile) {
                    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Compressing & Saving...';
                    newPhotoUrl = await compressImage(photoFile);
                    updateAvatarUI(newPhotoUrl);
                }
        
                if (newName !== user.displayName) {
                    await updateProfile(user, { displayName: newName });
                    document.getElementById('profileName').textContent = newName;
                }
                // photoURL is too long for Firebase Auth when using Base64.
                // We intentionally skip updating Auth photoURL and only rely on Firestore photoURL.

                const updateData = {
                    displayName: newName,
                    idNumber: newId,
                    phoneNumber: newPhone,
                    room: newRoom,
                    updatedAt: new Date()
                };
                if (photoFile) {
                    updateData.photoURL = newPhotoUrl;
                }

                await setDoc(doc(db, "users", user.uid), updateData, { merge: true });

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
                        
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                        resolve(dataUrl);
                    };
                    img.onerror = error => reject(error);
                };
                reader.onerror = error => reject(error);
            });
        }

        function updateAvatarUI(url) {
            if (auth.currentUser) {
                localStorage.setItem('avatar_' + auth.currentUser.uid, url);
            }
            const mainAvatar = document.querySelector('.profile-avatar');
            if(mainAvatar) mainAvatar.innerHTML = `<img src="${url}" style="width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 3px solid #0f1638; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">`;
            
            const headerAvatar = document.querySelector('.avatar-container');
            if(headerAvatar) headerAvatar.innerHTML = `<img src="${url}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #0f1638;">`;
            
            // Also try to update header avatars on the wider application if applicable
            document.querySelectorAll('.avatar-container').forEach(container => {
                container.innerHTML = `<img src="${url}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #0f1638;">`;
            });
        }
    
        // Load profile data function
        async function loadProfileData(user) {
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if(data.idNumber) document.getElementById('profileId').textContent = data.idNumber;
                    if(data.phoneNumber) document.getElementById('profilePhone').textContent = data.phoneNumber;
                    if(data.room) document.getElementById('profileRoom').textContent = data.room;
                    if(data.displayName) document.getElementById('profileName').textContent = data.displayName;
                    if(data.photoURL) updateAvatarUI(data.photoURL);
                    else if(user.photoURL) updateAvatarUI(user.photoURL);
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
    
    
        // ── Notification Logic ─────────────────────────────────────────────
        const notificationBell = document.getElementById('notificationBell');
        const notificationBadge = document.getElementById('notificationBadge');
        let unreadNotifications = [];

        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Setup realtime listener for notifications
                const q = query(
                    collection(db, "notifications"), 
                    where("recipientEmail", "==", user.email),
                    where("isRead", "==", false)
                );
                
                onSnapshot(q, (snapshot) => {
                    unreadNotifications = [];
                    snapshot.forEach((doc) => {
                        unreadNotifications.push({ id: doc.id, ...doc.data() });
                    });
                    
                    // Sort by timestamp manually since we can't easily compound order by with inequality without composite index
                    unreadNotifications.sort((a, b) => {
                        const timeA = a.timestamp ? a.timestamp.toMillis() : 0;
                        const timeB = b.timestamp ? b.timestamp.toMillis() : 0;
                        return timeB - timeA; // descending
                    });

                    if (unreadNotifications.length > 0) {
                        notificationBadge.textContent = unreadNotifications.length > 9 ? '9+' : unreadNotifications.length;
                        notificationBadge.classList.remove('hidden');
                    } else {
                        notificationBadge.classList.add('hidden');
                    }
                });
            }
        });

        if (notificationBell) {
            notificationBell.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (unreadNotifications.length === 0) {
                    Swal.fire({ heightAuto: false,
                        icon: 'info',
                        title: 'No new messages',
                        text: 'You have read all your messages.',
                        confirmButtonColor: '#2d72d2'
                    });
                    return;
                }

                let htmlContent = '<div style="text-align: left; max-height: 300px; overflow-y: auto;">';
                unreadNotifications.forEach(notif => {
                    const dateObj = notif.timestamp ? notif.timestamp.toDate() : new Date();
                    const dateStr = dateObj.toLocaleDateString('en-MY') + ' ' + dateObj.toLocaleTimeString('en-MY', {hour: '2-digit', minute:'2-digit'});
                    htmlContent += '<div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #2d72d2;">';
                    htmlContent += '<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">';
                    htmlContent += '<strong>' + (notif.sender || 'Warden') + '</strong>';
                    htmlContent += '<small style="color: #64748b;">' + dateStr + '</small></div>';
                    htmlContent += '<p style="margin: 0; color: #334155; font-size: 14px;">' + notif.message + '</p></div>';
                });
                htmlContent += '</div>';

                Swal.fire({ heightAuto: false,
                    title: 'Your Messages',
                    html: htmlContent,
                    confirmButtonText: 'Mark all as read',
                    showCancelButton: true,
                    cancelButtonText: 'Close',
                    confirmButtonColor: '#2d72d2'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        // Mark all as read
                        try {
                            const batch = writeBatch(db);
                            unreadNotifications.forEach(notif => {
                                const ref = doc(db, "notifications", notif.id);
                                batch.update(ref, { isRead: true });
                            });
                            await batch.commit();
                        } catch (error) {
                            console.error("Error marking messages as read:", error);
                        }
                    }
                });
            });
        }
        // ───────────────────────────────────────────────────────────────────

    