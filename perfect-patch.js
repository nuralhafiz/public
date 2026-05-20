const fs = require('fs');

const unifiedImport = 'import { getFirestore, collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch, addDoc, serverTimestamp, getDoc, setDoc, getDocs, limit, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";';

const bellHtml1 = `            <!-- Notification Bell -->
            <a href="#" class="notification-container" id="notificationBell" title="Notifications">
                <i class="fas fa-bell notification-bell"></i>
                <span class="notification-badge hidden" id="notificationBadge">0</span>
            </a>
            <!-- Avatar Icon -->`;

const bellHtml2 = `<div style="display: flex; align-items: center; gap: 10px;">
            <!-- Notification Bell -->
            <a href="#" class="notification-container" id="notificationBell" title="Notifications">
                <i class="fas fa-bell notification-bell"></i>
                <span class="notification-badge hidden" id="notificationBadge">0</span>
            </a>
            <a href="student-profile.html" class="avatar-container" title="Navigation Link">`;

const jsLogic = `
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
`;

function processFile(file) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Inject HTML Bell
    if (!content.includes('id="notificationBell"')) {
        if (file === 'student-profile.html') {
            const t1 = '<div style="display: flex; align-items: center; gap: 10px;">\n            <a href="student-profile.html" class="avatar-container" title="Navigation Link">';
            const t2 = '<div style="display: flex; align-items: center; gap: 10px;">\r\n            <a href="student-profile.html" class="avatar-container" title="Navigation Link">';
            if (content.includes(t1)) content = content.replace(t1, bellHtml2);
            else if (content.includes(t2)) content = content.replace(t2, bellHtml2);
        } else {
            content = content.replace(/<!-- Avatar Icon/g, bellHtml1);
        }
    }

    // 2. Fix firestore imports
    // Remove all old firestore imports
    let lines = content.split(/\r?\n/);
    lines = lines.filter(line => !line.includes('firebase-firestore.js'));
    content = lines.join('\n');

    // Insert unified import after auth
    const authRegex = /import\s+\{[^}]+\}\s+from\s+"https:\/\/www\.gstatic\.com\/firebasejs\/10\.8\.0\/firebase-auth\.js";/;
    content = content.replace(authRegex, match => match + '\n        ' + unifiedImport);

    // 3. Inject JS Logic
    if (!content.includes('notificationBell.addEventListener')) {
        content = content.replace(/<\/script>\s*<\/body>/, jsLogic + '\n    </script>\n</body>');
    }

    fs.writeFileSync(file, content);
    console.log("Processed " + file);
}

const files = [
    'student-profile.html',
    'room-apply.html',
    'move-out.html',
    'student-dashboard.html',
    'maintenance.html'
];

files.forEach(processFile);
