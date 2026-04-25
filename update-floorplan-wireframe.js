const fs = require('fs');

if (fs.existsSync('room-apply.html')) {
    let content = fs.readFileSync('room-apply.html', 'utf8');

    const newFloorPlanCSS = `/* Floor Plan Styles */
        .floor-plan-section {
            background: #fff;
            padding: 30px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            margin-bottom: 30px;
            font-family: Arial, sans-serif;
        }

        .floor-plan-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 35px;
        }

        .type-toggle {
            display: flex;
            background: #f1f5f9;
            border-radius: 8px;
            padding: 4px;
        }

        .type-btn {
            padding: 8px 24px;
            border: none;
            background: transparent;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
            color: #64748b;
            cursor: pointer;
            transition: all 0.2s;
        }

        .type-btn.active {
            background: #fff;
            color: #000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .blueprint-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 0;
        }

        .blueprint-title {
            text-align: center;
            font-size: 13px;
            color: #000;
            margin-bottom: 40px;
            position: relative;
        }

        .blueprint-title::after {
            content: '\\f063';
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
            position: absolute;
            bottom: -25px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 14px;
        }

        .grid-layout {
            display: grid;
            gap: 1px;
            background: #000;
            border: 1px solid #000;
            grid-template-columns: 140px 70px 70px 140px;
            grid-template-rows: repeat(3, 120px);
            position: relative;
            margin: 0 auto;
        }

        .room-block {
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 13px;
            color: #000;
            position: relative;
            cursor: pointer;
        }

        .room-block.static {
            cursor: default;
        }

        .room-block.corridor {
            cursor: default;
        }

        /* Status Colors */
        .room-block.available {
            background: #86efac; /* Light Green */
        }

        .room-block.available:hover {
            background: #4ade80;
        }

        .room-block.available.selected {
            background: #16a34a !important; /* Dark Green */
            color: #fff;
            font-weight: bold;
        }

        .room-block.unavailable {
            background: #fca5a5; /* Light Red */
            cursor: not-allowed;
            opacity: 0.9;
        }

        /* Blueprint Annotations */
        .annotation {
            position: absolute;
            font-size: 11px;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #000;
        }

        /* Type A Specifics */
        .layout-type-a .toilet { grid-column: 2; grid-row: 1; }
        .layout-type-a .shower { grid-column: 3; grid-row: 1; }
        .layout-type-a .p1 { grid-column: 4; grid-row: 1; }
        .layout-type-a .p6 { grid-column: 1; grid-row: 2; }
        .layout-type-a .c1 { grid-column: 2 / span 2; grid-row: 2; }
        .layout-type-a .p2 { grid-column: 4; grid-row: 2; }
        .layout-type-a .p5 { grid-column: 1; grid-row: 3; }
        .layout-type-a .p4 { grid-column: 2 / span 2; grid-row: 3; }
        .layout-type-a .p3 { grid-column: 4; grid-row: 3; }

        .layout-type-a .main-door {
            top: -30px;
            left: 140px;
            transform: translateX(-50%);
        }
        
        .layout-type-a .inner-door {
            top: 5px;
            left: 35px; /* Half of Toilet width (70px) */
            transform: translateX(-50%);
        }

        .layout-type-a .door-swing {
            position: absolute;
            top: 120px;
            left: 140px;
            width: 0;
            height: 0;
            border-top: 25px solid #000;
            border-right: 25px solid transparent;
            z-index: 10;
        }

        /* Type B Specifics */
        .layout-type-b .p1 { grid-column: 1; grid-row: 1; }
        .layout-type-b .shower { grid-column: 2; grid-row: 1; }
        .layout-type-b .toilet { grid-column: 3; grid-row: 1; }
        .layout-type-b .p2 { grid-column: 1; grid-row: 2; }
        .layout-type-b .c1 { grid-column: 2 / span 2; grid-row: 2; }
        .layout-type-b .p6 { grid-column: 4; grid-row: 2; }
        .layout-type-b .p3 { grid-column: 1; grid-row: 3; }
        .layout-type-b .p4 { grid-column: 2 / span 2; grid-row: 3; }
        .layout-type-b .p5 { grid-column: 4; grid-row: 3; }

        .layout-type-b .main-door {
            top: -30px;
            left: 280px;
            transform: translateX(-50%);
        }
        
        .layout-type-b .inner-door {
            top: 5px;
            left: 105px; /* Shower(70) + Half of Toilet(35) */
            transform: translateX(-50%);
        }

        .layout-type-b .door-swing {
            position: absolute;
            top: 120px;
            left: 280px;
            transform: translateX(-100%);
            width: 0;
            height: 0;
            border-top: 25px solid #000;
            border-left: 25px solid transparent;
            z-index: 10;
        }

        .selected-partition-display {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #000;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }

        .selected-partition-display span {
            font-weight: bold;
            color: #16a34a;
            font-size: 16px;
            margin-left: 5px;
        }`;

    const cssRegex = /\/\*\s*Floor Plan Styles\s*\*\/[\s\S]*?\.selected-partition-display span\s*\{[\s\S]*?\}/;
    content = content.replace(cssRegex, newFloorPlanCSS);

    const newFloorPlanHTML = `<div class="floor-plan-container">
                <div class="blueprint-container">
                    <div class="blueprint-title" id="blueprintTitle">
                        Floor Plan<br>Type A
                    </div>

                    <div class="grid-layout layout-type-a" id="floorPlanGrid">
                        <!-- Annotations -->
                        <div class="annotation main-door">
                            Main Door
                            <i class="fas fa-arrow-down" style="margin-top: 3px;"></i>
                        </div>
                        <div class="door-swing"></div>

                        <!-- Row 1 -->
                        <div class="room-block static toilet">TOILET</div>
                        <div class="room-block static shower">SHOWER</div>
                        <div class="room-block p1 available" data-partition="P1">P1</div>
                        
                        <!-- Row 2 -->
                        <div class="room-block p6 available" data-partition="P6">P6</div>
                        <div class="room-block corridor c1">
                            <div class="annotation inner-door">
                                <i class="fas fa-arrow-up" style="margin-bottom: 3px;"></i>
                                Door
                            </div>
                        </div>
                        <div class="room-block p2 unavailable" data-partition="P2">P2</div>
                        
                        <!-- Row 3 -->
                        <div class="room-block p5 unavailable" data-partition="P5">P5</div>
                        <div class="room-block p4 available" data-partition="P4">P4</div>
                        <div class="room-block p3 available" data-partition="P3">P3</div>
                    </div>
                </div>
            </div>

            <div class="selected-partition-display">
                Selected Partition: <span id="displaySelectedPartition">None</span>
            </div>
            <!-- Hidden input to store value for Firebase -->
            <input type="hidden" id="selectedPartitionInput" required>`;
            
    const htmlRegex = /<div class="floor-plan-container">[\s\S]*?<\/div>\s*<\/div>\s*<div class="selected-partition-display">[\s\S]*?<\/div>\s*<!-- Hidden input to store value for Firebase -->\s*<input type="hidden" id="selectedPartitionInput" required>/;
    content = content.replace(htmlRegex, newFloorPlanHTML);
    
    // Update JS to also toggle the blueprint title text
    const jsToggleRegex = /\/\/ Toggle Room Types[\s\S]*?\/\/ Handle Partition Selection/;
    const newJsToggle = `// Toggle Room Types
        const blueprintTitle = document.getElementById('blueprintTitle');
        
        btnTypeA.addEventListener('click', () => {
            btnTypeA.classList.add('active');
            btnTypeB.classList.remove('active');
            floorPlanGrid.className = 'grid-layout layout-type-a';
            blueprintTitle.innerHTML = 'Floor Plan<br>Type A';
            clearSelection();
        });

        btnTypeB.addEventListener('click', () => {
            btnTypeB.classList.add('active');
            btnTypeA.classList.remove('active');
            floorPlanGrid.className = 'grid-layout layout-type-b';
            blueprintTitle.innerHTML = 'Floor Plan<br>Type B';
            clearSelection();
        });

        // Handle Partition Selection`;
        
    content = content.replace(jsToggleRegex, newJsToggle);

    fs.writeFileSync('room-apply.html', content);
    console.log("Floor plan CAD Wireframe applied successfully.");
}
