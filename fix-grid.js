const fs = require('fs');
let content = fs.readFileSync('c:/Users/Al Hafiz/public/room-apply.html', 'utf8');

const oldCSSStart = '.grid-layout {';
const oldCSSEnd = '        .layout-type-b .door-swing {\r\n            position: absolute;\r\n            top: 120px;\r\n            left: 280px;\r\n            transform: translateX(-100%);\r\n            width: 0;\r\n            height: 0;\r\n            border-top: 25px solid #000;\r\n            border-left: 25px solid transparent;\r\n            z-index: 10;\r\n        }';
const oldCSSEndLF = '        .layout-type-b .door-swing {\n            position: absolute;\n            top: 120px;\n            left: 280px;\n            transform: translateX(-100%);\n            width: 0;\n            height: 0;\n            border-top: 25px solid #000;\n            border-left: 25px solid transparent;\n            z-index: 10;\n        }';

const newCSS = `.grid-layout {
            display: grid;
            gap: 1px;
            background: #000;
            border: 1px solid #000;
            grid-template-columns: repeat(20, 30px);
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
            white-space: nowrap;
        }

        /* Type A Specifics */
        .layout-type-a .toilet { grid-column: 5 / span 3; grid-row: 1; }
        .layout-type-a .shower { grid-column: 8 / span 3; grid-row: 1; }
        .layout-type-a .p1 { grid-column: 11 / span 6; grid-row: 1; }
        
        .layout-type-a .p6 { grid-column: 1 / span 4; grid-row: 2; }
        .layout-type-a .c1 { grid-column: 5 / span 12; grid-row: 2; }
        .layout-type-a .p2 { grid-column: 17 / span 4; grid-row: 2; }
        
        .layout-type-a .p5 { grid-column: 5 / span 4; grid-row: 3; }
        .layout-type-a .p4 { grid-column: 9 / span 4; grid-row: 3; }
        .layout-type-a .p3 { grid-column: 13 / span 4; grid-row: 3; }

        .layout-type-a .main-door {
            top: -30px;
            left: 120px;
            transform: translateX(-50%);
        }
        
        .layout-type-a .inner-door {
            top: 5px;
            left: 45px; /* Center of Toilet relative to Corridor */
            transform: translateX(-50%);
        }

        .layout-type-a .door-swing {
            position: absolute;
            top: 120px;
            left: 120px;
            width: 0;
            height: 0;
            border-top: 25px solid #000;
            border-right: 25px solid transparent;
            z-index: 10;
        }

        /* Type B Specifics */
        .layout-type-b .p1 { grid-column: 5 / span 6; grid-row: 1; }
        .layout-type-b .shower { grid-column: 11 / span 3; grid-row: 1; }
        .layout-type-b .toilet { grid-column: 14 / span 3; grid-row: 1; }
        
        .layout-type-b .p2 { grid-column: 1 / span 4; grid-row: 2; }
        .layout-type-b .c1 { grid-column: 5 / span 12; grid-row: 2; }
        .layout-type-b .p6 { grid-column: 17 / span 4; grid-row: 2; }
        
        .layout-type-b .p3 { grid-column: 5 / span 4; grid-row: 3; }
        .layout-type-b .p4 { grid-column: 9 / span 4; grid-row: 3; }
        .layout-type-b .p5 { grid-column: 13 / span 4; grid-row: 3; }

        .layout-type-b .main-door {
            top: -30px;
            left: 480px;
            transform: translateX(-50%);
        }
        
        .layout-type-b .inner-door {
            top: 5px;
            left: 315px; /* Center of Toilet relative to Corridor */
            transform: translateX(-50%);
        }

        .layout-type-b .door-swing {
            position: absolute;
            top: 120px;
            left: 480px;
            transform: translateX(-100%);
            width: 0;
            height: 0;
            border-top: 25px solid #000;
            border-left: 25px solid transparent;
            z-index: 10;
        }`;

let startIdx = content.indexOf(oldCSSStart);
let endIdx = content.indexOf(oldCSSEnd);
if (endIdx === -1) {
    endIdx = content.indexOf(oldCSSEndLF);
}

if (startIdx !== -1 && endIdx !== -1) {
    const endStr = content.substring(endIdx, endIdx + oldCSSEnd.length);
    let fullOldStr = content.substring(startIdx, endIdx + (endIdx === content.indexOf(oldCSSEndLF) ? oldCSSEndLF.length : oldCSSEnd.length));
    content = content.replace(fullOldStr, newCSS);
    
    // Also remove the Type B fix I added earlier:
    const typeBFix = \`        /* Fix Type B grid: mirror of Type A */
        .layout-type-b {
            grid-template-columns: 140px 70px 70px 140px;
        }\`;
    content = content.replace(typeBFix, '');
    
    fs.writeFileSync('c:/Users/Al Hafiz/public/room-apply.html', content);
    console.log('Successfully replaced grid CSS!');
} else {
    console.log('Could not find CSS block boundaries', startIdx, endIdx);
}
