const fs = require('fs');

let content = fs.readFileSync('c:/Users/Al Hafiz/public/warden-reports.html', 'utf-8');

// Add html2canvas to the head
content = content.replace(
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>'
);

const oldCode = `        window.generateQuickReport = (type) => {
            const reportNames = {
                'occupancy': 'Occupancy Report',
                'financial': 'Financial Report',
                'maintenance': 'Maintenance Report',
                'applications': 'Applications Report'
            };
            alert(\`📈 Generating \${reportNames[type]}...\\n\\nThis feature will export detailed data soon.\`);
        };
        
        window.exportChart = (chart, format) => {
            alert(\`📥 Exporting \${chart} chart as \${format.toUpperCase()}\\n\\nThis feature will be available soon.\`);
        };
        
        window.exportTable = (table) => {
            alert(\`📥 Exporting \${table} table data\\n\\nThis feature will be available soon.\`);
        };`;

const newCode = `        window.generateQuickReport = (type) => {
            const reportNames = {
                'occupancy': 'Occupancy Report',
                'financial': 'Financial Report',
                'maintenance': 'Maintenance Report',
                'applications': 'Applications Report'
            };
            Swal.fire({
                title: 'Generate Quick Report',
                text: \`Generate and download \${reportNames[type]}?\`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#2d72d2',
                confirmButtonText: 'Generate'
            }).then((result) => {
                if(result.isConfirmed) {
                    Swal.fire('Generated!', \`\${reportNames[type]} has been generated.\`, 'success');
                }
            });
        };
        
        window.exportChart = (chart, format) => {
            let elementId;
            if (chart === 'occupancy') elementId = 'occupancyChart';
            else if (chart === 'distribution') elementId = 'pieChart';
            
            if(!elementId) return;
            
            const element = document.getElementById(elementId).parentElement; // Get container
            
            if(format === 'png') {
                html2canvas(element).then(canvas => {
                    const link = document.createElement('a');
                    link.download = \`\${chart}-chart.png\`;
                    link.href = canvas.toDataURL();
                    link.click();
                    Swal.fire('Exported!', 'Chart exported as PNG', 'success');
                });
            } else if (format === 'pdf') {
                html2canvas(element).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF();
                    pdf.text(\`\${chart.toUpperCase()} CHART\`, 10, 10);
                    pdf.addImage(imgData, 'PNG', 10, 20, 180, 100);
                    pdf.save(\`\${chart}-chart.pdf\`);
                    Swal.fire('Exported!', 'Chart exported as PDF', 'success');
                });
            }
        };
        
        window.exportTable = (tableId) => {
            let realId;
            if(tableId === 'top-blocks') realId = 'topBlocksTable';
            else if(tableId === 'revenue') realId = 'revenueTable';
            else if(tableId === 'maintenance') realId = 'maintenanceTable';
            else if(tableId === 'applications') realId = 'applicationsTable';
            
            if(!realId) return;
            
            const table = document.getElementById(realId);
            if(!table) return;
            
            let csv = [];
            const rows = table.querySelectorAll('tr');
            
            for (let i = 0; i < rows.length; i++) {
                let row = [], cols = rows[i].querySelectorAll('td, th');
                
                for (let j = 0; j < cols.length; j++) 
                    row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"');
                
                csv.push(row.join(','));
            }
            
            const csvStr = csv.join('\\n');
            const blob = new Blob([csvStr], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', \`\${tableId}_report.csv\`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            Swal.fire('Exported!', 'Table data exported as CSV', 'success');
        };`;

content = content.replace(oldCode, newCode);

fs.writeFileSync('c:/Users/Al Hafiz/public/warden-reports.html', content);
console.log('Done!');
