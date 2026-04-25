const fs = require('fs');

let content = fs.readFileSync('c:/Users/Al Hafiz/public/warden-rooms.html', 'utf-8');

content = content.replace(
    '<style>',
    '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>\n    <style>'
);

const assignRoomCode = `        window.assignRoom = async (roomId) => {
            const occupantName = prompt("Enter student name:");
            if (!occupantName) return;
            const occupantId = prompt("Enter student ID:");
            const occupantPhone = prompt("Enter student phone number:");
            
            try {
                await updateDoc(doc(db, "rooms", roomId), {
                    status: "occupied",
                    occupantName: occupantName,
                    occupantId: occupantId,
                    occupantPhone: occupantPhone,
                    occupiedAt: new Date().toISOString()
                });
                alert(\`✅ Student assigned to room successfully!\`);
            } catch (error) {
                alert("Error assigning student: " + error.message);
            }
        };`;

const newAssignRoomCode = `        window.assignRoom = (roomId) => {
            Swal.fire({
                title: 'Assign Student',
                html: \`
                    <div style="display:flex; flex-direction:column; gap:10px; text-align:left;">
                        <input id="swal-name" class="swal2-input" placeholder="Student Name" style="margin:0;">
                        <input id="swal-id" class="swal2-input" placeholder="Student ID" style="margin:0;">
                        <input id="swal-phone" class="swal2-input" placeholder="Phone Number" style="margin:0;">
                    </div>
                \`,
                showCancelButton: true,
                confirmButtonText: 'Assign',
                confirmButtonColor: '#2d72d2',
                preConfirm: () => {
                    return {
                        name: document.getElementById('swal-name').value,
                        id: document.getElementById('swal-id').value,
                        phone: document.getElementById('swal-phone').value
                    }
                }
            }).then(async (result) => {
                if(result.isConfirmed) {
                    try {
                        await updateDoc(doc(db, "rooms", roomId), {
                            status: "occupied",
                            occupantName: result.value.name,
                            occupantId: result.value.id,
                            occupantPhone: result.value.phone,
                            occupiedAt: new Date().toISOString()
                        });
                        Swal.fire('Success', 'Student assigned to room successfully!', 'success');
                    } catch (error) {
                        Swal.fire('Error', error.message, 'error');
                    }
                }
            });
        };`;

content = content.replace(assignRoomCode, newAssignRoomCode);

const editRoomCode = `        window.editRoom = (roomId) => {
            alert(\`✏️ Editing Room \${roomId}\\n\\nThis feature will be available soon.\`);
        };`;

const newEditRoomCode = `        window.editRoom = (roomId) => {
            const room = allRooms.find(r => r.id === roomId);
            if (!room) return;
            Swal.fire({
                title: 'Edit Room',
                html: \`
                    <div style="display:flex; flex-direction:column; gap:10px; text-align:left;">
                        <div><label>Status</label>
                            <select id="swalRoomStatus" class="swal2-input" style="margin:0; width:100%; height:auto; padding:10px;">
                                <option value="available" \${room.status === 'available'?'selected':''}>Available</option>
                                <option value="occupied" \${room.status === 'occupied'?'selected':''}>Occupied</option>
                                <option value="maintenance" \${room.status === 'maintenance'?'selected':''}>Maintenance</option>
                                <option value="reserved" \${room.status === 'reserved'?'selected':''}>Reserved</option>
                            </select>
                        </div>
                        <div><label>Price (RM)</label><input type="number" id="swalPrice" class="swal2-input" value="\${room.price||350}" style="margin:0; width:100%;"></div>
                    </div>
                \`,
                showCancelButton: true,
                confirmButtonText: 'Save',
                confirmButtonColor: '#2d72d2',
                preConfirm: () => {
                    return {
                        status: document.getElementById('swalRoomStatus').value,
                        price: parseInt(document.getElementById('swalPrice').value)
                    }
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await updateDoc(doc(db, "rooms", roomId), result.value);
                        Swal.fire('Saved', 'Room updated successfully', 'success');
                    } catch(err) { Swal.fire('Error', err.message, 'error'); }
                }
            });
        };`;

content = content.replace(editRoomCode, newEditRoomCode);

