const fs = require('fs');

if (fs.existsSync('room-apply.html')) {
    let content = fs.readFileSync('room-apply.html', 'utf8');

    const newFloorPlanCSS = `/* Floor Plan Styles */
        .floor-plan-section {
            background: #fff;
            padding: 30px;
            border-radius: 20px;
            border: 1px solid rgba(0,0,0,0.05);
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.03);
        }

        .floor-plan-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f1f5f9;
        }

        .type-toggle {
            display: flex;
            background: #f1f5f9;
            border-radius: 10px;
            padding: 5px;
        }

        .type-btn {
            padding: 8px 20px;
            border: none;
            background: transparent;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #64748b;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .type-btn.active {
            background: white;
            color: var(--primary-blue, #2d72d2);
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .floor-plan-container {
            display: flex;
            justify-content: center;
            background: #f8fafc;
            padding: 40px;
            border-radius: 16px;
            border: 2px dashed #cbd5e1;
            position: relative;
        }

        .grid-layout {
            display: grid;
            gap: 8px; /* Wall Thickness */
            background: #94a3b8; /* Wall Color */
            padding: 8px; /* Outer Wall */
            border-radius: 8px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            
            /* 4 Columns: 120px 60px 60px 120px */
            grid-template-columns: 120px 60px 60px 120px;
            grid-template-rows: repeat(3, 100px);
        }

        /* Generic Room Block */
        .room-block {
            background: #ffffff;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-weight: 700;
            color: #475569;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
            user-select: none;
        }

        .room-block i {
            font-size: 24px;
            margin-bottom: 8px;
            transition: all 0.3s;
        }
        
        .room-block span {
            font-size: 14px;
            letter-spacing: 0.5px;
        }

        /* Available Status (Green) */
        .room-block.available {
            background: #f0fdf4;
            color: #15803d;
            box-shadow: inset 0 0 0 2px #22c55e;
            cursor: pointer;
        }
        
        .room-block.available i {
            color: #22c55e;
        }

        .room-block.available:hover {
            background: #dcfce7;
            transform: translateY(-3px) scale(1.02);
            box-shadow: inset 0 0 0 2px #16a34a, 0 6px 12px rgba(34,197,94,0.2);
            z-index: 10;
        }

        .room-block.available.selected {
            background: #22c55e !important;
            color: white !important;
            box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4) !important;
            transform: translateY(-2px) scale(1.02);
            z-index: 10;
        }

        .room-block.available.selected i {
            color: white !important;
        }

        .room-block.available.selected::after {
            content: '\\f058';
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
            position: absolute;
            top: 6px;
            right: 6px;
            font-size: 16px;
            color: white;
        }

        /* Unavailable Status (Red) */
        .room-block.unavailable {
            background: #fef2f2;
            color: #b91c1c;
            box-shadow: inset 0 0 0 2px #ef4444;
            cursor: not-allowed;
            opacity: 0.85;
        }

        .room-block.unavailable i {
            color: #ef4444;
        }

        .room-block.unavailable::after {
            content: '\\f023'; /* lock icon */
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
            position: absolute;
            top: 6px;
            right: 6px;
            font-size: 14px;
            color: #ef4444;
        }

        /* Utilities */
        .room-block.static {
            background: #f1f5f9;
            color: #64748b;
            cursor: default;
        }
        
        .room-block.static i {
            color: #cbd5e1;
            font-size: 20px;
        }

        .room-block.door {
            background: #fffbeb;
            color: #b45309;
        }
        .room-block.door i { color: #fcd34d; }

        /* TYPE A SPECIFIC PLACEMENT */
        .layout-type-a .toilet { grid-column: 2; grid-row: 1; }
        .layout-type-a .shower { grid-column: 3; grid-row: 1; }
        .layout-type-a .p1 { grid-column: 4; grid-row: 1; }
        
        .layout-type-a .p6 { grid-column: 1; grid-row: 2; }
        .layout-type-a .c1 { grid-column: 2 / span 2; grid-row: 2; } /* Corridor */
        .layout-type-a .p2 { grid-column: 4; grid-row: 2; }
        
        .layout-type-a .p5 { grid-column: 1; grid-row: 3; }
        .layout-type-a .p4 { grid-column: 2 / span 2; grid-row: 3; }
        .layout-type-a .p3 { grid-column: 4; grid-row: 3; }

        /* TYPE B SPECIFIC PLACEMENT */
        .layout-type-b .p1 { grid-column: 1; grid-row: 1; }
        .layout-type-b .shower { grid-column: 2; grid-row: 1; }
        .layout-type-b .toilet { grid-column: 3; grid-row: 1; }
        
        .layout-type-b .p2 { grid-column: 1; grid-row: 2; }
        .layout-type-b .c1 { grid-column: 2 / span 2; grid-row: 2; }
        .layout-type-b .p6 { grid-column: 4; grid-row: 2; }
        
        .layout-type-b .p3 { grid-column: 1; grid-row: 3; }
        .layout-type-b .p4 { grid-column: 2 / span 2; grid-row: 3; }
        .layout-type-b .p5 { grid-column: 4; grid-row: 3; }

        /* Walkway Styling */
        .c1 { 
            background: #f8fafc; 
            background-image: linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
            background-size: 15px 15px;
            border-radius: 4px; 
            display: flex; 
            align-items:center; 
            justify-content:center; 
            color:#94a3b8; 
            font-size:14px; 
            font-weight: 700;
            text-transform:uppercase; 
            letter-spacing:6px; 
            box-shadow: inset 0 0 20px rgba(0,0,0,0.02);
        }

        .selected-partition-display {
            margin-top: 20px;
            text-align: center;
            font-size: 15px;
            color: #475569;
            background: #f8fafc;
            padding: 15px;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
        }

        .selected-partition-display span {
            font-weight: 800;
            color: #2d72d2;
            font-size: 18px;
            padding: 4px 12px;
            background: #eff6ff;
            border-radius: 6px;
            margin-left: 8px;
        }`;

    const cssRegex = /\/\*\s*Floor Plan Styles\s*\*\/[\s\S]*?\.selected-partition-display span\s*\{[\s\S]*?\}/;
    content = content.replace(cssRegex, newFloorPlanCSS);

    const newFloorPlanHTML = `<div class="floor-plan-container">
                <div class="grid-layout layout-type-a" id="floorPlanGrid">
                    <!-- Row 1 -->
                    <div class="room-block static toilet"><i class="fas fa-toilet"></i><span>Toilet</span></div>
                    <div class="room-block static shower"><i class="fas fa-shower"></i><span>Shower</span></div>
                    <div class="room-block p1 available" data-partition="P1"><i class="fas fa-bed"></i><span>P1</span></div>
                    
                    <!-- Row 2 -->
                    <div class="room-block p6 available" data-partition="P6"><i class="fas fa-bed"></i><span>P6</span></div>
                    <div class="c1">WALKWAY</div>
                    <div class="room-block p2 unavailable" data-partition="P2"><i class="fas fa-bed"></i><span>P2</span></div>
                    
                    <!-- Row 3 -->
                    <div class="room-block p5 unavailable" data-partition="P5"><i class="fas fa-bed"></i><span>P5</span></div>
                    <div class="room-block p4 available" data-partition="P4"><i class="fas fa-bed"></i><span>P4</span></div>
                    <div class="room-block p3 available" data-partition="P3"><i class="fas fa-bed"></i><span>P3</span></div>
                </div>
            </div>

            <div class="selected-partition-display">
                Selected Partition: <span id="displaySelectedPartition">None</span>
            </div>
            <!-- Hidden input to store value for Firebase -->
            <input type="hidden" id="selectedPartitionInput" required>`;
            
    const htmlRegex = /<div class="floor-plan-container">[\s\S]*?<\/div>\s*<\/div>\s*<div class="selected-partition-display">[\s\S]*?<\/div>\s*<!-- Hidden input to store value for Firebase -->\s*<input type="hidden" id="selectedPartitionInput" required>/;
    content = content.replace(htmlRegex, newFloorPlanHTML);
    
    const newJsLogic = `// Handle Partition Selection
        const allPartitionBlocks = document.querySelectorAll('.room-block[data-partition]');
        
        allPartitionBlocks.forEach(block => {
            block.addEventListener('click', () => {
                if (block.classList.contains('unavailable')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Partition Unavailable',
                        text: 'This partition is already occupied. Please choose a green partition.',
                        confirmButtonColor: '#ef4444'
                    });
                    return;
                }
                
                clearSelection();
                block.classList.add('selected');
                const pValue = block.getAttribute('data-partition');
                displaySelectedPartition.textContent = pValue;
                selectedPartitionInput.value = pValue;
            });
        });

        function clearSelection() {
            allPartitionBlocks.forEach(b => b.classList.remove('selected'));
            displaySelectedPartition.textContent = 'None';
            selectedPartitionInput.value = '';
        }`;
        
    const jsRegex = /\/\/ Handle Partition Selection[\s\S]*?function clearSelection\(\) \{[\s\S]*?selectedPartitionInput\.value = '';\s*\}/;
    content = content.replace(jsRegex, newJsLogic);

    fs.writeFileSync('room-apply.html', content);
    console.log("Floor plan V2 applied successfully with regex.");
}
