const fs = require('fs');

let content = fs.readFileSync('room-apply.html', 'utf8');

// 1. CSS for Type C layout and dropdowns
const cssToAdd = `
        /* Room Selection Dropdowns */
        .room-selectors {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            margin-bottom: 25px;
            background: #f8fafc;
            padding: 15px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
        }
        .room-selectors label {
            font-size: 13px;
            font-weight: 600;
            color: #475569;
            margin-bottom: 5px;
            display: block;
        }
        .room-selectors select {
            width: 100%;
            padding: 10px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            outline: none;
            transition: all 0.3s;
        }
        .room-selectors select:focus {
            border-color: #2d72d2;
            box-shadow: 0 0 0 3px rgba(45, 114, 210, 0.1);
        }
        .room-selectors select:disabled {
            background: #e2e8f0;
            cursor: not-allowed;
        }

        /* TYPE C SPECIFIC PLACEMENT (4 BEDS) */
        /* Grid is 16 cols x 6 rows (same as Type A/B for consistency) */
        .layout-type-c .p1 { grid-column: 3 / span 4; grid-row: 1 / span 2; }
        .layout-type-c .foyer { grid-column: 7 / span 4; grid-row: 2; }
        .layout-type-c .shower { grid-column: 7 / span 2; grid-row: 1; }
        .layout-type-c .toilet { grid-column: 9 / span 2; grid-row: 1; }
        .layout-type-c .p2 { grid-column: 11 / span 4; grid-row: 1 / span 2; }
        
        .layout-type-c .c1 { grid-column: 5 / span 8; grid-row: 3; }
        
        .layout-type-c .p4 { grid-column: 3 / span 4; grid-row: 4; }
        .layout-type-c .p3 { grid-column: 11 / span 4; grid-row: 4; }

        .layout-type-c .main-door {
            grid-column: 7 / span 4;
            grid-row: 4;
            align-self: center;
            font-size: 10px;
            font-weight: 700;
            color: #94a3b8;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .layout-type-c .inner-door {
            grid-column: 7 / span 4;
            grid-row: 2;
            align-self: flex-start;
            font-size: 10px;
            font-weight: 700;
            color: #94a3b8;
            text-align: center;
        }
`;

if (!content.includes('layout-type-c')) {
    content = content.replace('/* Type A Specifics */', cssToAdd + '\\n        /* Type A Specifics */');
}

