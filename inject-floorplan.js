const fs = require('fs');

if (fs.existsSync('room-apply.html')) {
    let content = fs.readFileSync('room-apply.html', 'utf8');

    // 1. Add CSS for the Floor Plan
    const floorPlanCSS = `
        /* Floor Plan Styles */
        .floor-plan-section {
            background: #fff;
            padding: 25px;
            border-radius: 16px;
            border: 1px solid rgba(0,0,0,0.05);
            margin-bottom: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }

        .floor-plan-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .type-toggle {
            display: flex;
            background: #f1f5f9;
            border-radius: 8px;
            padding: 4px;
        }

        .type-btn {
            padding: 6px 16px;
            border: none;
            background: transparent;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            color: #64748b;
            cursor: pointer;
            transition: all 0.3s;
        }

        .type-btn.active {
            background: white;
            color: var(--primary-blue, #2d72d2);
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .floor-plan-container {
            display: flex;
            justify-content: center;
            background: #f8fafc;
            padding: 30px;
            border-radius: 12px;
            border: 1px dashed #cbd5e1;
            position: relative;
        }

        .grid-layout {
            display: grid;
            gap: 6px;
            /* Default 3 columns */
            grid-template-columns: 80px 80px 80px;
            grid-template-rows: 60px 60px 60px 60px 60px;
        }

        /* Generic Room Block */
        .room-block {
            background: #ffffff;
            border: 2px solid #94a3b8;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
            color: #475569;
            cursor: pointer;
            transition: all 0.2s;
            user-select: none;
            position: relative;
        }

        .room-block.selectable:hover {
            border-color: #3b82f6;
            background: #eff6ff;
            color: #2563eb;
        }

        .room-block.selected {
            background: #ccff00;
            border-color: #84cc16;
            color: #166534;
            box-shadow: 0 0 10px rgba(204, 255, 0, 0.4);
        }

        .room-block.selected::after {
            content: '✓';
            position: absolute;
            top: 2px;
            right: 4px;
            font-size: 12px;
            color: #166534;
        }

        .room-block.static {
            background: #e2e8f0;
            border: 1px solid #cbd5e1;
            color: #64748b;
            font-size: 11px;
            cursor: not-allowed;
        }

        .room-block.corridor {
            background: transparent;
            border: none;
            cursor: default;
        }

        /* TYPE A SPECIFIC PLACEMENT */
        .layout-type-a .p6 { grid-column: 1; grid-row: 1; }
        .layout-type-a .p5 { grid-column: 1; grid-row: 2; }
        .layout-type-a .p4 { grid-column: 1; grid-row: 3; }
        .layout-type-a .p3 { grid-column: 1; grid-row: 4; }
        .layout-type-a .door { grid-column: 3; grid-row: 1; }
        .layout-type-a .toilet { grid-column: 3; grid-row: 2; }
        .layout-type-a .shower { grid-column: 3; grid-row: 3; }
        .layout-type-a .p1 { grid-column: 3; grid-row: 4 / span 2; } /* Spans 2 rows */
        .layout-type-a .p2 { grid-column: 2; grid-row: 5; }
        .layout-type-a .c1 { grid-column: 2; grid-row: 1 / span 4; background: #f1f5f9; border-radius: 4px; border: 1px dashed #cbd5e1; display: flex; align-items:center; justify-content:center; color:#94a3b8; font-size:10px; text-transform:uppercase; letter-spacing:2px; writing-mode: vertical-rl; transform: rotate(180deg); }

        /* TYPE B SPECIFIC PLACEMENT */
        .layout-type-b .p2 { grid-column: 2; grid-row: 1; }
        .layout-type-b .p3 { grid-column: 1; grid-row: 2; }
        .layout-type-b .p4 { grid-column: 1; grid-row: 3; }
        .layout-type-b .p5 { grid-column: 1; grid-row: 4; }
        .layout-type-b .p6 { grid-column: 2; grid-row: 5; }
        .layout-type-b .p1 { grid-column: 3; grid-row: 2 / span 2; }
        .layout-type-b .shower { grid-column: 3; grid-row: 4; }
        .layout-type-b .toilet { grid-column: 3; grid-row: 5; }
        .layout-type-b .door { grid-column: 2; grid-row: 5; margin-left: 80px; width: 80px; position:absolute; right: -86px; top: 0; height: 100%;} /* Custom hack for door location in Type B */
        /* Wait, Type B: Door is bottom right below toilet? No, image says Door is next to toilet, pointing UP. 
           Let's rethink Type B strictly. 
           Row 1: [empty] [ P2 ] [empty]
           Row 2: [ P3  ] [corr] [ P1  ]
           Row 3: [ P4  ] [corr] [ P1  ]
           Row 4: [ P5  ] [corr] [Shower]
           Row 5: [empty] [ P6 ] [Toilet]
           Door is below Toilet? Image shows arrow pointing UP from Door into the corridor area next to P6 and Toilet.
           Let's just put Door at Row 6 Col 3.
        */
        .layout-type-b .door { grid-column: 3; grid-row: 6; height: 40px;}
        .layout-type-b .c1 { grid-column: 2; grid-row: 2 / span 3; background: #f1f5f9; border-radius: 4px; border: 1px dashed #cbd5e1; display: flex; align-items:center; justify-content:center; color:#94a3b8; font-size:10px; text-transform:uppercase; letter-spacing:2px; writing-mode: vertical-rl; transform: rotate(180deg); }

        .selected-partition-display {
            margin-top: 15px;
            text-align: center;
            font-size: 14px;
            color: #475569;
        }

        .selected-partition-display span {
            font-weight: 700;
            color: #2d72d2;
            font-size: 16px;
        }
    </style>
    `;

    // Insert CSS before </head>
    content = content.replace('</head>', floorPlanCSS + '</head>');

    // 2. Add the Floor Plan HTML Section
    const floorPlanHTML = `
        <div class="floor-plan-section">
            <div class="floor-plan-header">
                <div>
                    <h3 style="font-size: 16px; color: #1e293b; margin-bottom: 4px;">Choose Partition</h3>
                    <p style="font-size: 12px; color: #64748b;">Select your preferred bed location (Top-Down View)</p>
                </div>
                <div class="type-toggle">
                    <button type="button" class="type-btn active" id="btnTypeA">Type A</button>
                    <button type="button" class="type-btn" id="btnTypeB">Type B</button>
                </div>
            </div>

            <div class="floor-plan-container">
                <!-- TYPE A LAYOUT (Default) -->
                <div class="grid-layout layout-type-a" id="floorPlanGrid">
                    <div class="room-block selectable p6" data-partition="P6">P6</div>
                    <div class="room-block selectable p5" data-partition="P5">P5</div>
                    <div class="room-block selectable p4" data-partition="P4">P4</div>
                    <div class="room-block selectable p3" data-partition="P3">P3</div>
                    
                    <div class="room-block static door">Door</div>
                    <div class="room-block static toilet">Toilet</div>
                    <div class="room-block static shower">Shower</div>
                    
                    <div class="room-block selectable p1" data-partition="P1">P1</div>
                    <div class="room-block selectable p2" data-partition="P2">P2</div>
                    
                    <div class="c1">WALKWAY</div>
                </div>
            </div>

            <div class="selected-partition-display">
                Selected Partition: <span id="displaySelectedPartition">None</span>
            </div>
            <!-- Hidden input to store value for Firebase -->
            <input type="hidden" id="selectedPartitionInput" required>
        </div>
    `;

    // Insert the HTML right before the "Room Type" preferences form group
    const targetInsertion = '<div class="form-group">';
    content = content.replace(targetInsertion, floorPlanHTML + '\\n\\n                ' + targetInsertion);

    // 3. Add the logic to handle clicks and toggle
    const jsLogic = `
        // Floor Plan Logic
        const btnTypeA = document.getElementById('btnTypeA');
        const btnTypeB = document.getElementById('btnTypeB');
        const floorPlanGrid = document.getElementById('floorPlanGrid');
        const partitionBlocks = document.querySelectorAll('.room-block.selectable');
        const displaySelectedPartition = document.getElementById('displaySelectedPartition');
        const selectedPartitionInput = document.getElementById('selectedPartitionInput');

        // Toggle Room Types
        btnTypeA.addEventListener('click', () => {
            btnTypeA.classList.add('active');
            btnTypeB.classList.remove('active');
            floorPlanGrid.className = 'grid-layout layout-type-a';
            // Reset selection
            clearSelection();
        });

        btnTypeB.addEventListener('click', () => {
            btnTypeB.classList.add('active');
            btnTypeA.classList.remove('active');
            floorPlanGrid.className = 'grid-layout layout-type-b';
            // Ensure Type B Grid has enough rows
            floorPlanGrid.style.gridTemplateRows = '60px 60px 60px 60px 60px 40px'; 
            clearSelection();
        });

        // Handle Partition Selection
        partitionBlocks.forEach(block => {
            block.addEventListener('click', () => {
                clearSelection();
                block.classList.add('selected');
                const pValue = block.getAttribute('data-partition');
                displaySelectedPartition.textContent = pValue;
                selectedPartitionInput.value = pValue;
            });
        });

        function clearSelection() {
            partitionBlocks.forEach(b => b.classList.remove('selected'));
            displaySelectedPartition.textContent = 'None';
            selectedPartitionInput.value = '';
        }
    `;

    // Inject JS logic before the form submission listener
    content = content.replace("document.getElementById('applyForm').addEventListener('submit', async (e) => {", jsLogic + "\\n\\n        document.getElementById('applyForm').addEventListener('submit', async (e) => {");

    // 4. Hook into Firebase submit
    // Find where firestore gets saved, usually a block like:
    // await addDoc(collection(db, "applications"), {
    //    fullName: ...
    // Let's inject selectedPartitionInput.value into that object.
    
    // We will look for `intake: document.getElementById('intake').value,`
    const insertData = "intake: document.getElementById('intake').value,\\n                    partition: document.getElementById('selectedPartitionInput').value,";
    content = content.replace("intake: document.getElementById('intake').value,", insertData);

    // Also we need to validate that a partition is selected before submitting
    const validateLogic = `
            if (!document.getElementById('selectedPartitionInput').value) {
                alert("Please select a Partition (P1-P6) from the Floor Plan.");
                return;
            }
    `;
    content = content.replace("e.preventDefault();", "e.preventDefault();\\n" + validateLogic);

    fs.writeFileSync('room-apply.html', content);
    console.log("Floor plan UI injected into room-apply.html");
}
