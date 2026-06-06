import re

with open('room-apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Chunk 1: Global vars & filterBlocks()
old_top = """        import { checkMaintenanceMode } from './js/maintenance.js';
        
        async function checkTimeframeForSemester(semester) {"""

new_top = """        import { checkMaintenanceMode } from './js/maintenance.js';
        
        let currentUserSemester = '1';
        let currentUserGender = 'Lelaki';

        function filterBlocks() {
            const selectBlock = document.getElementById('selectBlock');
            selectBlock.innerHTML = '<option value="" disabled selected>Choose Block</option>';
            const s = parseInt(currentUserSemester) || 1;
            const g = currentUserGender || 'Lelaki';
            const options = [];
            if (g === 'Perempuan') {
                if (s >= 1 && s <= 3) { options.push({val: 'A1', text: 'Block A1 (Female)'}); }
                else if (s >= 4 && s <= 6) { options.push({val: 'A7', text: 'Block A7 (Female - 4 Beds)'}); }
            } else {
                if (s >= 1 && s <= 3) {
                    options.push({val: 'A2', text: 'Block A2 (Male)'});
                    options.push({val: 'A3', text: 'Block A3 (Male)'});
                } else if (s >= 4 && s <= 6) {
                    options.push({val: 'A4', text: 'Block A4 (Male)'});
                    options.push({val: 'A5', text: 'Block A5 (Male)'});
                }
            }
            options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt.val;
                o.textContent = opt.text;
                selectBlock.appendChild(o);
            });
            document.getElementById('selectFloor').innerHTML = '<option value="" disabled selected>Choose Floor</option>';
            document.getElementById('selectFloor').disabled = true;
            document.getElementById('selectRoom').innerHTML = '<option value="" disabled selected>Choose Room</option>';
            document.getElementById('selectRoom').disabled = true;
            if (typeof resetFloorPlan === 'function') resetFloorPlan();
        }

        async function checkTimeframeForSemester(semester) {"""
content = content.replace(old_top, new_top)

# Chunk 2: onAuthStateChanged
old_auth = """                        const userSemester = data.semester || '1'; // Default to Semester 1 if missing
                        
                        // Check timeframe based on semester"""
new_auth = """                        const userSemester = data.semester || '1'; // Default to Semester 1 if missing
                        
                        currentUserSemester = userSemester;
                        currentUserGender = data.gender || 'Lelaki';
                        filterBlocks();

                        // Check timeframe based on semester"""
content = content.replace(old_auth, new_auth)

# Chunk 3: Autofill gender
old_fill = """                        if (data.course) {
                            document.getElementById('course').value = data.course;
                        }"""
new_fill = """                        if (data.course) {
                            document.getElementById('course').value = data.course;
                        }
                        if (data.gender) {
                            const genSelect = document.getElementById('gender');
                            if (genSelect) {
                                genSelect.value = data.gender;
                                genSelect.style.pointerEvents = 'none';
                                genSelect.style.backgroundColor = '#f0f3fa';
                            }
                        }"""
content = content.replace(old_fill, new_fill)

# Chunk 4: Submit Logic
old_submit = """            try {
                // Collect all form data
                const formData = {
                    userId: user.uid,
                    userEmail: user.email,
                    referenceNumber: document.getElementById('referenceNumber').value,
                    fullName: document.getElementById('fullName').value,
                    icNumber: document.getElementById('icNumber').value,
                    studentId: document.getElementById('studentId').value,
                    course: document.getElementById('course').value,
                    gender: document.getElementById('gender').value,
                    race: document.getElementById('race').value,
                    religion: document.getElementById('religion').value,
                    phone: document.getElementById('phone').value,
                    block: document.getElementById('selectBlock').value || '',
                    floor: document.getElementById('selectFloor').value || '',
                    roomNumber: document.getElementById('selectRoom').value || '',
                    partition: document.getElementById('selectedPartitionInput').value || 'None',
                    roomType: document.getElementById('selectedPartitionInput').getAttribute('data-room-type') || 'typeA',
                    homePhone: document.getElementById('homePhone').value || '',
                    email: document.getElementById('email').value,
                    address: document.getElementById('address').value,
                    declarationDate: document.getElementById('declarationDate').value,
                    declarationPlace: document.getElementById('declarationPlace').value,
                    status: 'pending', // pending, approved, rejected
                    submittedAt: serverTimestamp(),
                    applicationType: 'room'
                };
                
                // Save to Firestore
                const docRef = await addDoc(collection(db, "applications"), formData);"""

new_submit = """            try {
                const blockVal = document.getElementById('selectBlock').value || '';
                const floorVal = document.getElementById('selectFloor').value || '';
                const roomVal = document.getElementById('selectRoom').value || '';
                const partitionVal = document.getElementById('selectedPartitionInput').value || 'None';
                const roomId = `${blockVal}-${roomVal}`;
                const semesterInt = parseInt(currentUserSemester) || 1;
                
                // Pre-check room for Auto-Approve
                let appStatus = 'pending';
                const roomRef = doc(db, "rooms", roomId);
                const roomSnap = await getDoc(roomRef);
                
                if (roomSnap.exists()) {
                    const roomData = roomSnap.data();
                    const rStatus = roomData.status || '';
                    if (rStatus.toLowerCase() !== 'maintenance' && rStatus.toLowerCase() === 'available') {
                        // Check capacity
                        const currentOcc = Object.keys(roomData.occupants || {}).length || roomData.currentOccupants || 0;
                        const maxCap = roomData.capacity || (roomData.type === 'Type C' ? 4 : 6);
                        
                        if (currentOcc < maxCap) {
                            if (semesterInt <= 5) {
                                appStatus = 'approved';
                            } else {
                                appStatus = 'pending'; // Sem 6 goes to pending
                            }
                        } else {
                            throw new Error("This room is already full. Please select another room.");
                        }
                    } else {
                        throw new Error(`This room is ${rStatus || 'not available'} and cannot be booked.`);
                    }
                } else {
                    throw new Error("Selected room data not found in database.");
                }

                // Collect all form data
                const formData = {
                    userId: user.uid,
                    userEmail: user.email,
                    referenceNumber: document.getElementById('referenceNumber').value,
                    fullName: document.getElementById('fullName').value,
                    icNumber: document.getElementById('icNumber').value,
                    studentId: document.getElementById('studentId').value,
                    course: document.getElementById('course').value,
                    gender: document.getElementById('gender').value || currentUserGender,
                    race: document.getElementById('race').value,
                    religion: document.getElementById('religion').value,
                    phone: document.getElementById('phone').value,
                    block: blockVal,
                    floor: floorVal,
                    roomNumber: roomVal,
                    partition: partitionVal,
                    roomType: document.getElementById('selectedPartitionInput').getAttribute('data-room-type') || 'typeA',
                    homePhone: document.getElementById('homePhone').value || '',
                    email: document.getElementById('email').value,
                    address: document.getElementById('address').value,
                    declarationDate: document.getElementById('declarationDate').value,
                    declarationPlace: document.getElementById('declarationPlace').value,
                    status: appStatus, // pending, approved, rejected
                    submittedAt: serverTimestamp(),
                    applicationType: 'room'
                };
                
                if (appStatus === 'approved') {
                    formData.approvedAt = serverTimestamp();
                }
                
                // Save to Firestore
                const docRef = await addDoc(collection(db, "applications"), formData);
                
                // Auto-Approve room updates
                if (appStatus === 'approved') {
                    const roomData = roomSnap.data();
                    let currentOccupants = roomData.occupants || {};
                    if (Array.isArray(currentOccupants)) currentOccupants = Object.assign({}, currentOccupants);
                    
                    currentOccupants[partitionVal] = {
                        name: formData.fullName,
                        id: formData.studentId,
                        phone: formData.phone
                    };
                    
                    const occCount = Object.keys(currentOccupants).length;
                    const maxCap = roomData.capacity || (roomData.type === 'Type C' ? 4 : 6);
                    let newStatus = roomData.status;
                    if (occCount >= maxCap) newStatus = 'occupied';
                    
                    await updateDoc(roomRef, {
                        occupants: currentOccupants,
                        status: newStatus,
                        currentOccupants: occCount
                    });
                    
                    // Create placement record
                    await addDoc(collection(db, "placements"), {
                        applicationId: docRef.id,
                        userId: user.uid,
                        fullName: formData.fullName,
                        studentId: formData.studentId,
                        roomId: roomId,
                        partition: partitionVal,
                        status: 'active',
                        checkInDate: null,
                        checkOutDate: null,
                        createdAt: serverTimestamp()
                    });
                }"""
content = content.replace(old_submit, new_submit)

with open('room-apply.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done updating room-apply.html")
