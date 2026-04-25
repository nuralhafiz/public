const fs = require('fs');

let content = fs.readFileSync('c:/Users/Al Hafiz/public/warden-students.html', 'utf8');

// Fix Sidebar
content = content.replace(/<nav id="sidebar">[\s\S]*?<div class="nav-menu">[\s\S]*?<a href="warden-dashboard.html"/, `<nav id="sidebar">
            <div class="warden-profile-sidebar" style="display:flex; align-items:center; gap:15px; padding:20px; border-bottom:1px solid #eee; margin-bottom:15px;">
                <div class="w-avatar" style="width:50px; height:50px; border-radius:50%; overflow:hidden;">
                    <img id="sidebarUserAvatar" src="images/default-warden.png" alt="Warden" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="w-info">
                    <h4 id="sidebarUserName" style="font-size:16px; margin:0; color:#0f1638;">Loading...</h4>
                    <p style="font-size:12px; color:#666; margin:0;">Warden</p>
                </div>
            </div>
            <div class="nav-menu">
                <a href="warden-profile.html" class="nav-item"><i class="fas fa-user"></i> My Profile</a>
                <a href="warden-dashboard.html"`);

// Fix Header Logo text
content = content.replace(/<div class="brand-container">[\s\S]*?<span class="brand-dot">•<\/span> <span class="brand-blue">GMI<\/span>[\s\S]*?<span class="brand-lime">-HK<\/span>[\s\S]*?<\/div>/, `<div class="brand-container" onclick="window.location.href='index.html'">
                <span class="gmi-wrapper"><span class="brand-blue">GMI</span><span class="brand-dot"></span></span><span class="brand-lime">HostelKu.</span>
            </div>`);

// Fix Firebase Imports
const firebaseOldRegex = /<script type="module">\s*import { initializeApp } from "https:\/\/www\.gstatic\.com\/firebasejs\/10\.8\.0\/firebase-app\.js";[\s\S]*?const db = getFirestore\(app\);/m;
const firebaseNew = `<script type="module">
        import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
        import { getFirestore, collection, query, orderBy, getDocs, onSnapshot, doc, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
        import { auth, db } from "./js/firebase-config.js";`;

content = content.replace(firebaseOldRegex, firebaseNew);

// Since update-avatars.js is what populates the profile avatars, ensure it is included at the end of the body
if(!content.includes('<script type="module" src="update-avatars.js"></script>')) {
    content = content.replace('</body>', '    <script type="module" src="update-avatars.js"></script>\n</body>');
}

fs.writeFileSync('c:/Users/Al Hafiz/public/warden-students.html', content);
console.log("All fixes applied successfully via regex!");
