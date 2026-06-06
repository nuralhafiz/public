import re

with open('room-apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the old timeframe check in DOMContentLoaded
old_timeframe = """            // Fetch timeframe settings
            getDoc(doc(db, "settings", "application_period")).then(docSnap => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const startDate = data.startDate; // expected YYYY-MM-DD
                    const endDate = data.endDate;     // expected YYYY-MM-DD
                    
                    if (startDate && endDate) {
                        if (today < startDate || today > endDate) {
                            // Close application
                            document.getElementById('applyForm').style.display = 'none';
                            document.querySelector('.info-banner').style.display = 'none';
                            const msgText = document.getElementById('closedMessageText');
                            msgText.innerHTML = `The room application period has ended.<br><br><strong>Application Period:</strong><br>${startDate} to ${endDate}`;
                            document.getElementById('closedMessage').style.display = 'block';
                        }
                    }
                }
            }).catch(err => console.error("Error fetching timeframe:", err));"""

content = content.replace(old_timeframe, "            // Timeframe check moved to onAuthStateChanged")

# 2. Add the checkTimeframeForSemester function and call it
old_profile_fetch = """                // Fetch profile data to autofill form
                getDoc(doc(db, "users", user.uid)).then(docSnap => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.displayName && !document.getElementById('fullName').value) {
                            document.getElementById('fullName').value = data.displayName;
                        }"""

new_profile_fetch = """                // Fetch profile data to autofill form
                getDoc(doc(db, "users", user.uid)).then(docSnap => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const userSemester = data.semester || '1'; // Default to Semester 1 if missing
                        
                        // Check timeframe based on semester
                        checkTimeframeForSemester(userSemester);
                        
                        if (data.displayName && !document.getElementById('fullName').value) {
                            document.getElementById('fullName').value = data.displayName;
                        }"""

content = content.replace(old_profile_fetch, new_profile_fetch)

# 3. Inject checkTimeframeForSemester function
inject_func = """
        function checkTimeframeForSemester(semester) {
            const today = new Date().toISOString().split('T')[0];
            getDoc(doc(db, "settings", "application_period")).then(docSnap => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const startDate = data[`sem${semester}_start`];
                    const endDate = data[`sem${semester}_end`];
                    
                    if (!startDate || !endDate || today < startDate || today > endDate) {
                        // Close application
                        document.getElementById('applyForm').style.display = 'none';
                        const infoBanner = document.querySelector('.info-banner');
                        if (infoBanner) infoBanner.style.display = 'none';
                        const msgText = document.getElementById('closedMessageText');
                        
                        if (!startDate || !endDate) {
                            msgText.innerHTML = `Permohonan asrama untuk pelajar Semester ${semester} belum dibuka. Sila rujuk jadual.`;
                        } else if (today < startDate) {
                            msgText.innerHTML = `Permohonan asrama untuk pelajar Semester ${semester} belum dibuka. Ia akan dibuka pada <strong>${startDate}</strong>.`;
                        } else {
                            msgText.innerHTML = `Permohonan asrama untuk pelajar Semester ${semester} telah ditutup pada <strong>${endDate}</strong>.`;
                        }
                        document.getElementById('closedMessage').style.display = 'block';
                    }
                }
            }).catch(err => console.error("Error fetching timeframe:", err));
        }

        // Check if user is logged in and pre-fill email
"""
content = content.replace("        // Check if user is logged in and pre-fill email", inject_func)

with open('room-apply.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done updating room-apply.html")
