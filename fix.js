const fs = require('fs');

let content = fs.readFileSync('warden-rooms.html', 'utf8');

// HTML Dropdown fixes
content = content.replace('<option value="1-bed-left">1 Bed Left</option>', '');
content = content.replace('<option value="2-beds-left">2 Beds Left</option>', '');
content = content.replace('<option value="reserved">Reserved</option>', '');

// Dropdown text replacements
content = content.replace('<option value="occupied">Fully Occupied</option>', '<option value="occupied">Occupied (Ada Pelajar)</option>');
content = content.replace('<option value="partial">Partially Occupied</option>', '<option value="full">Dah Penuh</option>');

// JS Logic fixes
const oldLogicStr = `                // Status filter
                if (statusFilter !== 'all') {
                    if (statusFilter === 'occupied') {
                        if (room.effectiveStatus !== 'occupied' && room.effectiveStatus !== 'partial') return false;
                    } else if (statusFilter === 'partial') {
                        if (room.effectiveStatus !== 'partial') return false;
                    } else if (statusFilter === '1-bed-left') {
                        let currentOcc = room.occupants ? Object.keys(room.occupants).length : ((room.status === 'occupied' && room.occupantName) ? 1 : 0);
                        let maxOcc = room.beds || 6;
                        if ((maxOcc - currentOcc) !== 1) return false;
                    } else if (statusFilter === '2-beds-left') {
                        let currentOcc = room.occupants ? Object.keys(room.occupants).length : ((room.status === 'occupied' && room.occupantName) ? 1 : 0);
                        let maxOcc = room.beds || 6;
                        if ((maxOcc - currentOcc) !== 2) return false;
                    } else {
                        if (room.effectiveStatus !== statusFilter) return false;
                    }
                }`;

// Standardize line endings before replace to be safe
content = content.replace(/\r\n/g, '\n');

// Build regex to handle flexible whitespace for JS logic
const regex = /\/\/ Status filter\s+if \(statusFilter !== 'all'\) \{\s+if \(statusFilter === 'occupied'\) \{\s+if \(room\.effectiveStatus !== 'occupied' && room\.effectiveStatus !== 'partial'\) return false;\s+\} else if \(statusFilter === 'partial'\) \{\s+if \(room\.effectiveStatus !== 'partial'\) return false;\s+\} else if \(statusFilter === '1-bed-left'\) \{[\s\S]*?\} else if \(statusFilter === '2-beds-left'\) \{[\s\S]*?\} else \{\s+if \(room\.effectiveStatus !== statusFilter\) return false;\s+\}\s+\}/g;

const newLogicStr = `                // Status filter
                if (statusFilter !== 'all') {
                    if (statusFilter === 'occupied') {
                        if (room.effectiveStatus !== 'occupied' && room.effectiveStatus !== 'partial') return false;
                    } else if (statusFilter === 'full') {
                        if (room.effectiveStatus !== 'occupied') return false;
                    } else {
                        if (room.effectiveStatus !== statusFilter) return false;
                    }
                }`;

content = content.replace(regex, newLogicStr);

// UI Badge fixes
content = content.replace("statusText = 'Fully Occupied';", "statusText = 'Dah Penuh';");
content = content.replace("statusText = 'Partially Occupied';", "statusText = 'Occupied';");

fs.writeFileSync('warden-rooms.html', content);
console.log('Fixed!');
