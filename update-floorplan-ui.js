const fs = require('fs');

if (fs.existsSync('room-apply.html')) {
    let content = fs.readFileSync('room-apply.html', 'utf8');

    // 1. Replace CSS
    const oldCssRegex = /<style>[\s\S]*?\/\* Floor Plan Styles \*\/[\s\S]*?\.selected-partition-display span \{[\s\S]*?\}[\s\S]*?<\/style>/;
    
    // We will extract just the Floor Plan Styles and replace them.
    // Actually, looking at my previous script `inject-floorplan.js`, I added the CSS directly before </head>.
    // Let's replace the whole block from `/* Floor Plan Styles */` to `.selected-partition-display span { ... }`
    
    const newFloorPlanCSS = `
        /* Floor Plan Styles */
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

        .type-btn i {
            font-size: 14px;
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
            gap: 8px; /* Represents Wall Thickness */
            background: #94a3b8; /* Wall Color */
            padding: 8px; /* Outer Wall */
            border-radius: 8px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            
            grid-template-columns: 110px 90px 110px;
            grid-template-rows: repeat(6, 75px);
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
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
        }

        .room-block i {
            font-size: 22px;
            margin-bottom: 6px;
            color: #94a3b8;
            transition: all 0.3s;
        }
        
        .room-block span {
            font-size: 13px;
            letter-spacing: 0.5px;
        }

        .room-block.selectable:hover {
            background: #f0f9ff;
            box-shadow: inset 0 0 0 2px #3b82f6;
            color: #1d4ed8;
            transform: translateY(-2px) scale(1.02);
            z-index: 10;
        }

        .room-block.selectable:hover i {
            color: #3b82f6;
        }

        .room-block.selected {
            background: #f0fdf4 !important;
            box-shadow: inset 0 0 0 3px #22c55e !important;
            color: #15803d !important;
            transform: translateY(-2px) scale(1.02);
            z-index: 10;
        }

        .room-block.selected i {
            color: #22c55e !important;
        }

        .room-block.selected::after {
            content: '\\f058'; /* fa-check-circle */
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
            position: absolute;
            top: 6px;
            right: 6px;
            font-size: 16px;
            color: #22c55e;
        }

        .room-block.static {
            background: #f1f5f9;
            color: #64748b;
            cursor: not-allowed;
        }
        
        .room-block.static i {
            color: #cbd5e1;
            font-size: 18px;
        }

        .room-block.door {
            background: #fffbeb;
            color: #b45309;
        }
        .room-block.door i { color: #fcd34d; }

        /* TYPE A SPECIFIC PLACEMENT */
        .layout-type-a .p6 { grid-column: 1; grid-row: 1; }
        .layout-type-a .p5 { grid-column: 1; grid-row: 2; }
        .layout-type-a .p4 { grid-column: 1; grid-row: 3; }
        .layout-type-a .p3 { grid-column: 1; grid-row: 4; }
        
        /* Type A Door and Utils Top Right */
        .layout-type-a .door { grid-column: 3; grid-row: 1; }
        .layout-type-a .toilet { grid-column: 3; grid-row: 2; }
        .layout-type-a .shower { grid-column: 3; grid-row: 3; }
        
        /* P1 is double sized */
        .layout-type-a .p1 { grid-column: 3; grid-row: 4 / span 2; }
        .layout-type-a .p2 { grid-column: 2; grid-row: 5; }
        
        /* The Walkway Corridor */
        .layout-type-a .c1 { 
            grid-column: 2; 
            grid-row: 1 / span 4; 
            background: #f8fafc; 
            background-image: linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
            background-size: 15px 15px;
            border-radius: 4px; 
            display: flex; 
            align-items:center; 
            justify-content:center; 
            color:#94a3b8; 
            font-size:12px; 
            font-weight: 600;
            text-transform:uppercase; 
            letter-spacing:4px; 
            writing-mode: vertical-rl; 
            transform: rotate(180deg);
            box-shadow: inset 0 0 20px rgba(0,0,0,0.02);
        }

        /* TYPE B SPECIFIC PLACEMENT */
        /* Type B has P2 top center */
        .layout-type-b .p2 { grid-column: 2; grid-row: 1; }
        .layout-type-b .p3 { grid-column: 1; grid-row: 2; }
        .layout-type-b .p4 { grid-column: 1; grid-row: 3; }
        .layout-type-b .p5 { grid-column: 1; grid-row: 4; }
        
        /* Type B has P1 double sized middle right */
        .layout-type-b .p1 { grid-column: 3; grid-row: 2 / span 2; }
        
        /* Utils below P1 */
        .layout-type-b .shower { grid-column: 3; grid-row: 4; }
        .layout-type-b .toilet { grid-column: 3; grid-row: 5; }
        
        /* P6 bottom right center */
        .layout-type-b .p6 { grid-column: 2; grid-row: 5; }
        
        /* Door bottom right */
        .layout-type-b .door { grid-column: 3; grid-row: 6; }
        
        .layout-type-b .c1 { 
            grid-column: 2; 
            grid-row: 2 / span 3; 
            background: #f8fafc; 
            background-image: linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
            background-size: 15px 15px;
            border-radius: 4px; 
            display: flex; 
            align-items:center; 
            justify-content:center; 
            color:#94a3b8; 
            font-size:12px; 
            font-weight: 600;
            text-transform:uppercase; 
            letter-spacing:4px; 
            writing-mode: vertical-rl; 
            transform: rotate(180deg);
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

    // Regex to grab the old styles and replace them
    const replaceCssRegex = /\/\*\s*Floor Plan Styles\s*\*\/[\s\S]*?\.selected-partition-display span\s*\{[^}]*\}/;
    content = content.replace(replaceCssRegex, newFloorPlanCSS);

    // 2. Replace HTML elements to include FontAwesome icons
    const oldHtmlRegex = /<div class="floor-plan-container">[\s\S]*?<\/div>\s*<\/div>\s*<div class="selected-partition-display">/;
    
    const newFloorPlanHTML = `<div class="floor-plan-container">
                <!-- TYPE A LAYOUT (Default) -->
                <div class="grid-layout layout-type-a" id="floorPlanGrid">
                    <div class="room-block selectable p6" data-partition="P6"><i class="fas fa-bed"></i><span>P6</span></div>
                    <div class="room-block selectable p5" data-partition="P5"><i class="fas fa-bed"></i><span>P5</span></div>
                    <div class="room-block selectable p4" data-partition="P4"><i class="fas fa-bed"></i><span>P4</span></div>
                    <div class="room-block selectable p3" data-partition="P3"><i class="fas fa-bed"></i><span>P3</span></div>
                    
                    <div class="room-block static door"><i class="fas fa-door-open"></i><span>Door</span></div>
                    <div class="room-block static toilet"><i class="fas fa-toilet"></i><span>Toilet</span></div>
                    <div class="room-block static shower"><i class="fas fa-shower"></i><span>Shower</span></div>
                    
                    <div class="room-block selectable p1" data-partition="P1"><i class="fas fa-bed"></i><span>P1</span></div>
                    <div class="room-block selectable p2" data-partition="P2"><i class="fas fa-bed"></i><span>P2</span></div>
                    
                    <div class="c1">WALKWAY</div>
                </div>
            </div>

            <div class="selected-partition-display">`;
            
    content = content.replace(oldHtmlRegex, newFloorPlanHTML);
    
    // Also enhance the toggle buttons in HTML to include icons
    content = content.replace('<button type="button" class="type-btn active" id="btnTypeA">Type A</button>', '<button type="button" class="type-btn active" id="btnTypeA"><i class="fas fa-layer-group"></i> Type A</button>');
    content = content.replace('<button type="button" class="type-btn" id="btnTypeB">Type B</button>', '<button type="button" class="type-btn" id="btnTypeB"><i class="fas fa-cubes"></i> Type B</button>');

    fs.writeFileSync('room-apply.html', content);
    console.log("Visual enhanced floor plan injected into room-apply.html");
}
