import re

with open('room-apply.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace everything from `const btnTypeA = ...` down to `loadAvailability('typeA');`
pattern = re.compile(r'const btnTypeA = document\.getElementById\(\'btnTypeA\'\);.*?loadAvailability\(\'typeA\'\);', re.DOTALL)

replacement = """// ── Room Selection Logic ────────────────────────────────────────────────
        const selectBlock = document.getElementById('selectBlock');
        const selectFloor = document.getElementById('selectFloor');
        const selectRoom = document.getElementById('selectRoom');
        const roomTypeIndicator = document.getElementById('roomTypeIndicator');
        const floorPlanContainer = document.getElementById('floorPlanContainer');
        const floorPlanGrid = document.getElementById('floorPlanGrid');
        const blueprintTitle = document.getElementById('blueprintTitle');
        const selectedPartitionInput = document.getElementById('selectedPartitionInput');
        const displaySelectedPartition = document.getElementById('displaySelectedPartition');

        let availableRoomsData = {};
        let selectedRoomDoc = null;

        selectBlock.addEventListener('change', () => {
            const block = selectBlock.value;
            selectFloor.innerHTML = '<option value="" disabled selected>Choose Floor</option>';
            selectRoom.innerHTML = '<option value="" disabled selected>Choose Room</option>';
            selectRoom.disabled = true;
            resetFloorPlan();

            if (!block) return;
            
            const maxFloors = (block === 'A7') ? 5 : 11;
            for(let i = 1; i <= maxFloors; i++) {
                selectFloor.innerHTML += `<option value="${i}">Level ${i}</option>`;
            }
            selectFloor.disabled = false;
        });

        selectFloor.addEventListener('change', async () => {
            const block = selectBlock.value;
            const floor = selectFloor.value;
            selectRoom.innerHTML = '<option value="" disabled selected>Loading...</option>';
            selectRoom.disabled = true;
            resetFloorPlan();

            try {
                // Fetch rooms for this block & floor from Firestore
                const q = query(collection(db, "rooms"), where("block", "==", block), where("floor", "==", parseInt(floor)));
                const snap = await getDocs(q);
                
                selectRoom.innerHTML = '<option value="" disabled selected>Choose Room</option>';
                availableRoomsData = {};

                if (snap.empty) {
                    selectRoom.innerHTML = '<option value="" disabled selected>No rooms found</option>';
                    return;
                }

                snap.forEach(doc => {
                    const data = doc.data();
                    availableRoomsData[data.roomNumber] = { id: doc.id, ...data };
                    selectRoom.innerHTML += `<option value="${data.roomNumber}">${data.roomNumber} (${data.type})</option>`;
                });
                selectRoom.disabled = false;
            } catch (err) {
                console.error("Error fetching rooms:", err);
                selectRoom.innerHTML = '<option value="" disabled selected>Error loading</option>';
            }
        });

        selectRoom.addEventListener('change', () => {
            const roomNum = selectRoom.value;
            if (!roomNum) return;
            
            selectedRoomDoc = availableRoomsData[roomNum];
            roomTypeIndicator.innerHTML = `<i class="fas fa-door-open"></i> ${selectedRoomDoc.type}`;
            floorPlanContainer.style.opacity = '1';
            floorPlanContainer.style.pointerEvents = 'auto';
            
            renderFloorPlan(selectedRoomDoc);
        });

        function resetFloorPlan() {
            floorPlanContainer.style.opacity = '0.5';
            floorPlanContainer.style.pointerEvents = 'none';
            roomTypeIndicator.innerHTML = 'Please Select a Room';
            selectedPartitionInput.value = '';
            selectedPartitionInput.setAttribute('data-room-type', '');
            displaySelectedPartition.textContent = 'None';
            selectedRoomDoc = null;
        }

        function renderFloorPlan(roomData) {
            const type = roomData.type; // "Type A", "Type B", "Type C"
            selectedPartitionInput.setAttribute('data-room-type', type);
            blueprintTitle.innerHTML = `Floor Plan<br>${type}`;
            
            let html = '';
            if (type === 'Type A') {
                floorPlanGrid.className = 'grid-layout layout-type-a';
                html = `
                    <div class="annotation main-door">Main Door <i class="fas fa-arrow-down" style="margin-top: 3px;"></i></div>
                    <div class="room-block static toilet">Toilet</div>
                    <div class="room-block static shower">Shower</div>
                    <div class="room-block static foyer"></div>
                    <div class="annotation inner-door"><i class="fas fa-arrow-up" style="margin-bottom: 3px;"></i> Door</div>
                    <div class="room-block p1 loading" data-partition="P1"><span class="partition-label">P1</span></div>
                    <div class="room-block p2 loading" data-partition="P2"><span class="partition-label">P2</span></div>
                    <div class="room-block p6 loading" data-partition="P6"><span class="partition-label">P6</span></div>
                    <div class="c1 static">WALKWAY</div>
                    <div class="room-block p5 loading" data-partition="P5"><span class="partition-label">P5</span></div>
                    <div class="room-block p4 loading" data-partition="P4"><span class="partition-label">P4</span></div>
                    <div class="room-block p3 loading" data-partition="P3"><span class="partition-label">P3</span></div>
                `;
            } else if (type === 'Type B') {
                floorPlanGrid.className = 'grid-layout layout-type-b';
                html = `
                    <div class="room-block p1 loading" data-partition="P1"><span class="partition-label">P1</span></div>
                    <div class="room-block static shower">Shower</div>
                    <div class="room-block static toilet">Toilet</div>
                    <div class="room-block static foyer"></div>
                    <div class="annotation inner-door"><i class="fas fa-arrow-up" style="margin-bottom: 3px;"></i> Door</div>
                    <div class="annotation main-door">Main Door <i class="fas fa-arrow-down" style="margin-top: 3px;"></i></div>
                    <div class="room-block p2 loading" data-partition="P2"><span class="partition-label">P2</span></div>
                    <div class="room-block p6 loading" data-partition="P6"><span class="partition-label">P6</span></div>
                    <div class="c1 static">WALKWAY</div>
                    <div class="room-block p3 loading" data-partition="P3"><span class="partition-label">P3</span></div>
                    <div class="room-block p4 loading" data-partition="P4"><span class="partition-label">P4</span></div>
                    <div class="room-block p5 loading" data-partition="P5"><span class="partition-label">P5</span></div>
                `;
            } else if (type === 'Type C') {
                floorPlanGrid.className = 'grid-layout layout-type-c';
                html = `
                    <div class="room-block p1 loading" data-partition="P1"><span class="partition-label">P1</span></div>
                    <div class="room-block p2 loading" data-partition="P2"><span class="partition-label">P2</span></div>
                    <div class="room-block static shower">Shower</div>
                    <div class="room-block static toilet">Toilet</div>
                    <div class="room-block static foyer"></div>
                    <div class="annotation inner-door"><i class="fas fa-arrow-up" style="margin-bottom: 3px;"></i> Door</div>
                    <div class="c1 static">WALKWAY</div>
                    <div class="room-block p4 loading" data-partition="P4"><span class="partition-label">P4</span></div>
                    <div class="room-block p3 loading" data-partition="P3"><span class="partition-label">P3</span></div>
                    <div class="annotation main-door">Main Door <i class="fas fa-arrow-up" style="margin-top: 3px;"></i></div>
                `;
            }
            
            floorPlanGrid.innerHTML = html;
            
            const bedsCount = type === 'Type C' ? 4 : 6;
            const occupants = roomData.occupants || {};
            
            for (let i = 1; i <= bedsCount; i++) {
                const pKey = 'P' + i;
                const blockEl = floorPlanGrid.querySelector(`.${pKey.toLowerCase()}`);
                if (!blockEl) continue;
                
                blockEl.classList.remove('loading');
                if (occupants[pKey]) {
                    blockEl.classList.add('unavailable');
                } else {
                    blockEl.classList.add('available');
                }
            }
        }

        // ── Partition Click Handler ────────────────────────────────────────
        document.addEventListener('click', (e) => {
            const block = e.target.closest('.room-block.available');
            if (!block) return;

            clearSelection();
            block.classList.add('selected');
            const pValue = block.getAttribute('data-partition');
            selectedPartitionInput.value = pValue;
            displaySelectedPartition.textContent = `${pValue} (${selectedRoomDoc.roomNumber})`;
        });

        document.addEventListener('click', (e) => {
            const block = e.target.closest('.room-block.unavailable');
            if (!block) return;
            Swal.fire({ heightAuto: false,
                icon: 'error',
                title: 'Partition Unavailable',
                text: 'This partition is already occupied. Please choose a green partition.',
                confirmButtonColor: '#ef4444'
            });
        });

        function clearSelection() {
            document.querySelectorAll('.room-block.available').forEach(b => b.classList.remove('selected'));
            displaySelectedPartition.textContent = 'None';
            selectedPartitionInput.value = '';
        }"""

new_content = pattern.sub(replacement, content)

# Update form submit to add block and roomNumber
submit_pattern = re.compile(r'selectedPartition: document\.getElementById\(\'selectedPartitionInput\'\)\.value \|\| \'\',')
submit_replacement = """block: document.getElementById('selectBlock').value || '',
                    roomNumber: document.getElementById('selectRoom').value || '',
                    selectedPartition: document.getElementById('selectedPartitionInput').value || 'None',"""

new_content = submit_pattern.sub(submit_replacement, new_content)

with open('room-apply.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