const otherFunctionsCode = `        window.markMaintenance = async (roomId) => {
            if (confirm(\`Mark this room for maintenance?\`)) {
                try {
                    await updateDoc(doc(db, "rooms", roomId), {
                        status: "maintenance",
                        maintenanceReason: prompt("Enter maintenance reason:")
                    });
                    alert(\`🔧 Room marked for maintenance\`);
                } catch (error) {
                    alert("Error: " + error.message);
                }
            }
        };

        window.vacateRoom = async (roomId) => {
            if (confirm(\`Vacate this room? This will remove the current occupant.\`)) {
                try {
                    await updateDoc(doc(db, "rooms", roomId), {
                        status: "available",
                        occupantName: null,
                        occupantId: null,
                        occupantPhone: null,
                        vacatedAt: new Date().toISOString()
                    });
                    alert(\`✅ Room vacated successfully\`);
                } catch (error) {
                    alert("Error: " + error.message);
                }
            }
        };

        window.viewOccupant = (roomId) => {
            const room = allRooms.find(r => r.id === roomId);
            if (room && room.occupantName) {
                alert(\`👤 Occupant Details:\\n\\nName: \${room.occupantName}\\nID: \${room.occupantId || 'N/A'}\\nPhone: \${room.occupantPhone || 'N/A'}\\nRoom: \${room.roomNumber}\`);
            } else {
                alert("No occupant information available.");
            }
        };

        window.completeMaintenance = async (roomId) => {
            if (confirm(\`Complete maintenance for this room?\`)) {
                try {
                    await updateDoc(doc(db, "rooms", roomId), {
                        status: "available",
                        maintenanceReason: null,
                        maintenanceCompletedAt: new Date().toISOString()
                    });
                    alert(\`✅ Maintenance completed. Room is now available.\`);
                } catch (error) {
                    alert("Error: " + error.message);
                }
            }
        };

        window.cancelReservation = async (roomId) => {
            if (confirm(\`Cancel reservation for this room?\`)) {
                try {
                    await updateDoc(doc(db, "rooms", roomId), {
                        status: "available",
                        reservedFor: null,
                        reservedMoveIn: null
                    });
                    alert(\`❌ Reservation cancelled. Room is now available.\`);
                } catch (error) {
                    alert("Error: " + error.message);
                }
            }
        };

        window.addNewRoom = async () => {
            const roomNumber = prompt("Enter room number (e.g., A-1-01):");
            if (!roomNumber) return;
            
            const block = roomNumber.charAt(0);
            const floor = parseInt(roomNumber.split('-')[1]);
            const type = prompt("Enter room type (single/double/quad):", "single");
            const price = prompt("Enter monthly price (RM):", "350");
            
            try {
                await addDoc(collection(db, "rooms"), {
                    roomNumber: roomNumber,
                    block: block,
                    floor: floor,
                    type: type,
                    price: parseInt(price),
                    status: "available",
                    size: type === 'single' ? 180 : (type === 'double' ? 250 : 400),
                    beds: type === 'single' ? 1 : (type === 'double' ? 2 : 4),
                    hasAC: true,
                    createdAt: new Date().toISOString()
                });
                alert(\`➕ Room \${roomNumber} added successfully!\`);
            } catch (error) {
                alert("Error adding room: " + error.message);
            }
        };`;

