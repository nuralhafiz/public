import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBUIG4ZIanXbeEPeqaBO5ifkH_KiAg5M8w",
    authDomain: "gmi-hostelku.firebaseapp.com",
    projectId: "gmi-hostelku",
    storageBucket: "gmi-hostelku.firebasestorage.app",
    messagingSenderId: "556053021509",
    appId: "1:556053021509:web:d64966c34ae18e3d12f42c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Force session persistence globally across all pages immediately on load
setPersistence(auth, browserSessionPersistence).catch(console.error);

const db = getFirestore(app);
const storage = getStorage(app);

// Global Avatar Loader with Instant Local Caching
const applyAvatar = (photoURL) => {
    document.querySelectorAll('.avatar-container').forEach(container => {
        container.dataset.loaded = 'true';
        container.innerHTML = `<img src="${photoURL}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        container.style.background = 'none';
        container.style.padding = '0';
        container.style.border = '2px solid rgba(255, 255, 255, 0.9)';
        
        // Hide pseudo elements
        if (!document.getElementById('avatar-style-fix')) {
            const style = document.createElement('style');
            style.id = 'avatar-style-fix';
            style.textContent = '.avatar-container::after { display: none !important; }';
            document.head.appendChild(style);
        }
    });
};

// 1. Instantly apply cached avatar if it exists (Zero delay)
const lastUid = localStorage.getItem('currentUserUid');
if (lastUid) {
    const cachedAvatar = localStorage.getItem('userAvatar_' + lastUid);
    if (cachedAvatar) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => applyAvatar(cachedAvatar));
        } else {
            applyAvatar(cachedAvatar);
        }
    }
}

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
onAuthStateChanged(auth, async (user) => {
    if (user) {
        localStorage.setItem('currentUserUid', user.uid);
        
        // Super Admin Link Injection
        if (user.email === 'admin.gmihostelku@gmail.com') {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && !document.getElementById('superAdminLink')) {
                const adminLink = document.createElement('a');
                adminLink.href = 'warden-management.html';
                adminLink.className = 'nav-item';
                adminLink.id = 'superAdminLink';
                if(window.location.pathname.includes('warden-management.html')) {
                    adminLink.classList.add('active');
                }
                adminLink.style.background = 'linear-gradient(135deg, #FF9800 0%, #F44336 100%)';
                adminLink.style.color = 'white';
                adminLink.style.marginTop = '20px';
                adminLink.style.boxShadow = '0 5px 15px rgba(244, 67, 54, 0.4)';
                adminLink.innerHTML = '<i class="fas fa-user-shield"></i> Warden Admin';
                navMenu.appendChild(adminLink);
            }
        }
        
        try {
            // 2. Fetch fresh avatar from Firestore in background
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().photoURL) {
                const photoURL = docSnap.data().photoURL;
                // Cache it for the next page load bound to this specific UID
                localStorage.setItem('userAvatar_' + user.uid, photoURL);
                // Apply it
                applyAvatar(photoURL);
            } else {
                // If user doesn't have an avatar, clear any cached avatar for this UID
                localStorage.removeItem('userAvatar_' + user.uid);
                // If the DOM was already modified by a lingering cache, reset it to default icon
                document.querySelectorAll('.avatar-container').forEach(container => {
                    const isStudent = user.email && user.email.endsWith('@student.gmi.edu.my');
                    container.innerHTML = `<i class="fas fa-user${isStudent ? '-graduate' : ''}"></i>`;
                    container.style.background = '';
                    container.style.padding = '';
                    container.style.border = '';
                });
            }
        } catch (e) {
            console.error("Global avatar load error:", e);
        }
    } else {
        // Clear current active UID on logout
        localStorage.removeItem('currentUserUid');
    }
});

export { app, auth, db, storage, firebaseConfig };
