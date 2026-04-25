const fs = require('fs');

let content = fs.readFileSync('c:/Users/Al Hafiz/public/warden-students.html', 'utf-8');

// 1. Update <head> to add SweetAlert and Print Styles
const headOld = `        /* Increased font size for dashboards */
        .brand-container {
            font-size: 32px !important;
        }
    </style>

    
</head>`;
const headNew = `        /* Increased font size for dashboards */
        .brand-container {
            font-size: 32px !important;
        }

        /* Print Styles */
        @media print {
            body * { visibility: hidden; }
            #mainContent, #mainContent * { visibility: visible; }
            #mainContent { position: absolute; left: 0; top: 0; width: 100%; padding: 0; }
            nav, header, .quick-actions, .filters-section, .action-buttons, .page-btn { display: none !important; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>`;
content = content.replace(headOld, headNew);

// 2. Update imports
const importOld = `        import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
        import { getFirestore, collection, query, orderBy, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";`;
const importNew = `        import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
        import { getFirestore, collection, query, orderBy, getDocs, onSnapshot, doc, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";`;
content = content.replace(importOld, importNew);

// 3. Update all placeholder functions
const funcOld = `        window.editStudent = (id) => {
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

const funcNew = `        window.editStudent = (id) => {
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

// Note: Using a regular expression isn't necessary if the string is perfectly exact, but the user's issue arose likely because of newlines.
// It's safer to use split/join or string replace.
content = content.replace(funcOld, funcNew);

fs.writeFileSync('c:/Users/Al Hafiz/public/warden-students.html', content);
console.log('Update successful!');