const newOtherFunctionsCode = `        window.markMaintenance = async (roomId) => {
            Swal.fire({
                title: 'Mark for Maintenance',
                input: 'text',
                inputLabel: 'Maintenance Reason',
                inputPlaceholder: 'e.g. Broken AC, Leaking pipe...',
                showCancelButton: true,
                confirmButtonText: 'Mark',
                confirmButtonColor: '#ff9800'
            }).then(async (result) => {
                if(result.isConfirmed && result.value) {
                    try {
                        await updateDoc(doc(db, "rooms", roomId), {
                            status: "maintenance",
                            maintenanceReason: result.value
                        });
                        Swal.fire('Success', 'Room marked for maintenance', 'success');
                    } catch (error) {
                        Swal.fire('Error', error.message, 'error');
                    }
                }
            });
        };

        window.vacateRoom = async (roomId) => {
            Swal.fire({
                title: 'Vacate Room?',
                text: "This will remove the current occupant.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f44336',
                confirmButtonText: 'Yes, vacate it!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await updateDoc(doc(db, "rooms", roomId), {
                            status: "available",
                            occupantName: null,
                            occupantId: null,
                            occupantPhone: null,
                            vacatedAt: new Date().toISOString()
                        });
                        Swal.fire('Vacated!', 'Room vacated successfully.', 'success');
                    } catch (error) {
                        Swal.fire('Error', error.message, 'error');
                    }
                }
            });
        };

        window.viewOccupant = (roomId) => {
            const room = allRooms.find(r => r.id === roomId);
            if (room && room.occupantName) {
                Swal.fire({
                    title: 'Occupant Details',
                    html: \`
                        <div style="text-align:left; background:#f8f9fa; padding:15px; border-radius:8px;">
                            <strong>Name:</strong> \${room.occupantName}<br>
                            <strong>ID:</strong> \${room.occupantId || 'N/A'}<br>
                            <strong>Phone:</strong> \${room.occupantPhone || 'N/A'}<br>
                            <strong>Room:</strong> \${room.roomNumber}
                        </div>
                    \`,
                    icon: 'info',
                    confirmButtonColor: '#2d72d2'
                });
            } else {
                Swal.fire('No Data', 'No occupant information available.', 'warning');
            }
        };

        window.completeMaintenance = async (roomId) => {
            Swal.fire({
                title: 'Complete Maintenance?',
                text: "Room will be marked as available.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#4caf50',
                confirmButtonText: 'Complete'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await updateDoc(doc(db, "rooms", roomId), {
                            status: "available",
                            maintenanceReason: null,
                            maintenanceCompletedAt: new Date().toISOString()
                        });
                        Swal.fire('Success', 'Maintenance completed. Room is now available.', 'success');
                    } catch (error) {
                        Swal.fire('Error', error.message, 'error');
                    }
                }
            });
        };

        window.cancelReservation = async (roomId) => {
            Swal.fire({
                title: 'Cancel Reservation?',
                text: "Room will be marked as available.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f44336',
                confirmButtonText: 'Yes, cancel it!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await updateDoc(doc(db, "rooms", roomId), {
                            status: "available",
                            reservedFor: null,
                            reservedMoveIn: null
                        });
                        Swal.fire('Cancelled', 'Reservation cancelled. Room is now available.', 'success');
                    } catch (error) {
                        Swal.fire('Error', error.message, 'error');
                    }
                }
            });
        };

        window.addNewRoom = async () => {
            Swal.fire({
                title: 'Add New Room',
                html: \`
                    <div style="display:flex; flex-direction:column; gap:10px; text-align:left;">
                        <div><label>Room Number</label><input type="text" id="swalNewRoomNum" class="swal2-input" placeholder="e.g. A-1-01" style="margin:0; width:100%;"></div>
                        <div><label>Type</label>
                            <select id="swalNewRoomType" class="swal2-input" style="margin:0; width:100%; height:auto; padding:10px;">
                                <option value="single">Single</option>
                                <option value="double">Double</option>
                                <option value="quad">Quad</option>
                            </select>
                        </div>
                        <div><label>Monthly Price (RM)</label><input type="number" id="swalNewRoomPrice" class="swal2-input" value="350" style="margin:0; width:100%;"></div>
                    </div>
                \`,
                showCancelButton: true,
                confirmButtonText: 'Add Room',
                confirmButtonColor: '#2d72d2',
                preConfirm: () => {
                    const roomNumber = document.getElementById('swalNewRoomNum').value;
                    if(!roomNumber) Swal.showValidationMessage('Room number is required');
                    return {
                        roomNumber,
                        type: document.getElementById('swalNewRoomType').value,
                        price: document.getElementById('swalNewRoomPrice').value
                    }
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const data = result.value;
                    const block = data.roomNumber.charAt(0).toUpperCase();
                    const floor = parseInt(data.roomNumber.split('-')[1]) || 1;
                    try {
                        await addDoc(collection(db, "rooms"), {
                            roomNumber: data.roomNumber,
                            block: block,
                            floor: floor,
                            type: data.type,
                            price: parseInt(data.price),
                            status: "available",
                            size: data.type === 'single' ? 180 : (data.type === 'double' ? 250 : 400),
                            beds: data.type === 'single' ? 1 : (data.type === 'double' ? 2 : 4),
                            hasAC: true,
                            createdAt: new Date().toISOString()
                        });
                        Swal.fire('Added', \`Room \${data.roomNumber} added successfully!\`, 'success');
                    } catch (error) {
                        Swal.fire('Error', error.message, 'error');
                    }
                }
            });
        };`;

content = content.replace(otherFunctionsCode, newOtherFunctionsCode);

fs.writeFileSync('c:/Users/Al Hafiz/public/warden-rooms.html', content);
console.log('Done!');
