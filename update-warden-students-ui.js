const fs = require('fs');

let content = fs.readFileSync('c:/Users/Al Hafiz/public/warden-students.html', 'utf8');

// 1. Replace body and main backgrounds
content = content.replace(/body\s*\{[^}]*background:\s*linear-gradient\(135deg,\s*#667eea\s*0%,\s*#764ba2\s*100%\)[^}]*\}/g, (match) => {
    return match.replace('linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '#f0f3fa');
});
content = content.replace(/main\s*\{[^}]*background:\s*linear-gradient\(135deg,\s*#667eea\s*0%,\s*#764ba2\s*100%\)[^}]*\}/g, (match) => {
    return match.replace('linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '#f0f3fa');
});

// 2. Header background
content = content.replace(/header\s*\{\s*background:\s*rgba\(15,\s*22,\s*56,\s*0\.95\);/g, 'header { background: linear-gradient(135deg, #1e3a8a 0%, #2d72d2 100%);');

// 3. Other gradients to corporate blue
content = content.replace(/linear-gradient\(135deg,\s*#667eea\s*0%,\s*#764ba2\s*100%\)/g, 'linear-gradient(135deg, #1e3a8a 0%, #2d72d2 100%)');

// 4. Solid purples to blue
content = content.replace(/#667eea/g, '#2d72d2');
content = content.replace(/#764ba2/g, '#1e3a8a');

// 5. Update Logo CSS
const unifiedLogoCSS = `    <style id="unified-logo-style">
        .gmi-wrapper {
            position: relative;
            display: inline-block;
            line-height: 1;
            padding-right: 0.05em; /* Padding for the wrapper */
        }
        .brand-blue {
            color: #1118a8; /* Deep blue from image */
            font-weight: 900;
            font-family: 'Arial', sans-serif;
            letter-spacing: -1px;
            text-shadow: 
                -0.8px -0.8px 0 #fff, 0px -0.8px 0 #fff, 0.8px -0.8px 0 #fff, 0.8px 0px 0 #fff, 0.8px 0.8px 0 #fff, 0px 0.8px 0 #fff, -0.8px 0.8px 0 #fff, -0.8px 0px 0 #fff, 0 4px 6px rgba(0,0,0,0.3);
        }
        .brand-dot {
            position: absolute;
            top: -0.24em;
            right: 0.05em;
            width: 0.32em;
            height: 0.32em;
            background-color: #f93144;
            border-radius: 50%;
            box-shadow: 0 0 0 0.8px #fff, 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        .brand-lime {
            color: #ccff00;
            margin-left: 5px;
            font-family: 'Poppins', sans-serif;
            font-weight: 800;
            text-shadow: 
                -0.8px -0.8px 0 #000, 0px -0.8px 0 #000, 0.8px -0.8px 0 #000, 0.8px 0px 0 #000, 0.8px 0.8px 0 #000, 0px 0.8px 0 #000, -0.8px 0.8px 0 #000, -0.8px 0px 0 #000, 0 4px 6px rgba(0,0,0,0.3);
        }
        .brand-container {
            font-size: 32px !important;
            display: flex; 
            align-items: center; 
            font-weight: 800; 
            cursor: pointer; 
            position: relative; 
            margin-left: 10px;
            letter-spacing: -0.5px;
        }
    </style>
</head>`;
content = content.replace('</head>', unifiedLogoCSS);

// 6. Header Replacement (Logo + Avatar)
const headerOld = `<header>
        <div style="display: flex; align-items: center;">
            <i class="fas fa-bars menu-toggle" id="hamburger"></i>
            <div class="brand-container">
                <span class="brand-dot">•</span> <span class="brand-blue">GMI</span>
                <span class="brand-lime">-HK</span>
            </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
            <a href="warden-profile.html" class="avatar-container" id="profileLink">
                <i class="fas fa-user-circle"></i>
            </a>
        </div>
    </header>`;
const headerNew = `<header>
        <div style="display: flex; align-items: center;">
            <i class="fas fa-bars menu-toggle" id="hamburger"></i>
            <div class="brand-container" onclick="window.location.href='index.html'">
                <span class="gmi-wrapper"><span class="brand-blue">GMI</span><span class="brand-dot"></span></span><span class="brand-lime">HostelKu.</span>
            </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
            <a href="warden-profile.html" class="avatar-container" id="profileLink">
                <img id="headerUserAvatar" src="images/default-warden.png" alt="Warden" style="width:100%; height:100%; object-fit:cover;">
            </a>
        </div>
    </header>`;
content = content.replace(headerOld, headerNew);

// 7. Sidebar Replacement (Adding warden-profile-sidebar and My Profile link)
const sidebarOld = `<div class="container">
        <nav id="sidebar">
            <div class="nav-menu">
                <a href="warden-dashboard.html" class="nav-item"><i class="fas fa-home"></i> Dashboard</a>`;
const sidebarNew = `<div class="container">
        <nav id="sidebar">
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
                <a href="warden-dashboard.html" class="nav-item"><i class="fas fa-home"></i> Dashboard</a>`;
content = content.replace(sidebarOld, sidebarNew);

// 8. Firebase Imports Replacement
const firebaseOld = `<script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
        import { getFirestore, collection, query, orderBy, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
        const db = getFirestore(app);`;

const firebaseNew = `<script type="module">
        import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
        import { getFirestore, collection, query, orderBy, getDocs, onSnapshot, doc, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
        import { auth, db } from "./js/firebase-config.js";`;

content = content.replace(firebaseOld, firebaseNew);

// Since I overwrote warden-students.html with IQtK.html, the SweetAlert fixes from the previous chat ARE GONE!
// I MUST re-apply the SweetAlert fixes.
// Let's use the exact code that replaces alert() with Swal.fire().

const swalFuncOld = `window.editStudent = (id) => {
            alert(\`✏️ Editing student ID: \${id}\\n\\nThis feature will be available soon.\`);
        };

        window.messageStudent = (id) => {
            alert(\`💬 Sending message to student ID: \${id}\\n\\nThis feature will be available soon.\`);
        };

        window.moreActions = (id) => {
            alert(\`📋 More actions for student ID: \${id}\\n\\nThis feature will be available soon.\`);
        };

        window.goToPage = (page) => {
            currentPage = page;
            renderStudents();
        };

        // Modal Functions
        window.closeModal = () => {
            modal.classList.remove('active');
        };

        window.editCurrentStudent = () => {
            alert("✏️ Editing current student\\n\\nThis feature will be available soon.");
            closeModal();
        };

        window.messageCurrentStudent = () => {
            alert("💬 Sending message to student\\n\\nThis feature will be available soon.");
            closeModal();
        };

        // Quick Action Functions
        window.exportStudentList = () => {
            if (allStudents.length === 0) {
                alert("No student data to export. Please import student data first.");
                return;
            }
            alert("📥 Exporting student list as CSV...\\n\\nThis feature will export all student data.");
        };

        window.sendBulkMessage = () => {
            alert("📧 Opening bulk message composer...\\n\\nThis feature will be available soon.");
        };

        window.printDirectory = () => {
            if (allStudents.length === 0) {
                alert("No student data to print. Please import student data first.");
                return;
            }
            alert("🖨️ Preparing student directory for printing...\\n\\nThis feature will be available soon.");
        };

        window.addStudent = () => {
            alert("➕ Opening add student form...\\n\\nYou can add students manually here or import bulk data via Firebase Console.");
        };`;

const swalFuncNew = `window.editStudent = (id) => {
            const student = allStudents.find(s => s.id === id);
            if (!student) return;
            
            Swal.fire({
                title: 'Edit Student Details',
                html: \`
                    <div style="text-align:left; display:flex; flex-direction:column; gap:15px;">
                        <div><label>Course</label><input type="text" id="swalCourse" class="swal2-input" style="margin:0; width:100%;" value="\${student.course || ''}"></div>
                        <div><label>Phone</label><input type="text" id="swalPhone" class="swal2-input" style="margin:0; width:100%;" value="\${student.phone || ''}"></div>
                        <div><label>Emergency Contact</label><input type="text" id="swalEmergency" class="swal2-input" style="margin:0; width:100%;" value="\${student.emergencyContact || ''}"></div>
                        <div><label>Status</label>
                            <select id="swalStatus" class="swal2-input" style="margin:0; width:100%; height:auto; padding:10px;">
                                <option value="active" \${student.status === 'active' ? 'selected' : ''}>Active</option>
                                <option value="inactive" \${student.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                                <option value="pending" \${student.status === 'pending' ? 'selected' : ''}>Pending</option>
                            </select>
                        </div>
                    </div>
                \`,
                showCancelButton: true,
                confirmButtonText: 'Save Changes',
                confirmButtonColor: '#2d72d2',
                preConfirm: () => {
                    return {
                        course: document.getElementById('swalCourse').value,
                        phone: document.getElementById('swalPhone').value,
                        emergencyContact: document.getElementById('swalEmergency').value,
                        status: document.getElementById('swalStatus').value
                    }
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const studentRef = doc(db, "students", id);
                        await updateDoc(studentRef, result.value);
                        Swal.fire('Saved!', 'Student details have been updated.', 'success');
                    } catch (error) {
                        Swal.fire('Error', 'Failed to update student: ' + error.message, 'error');
                    }
                }
            });
        };

        window.messageStudent = (id) => {
            const student = allStudents.find(s => s.id === id);
            if (!student || !student.email) {
                Swal.fire('Error', 'Student email not found', 'error');
                return;
            }
            window.location.href = \\\`mailto:\${student.email}?subject=Message from Warden\\\`;
        };

        window.moreActions = (id) => {
            Swal.fire({
                title: 'More Actions',
                text: 'Select an action for this student',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'View Profile',
                denyButtonText: 'Reset Password',
                confirmButtonColor: '#2d72d2',
                denyButtonColor: '#ff9800'
            }).then((result) => {
                if (result.isConfirmed) window.viewStudent(id);
                else if (result.isDenied) Swal.fire('Info', 'Password reset emails must be requested by the student at login page.', 'info');
            });
        };

        window.goToPage = (page) => {
            currentPage = page;
            renderStudents();
        };

        // Modal Functions
        window.closeModal = () => {
            modal.classList.remove('active');
        };

        window.editCurrentStudent = () => {
            const id = allStudents.find(s => s.studentId === document.getElementById('modalId').textContent)?.id;
            if(id) {
                closeModal();
                editStudent(id);
            }
        };

        window.messageCurrentStudent = () => {
            const email = document.getElementById('modalEmail').textContent;
            if(email && email !== '-') {
                window.location.href = \\\`mailto:\${email}?subject=Message from Warden\\\`;
            }
        };

        // Quick Action Functions
        window.exportStudentList = () => {
            if (allStudents.length === 0) {
                Swal.fire('No Data', 'No student data to export. Please import student data first.', 'warning');
                return;
            }
            
            let csv = 'Name,Student ID,Email,Room,Course,Phone,Status,Payment\\n';
            filteredStudents.forEach(s => {
                csv += \\\`"\${s.fullName || ''}","\${s.studentId || ''}","\${s.email || ''}","\${s.roomNumber || ''}","\${s.course || ''}","\${s.phone || ''}","\${s.status || ''}","\${s.paymentStatus || ''}"\\\\n\\\`;
            });
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', 'students_list.csv');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        window.sendBulkMessage = () => {
            const emails = filteredStudents.map(s => s.email).filter(e => e).join(',');
            if (!emails) {
                Swal.fire('Warning', 'No valid emails found in the current list.', 'warning');
                return;
            }
            window.location.href = \\\`mailto:?bcc=\${emails}&subject=Announcement from Warden\\\`;
        };

        window.printDirectory = () => {
            if (allStudents.length === 0) {
                Swal.fire('No Data', 'No student data to print.', 'warning');
                return;
            }
            window.print();
        };

        window.addStudent = () => {
            Swal.fire({
                title: 'Add New Student',
                html: \`
                    <div style="text-align:left; display:flex; flex-direction:column; gap:10px;">
                        <input type="text" id="addName" class="swal2-input" placeholder="Full Name" style="margin:0;">
                        <input type="text" id="addId" class="swal2-input" placeholder="Student ID" style="margin:0;">
                        <input type="email" id="addEmail" class="swal2-input" placeholder="Student Email" style="margin:0;">
                    </div>
                \`,
                showCancelButton: true,
                confirmButtonText: 'Add Student',
                confirmButtonColor: '#2d72d2',
                preConfirm: () => {
                    const fullName = document.getElementById('addName').value;
                    const studentId = document.getElementById('addId').value;
                    const email = document.getElementById('addEmail').value;
                    if(!fullName || !studentId || !email) {
                        Swal.showValidationMessage('Please fill out all fields');
                    }
                    return { fullName, studentId, email, status: 'pending', paymentStatus: 'pending' };
                }
            }).then(async (result) => {
                if(result.isConfirmed) {
                    try {
                        await addDoc(collection(db, "students"), result.value);
                        Swal.fire('Added!', 'New student added successfully.', 'success');
                    } catch (error) {
                        Swal.fire('Error', 'Failed to add student: ' + error.message, 'error');
                    }
                }
            });
        };`;

content = content.replace(swalFuncOld, swalFuncNew);

// Finally, inject SweetAlert script into head
if(!content.includes('<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>')) {
    content = content.replace('</head>', '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>\n</head>');
}

fs.writeFileSync('c:/Users/Al Hafiz/public/warden-students.html', content);
console.log("Warden students UI thoroughly updated and fixed!");
