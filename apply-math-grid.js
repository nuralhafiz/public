const fs = require('fs');

const filePath = 'c:/Users/Al Hafiz/public/room-apply.html';
if (!fs.existsSync(filePath)) {
    console.error("Fail tidak dijumpai: " + filePath);
    process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// 1. Update CSS menggunakan Regular Expression (Regex) supaya tidak rapuh terhadap 'whitespace'
const newCSS = `.grid-layout {
            display: grid;
            gap: 1px;
            background: #000;
            border: 1px solid #000;
            width: 640px;
            grid-template-columns: repeat(160, 1fr);
            grid-template-rows: 80px 40px 120px 120px;
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
        
        .room-block.foyer {
            cursor: default;
            border: none;
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
        .layout-type-a .toilet { grid-column: 41 / 66; grid-row: 1; }
        .layout-type-a .shower { grid-column: 66 / 91; grid-row: 1; }
        .layout-type-a .foyer { grid-column: 41 / 91; grid-row: 2; }
        .layout-type-a .p1 { grid-column: 91 / 161; grid-row: 1 / span 2; }
        
        .layout-type-a .p6 { grid-column: 1 / 41; grid-row: 3; }
        .layout-type-a .c1 { grid-column: 41 / 138; grid-row: 3; }
        .layout-type-a .p2 { grid-column: 138 / 161; grid-row: 3; }
        
        .layout-type-a .p5 { grid-column: 21 / 60; grid-row: 4; }
        .layout-type-a .p4 { grid-column: 60 / 99; grid-row: 4; }
        .layout-type-a .p3 { grid-column: 99 / 138; grid-row: 4; }

        .layout-type-a .main-door {
            top: -30px;
            left: 160px; /* V3 = 40 units * 4px = 160px */
            transform: translateX(-50%);
        }
        
        .layout-type-a .inner-door {
            top: 5px;
            left: 100px; /* Center of Foyer relative to Corridor */
            transform: translateX(-50%);
        }

        .layout-type-a .door-swing {
            position: absolute;
            top: 120px;
            left: 160px;
            width: 0;
            height: 0;
            border-top: 25px solid #000;
            border-right: 25px solid transparent;
            z-index: 10;
        }

        /* Type B Specifics */
        .layout-type-b .p1 { grid-column: 1 / 71; grid-row: 1 / span 2; }
        .layout-type-b .foyer { grid-column: 71 / 121; grid-row: 2; }
        .layout-type-b .shower { grid-column: 71 / 96; grid-row: 1; }
        .layout-type-b .toilet { grid-column: 96 / 121; grid-row: 1; }
        
        .layout-type-b .p2 { grid-column: 1 / 24; grid-row: 3; }
        .layout-type-b .c1 { grid-column: 24 / 121; grid-row: 3; }
        .layout-type-b .p6 { grid-column: 121 / 161; grid-row: 3; }
        
        .layout-type-b .p3 { grid-column: 24 / 63; grid-row: 4; }
        .layout-type-b .p4 { grid-column: 63 / 102; grid-row: 4; }
        .layout-type-b .p5 { grid-column: 102 / 141; grid-row: 4; }

        .layout-type-b .main-door {
            top: -30px;
            left: 480px; /* 120 units * 4px = 480px */
            transform: translateX(-50%);
        }
        
        .layout-type-b .inner-door {
            top: 5px;
            left: 288px; /* Center of Foyer relative to Corridor */
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

// Match from .grid-layout to the closing brace of .layout-type-b .door-swing
const cssRegex = /\.grid-layout\s*\{[\s\S]*?\.layout-type-b\s*\.door-swing\s*\{[^}]+\}/;

if (cssRegex.test(content)) {
    content = content.replace(cssRegex, newCSS);
} else {
    console.log("Amaran: Kod CSS sasaran tidak dijumpai dalam room-apply.html. Kemungkinan sudah dikemas kini.");
}

// 2. Add foyer to HTML menggunakan Regex yang teguh (robust)
const htmlRegex = /<!-- Row 1: \[empty\] \[TOILET\] \[SHOWER\] \[P1\] -->\s*<div class="room-block static toilet">TOILET<\/div>\s*<div class="room-block static shower">SHOWER<\/div>\s*<div class="room-block p1 loading" data-partition="P1">/;

const newHtml = `                                        <!-- Row 1: TOILET, SHOWER, P1 -->
                                        <div class="room-block static toilet">TOILET</div>
                                        <div class="room-block static shower">SHOWER</div>
                                        <!-- Row 2: Foyer -->
                                        <div class="room-block static foyer"></div>
                                        <div class="room-block p1 loading" data-partition="P1">`;

if (htmlRegex.test(content)) {
    content = content.replace(htmlRegex, newHtml);
} else {
    console.log("Amaran: Kod HTML sasaran tidak dijumpai. Kemungkinan sudah dikemas kini.");
}

fs.writeFileSync(filePath, content);
console.log('Selesai! Berjaya mengemas kini grid layout dan HTML foyer.');
