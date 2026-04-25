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
const cachedAvatar = localStorage.getItem('userAvatar');
if (cachedAvatar) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => applyAvatar(cachedAvatar));
    } else {
        applyAvatar(cachedAvatar);
    }
}

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            // 2. Fetch fresh avatar from Firestore in background
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().photoURL) {
                const photoURL = docSnap.data().photoURL;
                // Cache it for the next page load
                localStorage.setItem('userAvatar', photoURL);
                // Apply it
                applyAvatar(photoURL);
            }
        } catch (e) {
            console.error("Global avatar load error:", e);
        }
    } else {
        // Clear cache on logout
        localStorage.removeItem('userAvatar');
    }
});

export { app, auth, db, storage };