// 2. Replace HTML Section B Header and add Dropdowns
const htmlTarget = '<div class="floor-plan-header">';
const htmlEnd = '<div class="floor-plan-container">';
const htmlReplacement = \`
                            <div class="room-selectors">
                                <div>
                                    <label>Block</label>
                                    <select id="selectBlock" required>
                                        <option value="" disabled selected>Choose Block</option>
                                        <option value="A1">Block A1 (Male)</option>
                                        <option value="A2">Block A2 (Male)</option>
                                        <option value="A3">Block A3 (Male)</option>
                                        <option value="A4">Block A4 (Female)</option>
                                        <option value="A5">Block A5 (Female)</option>
                                        <option value="A7">Block A7 (Type C - 4 Beds)</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Floor</label>
                                    <select id="selectFloor" disabled required>
                                        <option value="" disabled selected>Choose Floor</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Room Number</label>
                                    <select id="selectRoom" disabled required>
                                        <option value="" disabled selected>Choose Room</option>
                                    </select>
                                </div>
                            </div>

                            <div class="floor-plan-header">
                                <div>
                                    <h3 style="font-size: 16px; color: #1e293b; margin-bottom: 4px;">Choose Partition</h3>
                                    <p style="font-size: 12px; color: #64748b;">Select your preferred bed location. <span style="color:#16a34a; font-weight:600;">Green = Available</span> &nbsp; <span style="color:#ef4444; font-weight:600;">Red = Occupied</span></p>
                                </div>
                                <div class="type-toggle" id="roomTypeIndicator" style="background:#2d72d2; color:white; font-size:13px; font-weight:600; padding: 6px 16px; border-radius:6px;">
                                    Please Select a Room
                                </div>
                            </div>

                            <div class="floor-plan-container" id="floorPlanContainer" style="opacity: 0.5; pointer-events: none;">
\`;

let htmlSection = content.substring(content.indexOf(htmlTarget), content.indexOf(htmlEnd) + htmlEnd.length);
if (htmlSection.includes('btnTypeA')) {
    content = content.replace(htmlSection, htmlReplacement);
}

// 3. Remove hardcoded Type A layout HTML and replace with a dynamic container
const oldGridStart = '<div class="grid-layout layout-type-a" id="floorPlanGrid">';
const oldGridEnd = '<div class="c1 static">WALKWAY</div>\\n                                    </div>';
// Actually, it's safer to just empty the #floorPlanGrid contents entirely using JS on load.
// Wait, the grid contains P5 P6 etc. I'll just leave it and overwrite innerHTML in JS.

// 4. Update the JS Logic
// Remove the old btnTypeA listeners and add new logic
const oldJsRegex = /\\/\\/ Floor Plan Toggle Logic[\\s\\S]*?\\/\\/ Update the display\\(\\)/;

const newJs = \`
        // Floor Plan & Room Selection Logic
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
                selectFloor.innerHTML += \\\`<option value="\\\${i}">Level \\\${i}</option>\\\`;
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
                    selectRoom.innerHTML += \\\`<option value="\\\${data.roomNumber}">\\\${data.roomNumber} (\\\${data.type})</option>\\\`;
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
            roomTypeIndicator.innerHTML = \\\`<i class="fas fa-door-open"></i> \\\${selectedRoomDoc.type}\\\`;
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
            blueprintTitle.innerHTML = \\\`Floor Plan<br>\\\${type}\\\`;
            
            // Generate HTML based on Type
            let html = '';
            if (type === 'Type A') {
                floorPlanGrid.className = 'grid-layout layout-type-a';
                html = \\\`
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
                \\\`;
            } else if (type === 'Type B') {
                floorPlanGrid.className = 'grid-layout layout-type-b';
                html = \\\`
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
                \\\`;
            } else if (type === 'Type C') {
                floorPlanGrid.className = 'grid-layout layout-type-c';
                html = \\\`
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
                \\\`;
            }
            
            floorPlanGrid.innerHTML = html;
            
            // Now apply availability styling
            const bedsCount = type === 'Type C' ? 4 : 6;
            const occupants = roomData.occupants || {};
            
            for (let i = 1; i <= bedsCount; i++) {
                const pKey = 'P' + i;
                const blockEl = floorPlanGrid.querySelector(\\\`.\\\${pKey.toLowerCase()}\\\`);
                if (!blockEl) continue;
                
                blockEl.classList.remove('loading');
                if (occupants[pKey]) {
                    // Occupied
                    blockEl.classList.add('occupied');
                    blockEl.innerHTML = \\\`<i class="fas fa-user"></i><span>\\\${pKey}</span>\\\`;
                } else {
                    // Available
                    blockEl.classList.add('available');
                    blockEl.innerHTML = \\\`<i class="fas fa-bed"></i><span>\\\${pKey}</span>\\\`;
                    
                    // Add click event for available beds
                    blockEl.addEventListener('click', () => {
                        const allAvailable = floorPlanGrid.querySelectorAll('.room-block.available');
                        allAvailable.forEach(b => b.classList.remove('selected'));
                        blockEl.classList.add('selected');
                        selectedPartitionInput.value = pKey;
                        displaySelectedPartition.textContent = \\\`\\\${pKey} (\\\${roomData.roomNumber})\\\`;
                    });
                }
            }
        }
        
        // Update the display()
\`;

content = content.replace(/\\/\\/ Floor Plan Toggle Logic[\\s\\S]*?\\/\\/ Update the display\(\)/, newJs);

// 5. Update form submission to include block and roomNumber
content = content.replace(/selectedPartition: document.getElementById\\('selectedPartitionInput'\\).value \\|\\| '',/, 
    \`block: document.getElementById('selectBlock').value || '',
                    roomNumber: document.getElementById('selectRoom').value || '',
                    selectedPartition: document.getElementById('selectedPartitionInput').value || '',\`);

fs.writeFileSync('room-apply.html', content);
console.log('Successfully patched room-apply.html');
