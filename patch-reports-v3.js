const fs = require('fs');

let content = fs.readFileSync('warden-reports.html', 'utf8');

// 1. Replace the entire report-cards HTML to ensure it's clean and exactly 4 cards
const cardsOldRegex = /<div class="report-cards">[\s\S]*?<\/div>\s*<!-- Charts Grid -->/;
const cardsNew = `<div class="report-cards">
                    <div class="report-card" onclick="generateQuickReport('occupancy')">
                        <div class="report-icon">
                            <i class="fas fa-door-open"></i>
                        </div>
                        <div class="report-info">
                            <h4>Occupancy Report</h4>
                            <div id="stat-occupancy" style="font-size: 16px; font-weight: 700; color: #1e3a8a; margin: 4px 0;">-- Rooms</div>
                            <p>View Details →</p>
                        </div>
                    </div>
                    <div class="report-card" onclick="generateQuickReport('maintenance')">
                        <div class="report-icon">
                            <i class="fas fa-tools"></i>
                        </div>
                        <div class="report-info">
                            <h4>Maintenance Report</h4>
                            <div id="stat-maintenance" style="font-size: 16px; font-weight: 700; color: #1e3a8a; margin: 4px 0;">-- Requests</div>
                            <p>View Details →</p>
                        </div>
                    </div>
                    <div class="report-card" onclick="generateQuickReport('applications')">
                        <div class="report-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="report-info">
                            <h4>Applications Report</h4>
                            <div id="stat-applications" style="font-size: 16px; font-weight: 700; color: #1e3a8a; margin: 4px 0;">-- Pending</div>
                            <p>View Details →</p>
                        </div>
                    </div>
                    <div class="report-card" onclick="generateQuickReport('moveout')">
                        <div class="report-icon" style="background: rgba(244, 67, 54, 0.1); color: #f44336;">
                            <i class="fas fa-sign-out-alt"></i>
                        </div>
                        <div class="report-info">
                            <h4>Move-Out Report</h4>
                            <div id="stat-moveout" style="font-size: 16px; font-weight: 700; color: #1e3a8a; margin: 4px 0;">-- Pending</div>
                            <p>View Details →</p>
                        </div>
                    </div>
                </div>

                <!-- Charts Grid -->`;

content = content.replace(cardsOldRegex, cardsNew);

// 2. Fix blocks array globally in JS
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

// 4. Inject summary stats updates and moveout logic
const statsUpdate = `
            // Calculate moveout stats
            const pendingMoveouts = moveoutData.filter(m => m.status === 'pending').length;

            // Update Summary Cards
            document.getElementById('stat-occupancy').innerText = occupiedRooms + ' / ' + totalRooms + ' Fully Occupied';
            document.getElementById('stat-maintenance').innerText = (pendingMaintenance + inProgressMaintenance) + ' Active Requests';
            document.getElementById('stat-applications').innerText = pendingApps + ' Pending Apps';
            document.getElementById('stat-moveout').innerText = pendingMoveouts + ' Pending Move-Outs';
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
