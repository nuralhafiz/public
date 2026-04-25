
        import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
        import { getFirestore, collection, query, orderBy, getDocs, onSnapshot, doc, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
        import { auth, db } from "./js/firebase-config.js";

        const hamburger = document.getElementById('hamburger');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const menuOverlay = document.getElementById('menuOverlay');
        const modal = document.getElementById('studentModal');

        let allStudents = [];
        let filteredStudents = [];
        let currentPage = 1;
        const itemsPerPage = 10;

        function closeSidebar() { sidebar.classList.remove('open'); menuOverlay.classList.remove('active'); }
        function openSidebar() { sidebar.classList.add('open'); menuOverlay.classList.add('active'); }

        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
        });

        menuOverlay.addEventListener('click', closeSidebar);
        mainContent.addEventListener('click', () => { if (window.innerWidth <= 768 && sidebar.classList.contains('open')) closeSidebar(); });
        window.addEventListener('resize', () => { if (window.innerWidth > 768) closeSidebar(); });

        onAuthStateChanged(auth, (user) => {
            if (user) {
                if (!user.email.endsWith('@gmi.edu.my') || user.email.includes('@student.')) {
                    alert("Access Denied: This portal is for wardens only.");
                    signOut(auth).then(() => window.location.href = "warden-login.html");
                    return;
                }
                loadStudents();
                setupRealtimeListener();
            } else { window.location.href = "warden-login.html"; }
        });

        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            signOut(auth).then(() => window.location.href = "index.html");
        });

        // Setup real-time listener
        function setupRealtimeListener() {
            const studentsCollection = collection(db, "students");
            
            onSnapshot(studentsCollection, (snapshot) => {
                allStudents = [];
                snapshot.forEach((doc) => {
                    allStudents.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                
                document.getElementById('totalStudents').textContent = allStudents.length;
                filterAndRenderStudents();
            }, (error) => {
                console.error("Error listening to students:", error);
            });
        }

        // Load students from Firestore
        async function loadStudents() {
            try {
                document.getElementById('loadingSpinner').style.display = 'flex';
                document.getElementById('studentsTableContainer').style.display = 'none';
                document.getElementById('emptyState').style.display = 'none';
                
                const studentsCollection = collection(db, "students");
                const querySnapshot = await getDocs(studentsCollection);
                
                allStudents = [];
                querySnapshot.forEach((doc) => {
                    allStudents.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                
                document.getElementById('totalStudents').textContent = allStudents.length;
                
                if (allStudents.length === 0) {
                    document.getElementById('loadingSpinner').style.display = 'none';
                    document.getElementById('emptyState').style.display = 'block';
                    document.getElementById('studentsTableContainer').style.display = 'none';
                } else {
                    filterAndRenderStudents();
                }
                
            } catch (error) {
                console.error("Error loading students:", error);
                document.getElementById('loadingSpinner').style.display = 'none';
                document.getElementById('emptyState').style.display = 'block';
            }
        }

        // Filter and render students
        function filterAndRenderStudents() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const blockFilter = document.getElementById('blockFilter').value;
            const statusFilter = document.getElementById('statusFilter').value;
            const paymentFilter = document.getElementById('paymentFilter').value;
            
            filteredStudents = allStudents.filter(student => {
                // Search filter
                if (searchTerm) {
                    const matchesName = student.fullName?.toLowerCase().includes(searchTerm) || false;
                    const matchesId = student.studentId?.toLowerCase().includes(searchTerm) || false;
                    const matchesEmail = student.email?.toLowerCase().includes(searchTerm) || false;
                    if (!matchesName && !matchesId && !matchesEmail) {
                        return false;
                    }
                }
                
                // Block filter
                if (blockFilter !== 'all') {
                    const roomBlock = student.roomNumber?.charAt(0) || '';
                    if (roomBlock !== blockFilter) {
                        return false;
                    }
                }
                
                // Status filter
                if (statusFilter !== 'all' && student.status !== statusFilter) {
                    return false;
                }
                
                // Payment filter
                if (paymentFilter !== 'all' && student.paymentStatus !== paymentFilter) {
                    return false;
                }
                
                return true;
            });
            
            renderStudents();
        }

        // Render students to table
        function renderStudents() {
            const studentsTable = document.getElementById('studentsTable');
            
            if (filteredStudents.length === 0) {
                studentsTable.innerHTML = '<tr><td colspan="8" style="text-align: center;">No students found</td></tr>';
                return;
            }
            
            document.getElementById('loadingSpinner').style.display = 'none';
            document.getElementById('emptyState').style.display = 'none';
            document.getElementById('studentsTableContainer').style.display = 'block';
            
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageItems = filteredStudents.slice(start, end);
            
            let html = '';
            pageItems.forEach(student => {
                const initials = student.fullName ? student.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '?';
                const roomNumber = student.roomNumber || 'Not assigned';
                const course = student.course || 'N/A';
                const phone = student.phone || 'N/A';
                const status = student.status || 'pending';
                const paymentStatus = student.paymentStatus || 'pending';
                
                let statusClass = '';
                if (status === 'active') statusClass = 'status-active';
                else if (status === 'inactive') statusClass = 'status-inactive';
                else statusClass = 'status-pending';
                
                let paymentClass = '';
                if (paymentStatus === 'paid') paymentClass = 'payment-paid';
                else if (paymentStatus === 'overdue') paymentClass = 'payment-overdue';
                else paymentClass = 'payment-pending';
                
                html += `
                    <tr>
                        <td>
                            <div class="student-info">
                                <div class="student-avatar">${initials}</div>
                                <div>
                                    <div class="student-name">${student.fullName || 'N/A'}</div>
                                    <div class="student-email">${student.email || 'N/A'}</div>
                                </div>
                            </div>
                        </td>
                        <td>${student.studentId || 'N/A'}</td>
                        <td><span class="room-badge">${roomNumber}</span></td>
                        <td>${course}</td>
                        <td>${phone}</td>
                        <td><span class="status-badge ${statusClass}">${status.toUpperCase()}</span></td>
                        <td><span class="payment-badge ${paymentClass}">${paymentStatus.toUpperCase()}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="action-btn action-view" onclick="viewStudent('${student.id}')" title="View"><i class="fas fa-eye"></i></button>
                                <button class="action-btn action-edit" onclick="editStudent('${student.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                                <button class="action-btn action-message" onclick="messageStudent('${student.id}')" title="Message"><i class="fas fa-envelope"></i></button>
                                <button class="action-btn action-more" onclick="moreActions('${student.id}')" title="More"><i class="fas fa-ellipsis-v"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
            });
            
            studentsTable.innerHTML = html;
            renderPagination();
        }

        // Render pagination
        function renderPagination() {
            const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
            const pageNumbers = document.getElementById('pageNumbers');
            
            let pagesHtml = '';
            for (let i = 1; i <= totalPages; i++) {
                pagesHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
            
            pageNumbers.innerHTML = pagesHtml;
        }

        // Global functions
        window.viewStudent = (id) => {
            const student = allStudents.find(s => s.id === id);
            if (student) {
                document.getElementById('modalAvatar').textContent = student.fullName ? student.fullName.charAt(0).toUpperCase() : '?';
                document.getElementById('modalName').textContent = student.fullName || 'N/A';
                document.getElementById('modalId').textContent = student.studentId || 'N/A';
                document.getElementById('modalEmail').textContent = student.email || 'N/A';
                document.getElementById('modalRoom').textContent = student.roomNumber || 'Not assigned';
                document.getElementById('modalCourse').textContent = student.course || 'N/A';
                document.getElementById('modalPhone').textContent = student.phone || 'N/A';
                document.getElementById('modalEmergency').textContent = student.emergencyContact || 'N/A';
                document.getElementById('modalMoveIn').textContent = student.moveInDate || 'N/A';
                document.getElementById('modalStatus').textContent = (student.status || 'pending').toUpperCase();
                document.getElementById('modalPayment').textContent = (student.paymentStatus || 'pending').toUpperCase();
                document.getElementById('modalLastPayment').textContent = student.lastPayment || 'N/A';
                
                modal.classList.add('active');
            } else {
                alert("Student data not found. Please ensure data is imported.");
            }
        };

        window.editStudent = (id) => {
            const student = allStudents.find(s => s.id === id);
            if (!student) return;
            
            Swal.fire({
                title: 'Edit Student Details',
                html: `
                    <div style="text-align:left; display:flex; flex-direction:column; gap:15px;">
                        <div><label>Course</label><input type="text" id="swalCourse" class="swal2-input" style="margin:0; width:100%;" value="${student.course || ''}"></div>
                        <div><label>Phone</label><input type="text" id="swalPhone" class="swal2-input" style="margin:0; width:100%;" value="${student.phone || ''}"></div>
                        <div><label>Emergency Contact</label><input type="text" id="swalEmergency" class="swal2-input" style="margin:0; width:100%;" value="${student.emergencyContact || ''}"></div>
                        <div><label>Status</label>
                            <select id="swalStatus" class="swal2-input" style="margin:0; width:100%; height:auto; padding:10px;">
                                <option value="active" ${student.status === 'active' ? 'selected' : ''}>Active</option>
                                <option value="inactive" ${student.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                                <option value="pending" ${student.status === 'pending' ? 'selected' : ''}>Pending</option>
                            </select>
                        </div>
                    </div>
                `,
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
            window.location.href = `mailto:${student.email}?subject=Message from Warden`;
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
                window.location.href = `mailto:${email}?subject=Message from Warden`;
            }
        };

        // Quick Action Functions
        window.exportStudentList = () => {
            if (allStudents.length === 0) {
                Swal.fire('No Data', 'No student data to export. Please import student data first.', 'warning');
                return;
            }
            
            let csv = 'Name,Student ID,Email,Room,Course,Phone,Status,Payment\n';
            filteredStudents.forEach(s => {
                csv += `${s.fullName || ''},${s.studentId || ''},${s.email || ''},${s.roomNumber || ''},${s.course || ''},${s.phone || ''},${s.status || ''},${s.paymentStatus || ''}\n`;
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
            window.location.href = `mailto:?bcc=${emails}&subject=Announcement from Warden`;
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
                html: `
                    <div style="text-align:left; display:flex; flex-direction:column; gap:10px;">
                        <input type="text" id="addName" class="swal2-input" placeholder="Full Name" style="margin:0;">
                        <input type="text" id="addId" class="swal2-input" placeholder="Student ID" style="margin:0;">
                        <input type="email" id="addEmail" class="swal2-input" placeholder="Student Email" style="margin:0;">
                    </div>
                `,
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
        };

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Event listeners for filters
        document.getElementById('searchInput').addEventListener('input', () => {
            currentPage = 1;
            filterAndRenderStudents();
        });

        document.getElementById('blockFilter').addEventListener('change', () => {
            currentPage = 1;
            filterAndRenderStudents();
        });

        document.getElementById('statusFilter').addEventListener('change', () => {
            currentPage = 1;
            filterAndRenderStudents();
        });

        document.getElementById('paymentFilter').addEventListener('change', () => {
            currentPage = 1;
            filterAndRenderStudents();
        });

        document.getElementById('refreshBtn').addEventListener('click', () => {
            loadStudents();
        });

        // Pagination buttons
        document.getElementById('prevPage').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderStudents();
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderStudents();
            }
        });
    
