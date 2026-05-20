const fs = require('fs');

let content = fs.readFileSync('warden-reports.html', 'utf8');

// 1. Update HTML Cards
content = content.replace(
    /<h4>Occupancy Report<\/h4>\s*<p>View Details →<\/p>/,
    '<h4>Occupancy Report</h4>\n                            <div id="stat-occupancy" style="font-size: 16px; font-weight: 700; color: #1e3a8a; margin: 4px 0;">-- Rooms</div>\n                            <p>View Details →</p>'
);
content = content.replace(
    /<h4>Maintenance Report<\/h4>\s*<p>View Details →<\/p>/,
    '<h4>Maintenance Report</h4>\n                            <div id="stat-maintenance" style="font-size: 16px; font-weight: 700; color: #1e3a8a; margin: 4px 0;">-- Requests</div>\n                            <p>View Details →</p>'
);
content = content.replace(
    /<h4>Applications Report<\/h4>\s*<p>View Details →<\/p>/,
    '<h4>Applications Report</h4>\n                            <div id="stat-applications" style="font-size: 16px; font-weight: 700; color: #1e3a8a; margin: 4px 0;">-- Pending</div>\n                            <p>View Details →</p>'
);

// 2. Fix blocks array globally
content = content.replace(/const blocks = \['A', 'B', 'C', 'D'\];/g, "const blocks = ['A1', 'A2', 'A3', 'A4', 'A5', 'A7'];");

// 3. Fix reserved -> partial logic in generateReport
content = content.replace(
    "const reservedRooms = roomsData.filter(r => r.status === 'reserved').length;",
    "const partialRooms = roomsData.filter(r => r.status === 'partial').length;"
);
content = content.replace(
    "const reservedPct = totalRooms > 0 ? Math.round((reservedRooms / totalRooms) * 100) : 0;",
    "const partialPct = totalRooms > 0 ? Math.round((partialRooms / totalRooms) * 100) : 0;"
);
content = content.replace(
    "renderPieChart(occupiedPct, availablePct, maintenancePct, reservedPct);",
    "renderPieChart(occupiedPct, availablePct, maintenancePct, partialPct);"
);

// 4. Inject summary stats updates
const statsUpdate = `
            // Update Summary Cards
            document.getElementById('stat-occupancy').innerText = occupiedRooms + ' / ' + totalRooms + ' Fully Occupied';
            document.getElementById('stat-maintenance').innerText = (pendingMaintenance + inProgressMaintenance) + ' Active Requests';
            document.getElementById('stat-applications').innerText = pendingApps + ' Pending Apps';
`;
content = content.replace(
    "renderApplicationsTable(totalApps, approvedApps, pendingApps, rejectedApps);",
    "renderApplicationsTable(totalApps, approvedApps, pendingApps, rejectedApps);\n" + statsUpdate
);

// 5. Update renderPieChart definition and legend
content = content.replace(
    "function renderPieChart(occupied, available, maintenance, reserved)",
    "function renderPieChart(occupied, available, maintenance, partial)"
);
content = content.replace(
    "<span>Occupied: ${occupied}%</span>",
    "<span>Fully Occupied: ${occupied}%</span>"
);
content = content.replace(
    "<span>Reserved: ${reserved}%</span>",
    "<span>Partially Occupied: ${partial}%</span>"
);

// 6. Fix top block default
content = content.replace("let topBlock = 'A';", "let topBlock = 'A1';");

fs.writeFileSync('warden-reports.html', content);
console.log('Patched successfully');
