const fs = require('fs');

const files = [
    'room-apply.html',
    'move-out.html',
    'student-profile.html'
];

const bellHtml = `
            <!-- Notification Bell -->
            <a href="#" class="notification-container" id="notificationBell" title="Notifications">
                <i class="fas fa-bell notification-bell"></i>
                <span class="notification-badge hidden" id="notificationBadge">0</span>
            </a>
            <!-- Avatar Icon -->`;

const jsImports = `
        import { getFirestore, collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";`;

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

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // 1. Inject HTML Bell Icon
    // Look for: <!-- Avatar Icon
    if (!content.includes('id="notificationBell"')) {
        content = content.replace(/<!-- Avatar Icon/g, bellHtml);
    }
    
    // 2. Inject JS Imports
    // We need to add getFirestore, collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch
    // Most files have import { getAuth, ... } from "firebase-auth.js";
    // We can inject our import right after auth import.
    if (!content.includes('writeBatch')) {
        const authImportMatch = content.match(/import \{ getAuth.*?\}.*?firebase-auth\.js";/);
        if (authImportMatch) {
            content = content.replace(authImportMatch[0], authImportMatch[0] + '\\n' + jsImports);
        } else {
            console.log('Could not find auth import in ' + file);
        }
    }
    
    // 3. Inject JS Logic
    // We can inject it right before the closing </script> tag at the end of the file.
    if (!content.includes('notificationBell.addEventListener')) {
        content = content.replace(/<\/script>\s*<\/body>/, jsLogic + '\\n    </script>\\n</body>');
    }
    
    fs.writeFileSync(file, content);
    console.log('Patched ' + file);
});
