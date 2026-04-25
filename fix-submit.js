const fs = require('fs');
let content = fs.readFileSync('c:/Users/Al Hafiz/public/room-apply.html', 'utf8');

// Fix the broken submit handler - the lines 1378-1379 are floating orphan "return; }"
// We need to replace that broken section with the proper submit handler
const broken = `        loadAvailability('typeA');\r\n                return;\r\n            }\r\n            \r\n            // Get current user`;
const fixed = `        loadAvailability('typeA');

        document.getElementById('applyForm').addEventListener('submit', async (e) => { 
            e.preventDefault(); 
            
            // Check if partition is selected
            if (!selectedPartitionInput.value) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No Partition Selected',
                    text: 'Please select a partition from the floor plan before submitting.',
                    confirmButtonColor: '#2d72d2'
                });
                return;
            }

            // Check if declaration is checked
            if (!document.getElementById('declaration').checked) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Declaration Required',
                    text: 'Please confirm that all information is correct by checking the declaration box.',
                    confirmButtonColor: '#2d72d2'
                });
                return;
            }
            
            // Get current user`;

if (content.includes(broken)) {
    content = content.replace(broken, fixed);
    console.log('Fixed submit handler!');
} else {
    // Try with LF
    const brokenLF = `        loadAvailability('typeA');\n                return;\r\n            }\r\n            \r\n            // Get current user`;
    if (content.includes(brokenLF)) {
        content = content.replace(brokenLF, fixed);
        console.log('Fixed submit handler (LF variant)!');
    } else {
        // Regex fallback
        content = content.replace(/loadAvailability\('typeA'\);\s*return;\s*\}\s*\/\/ Get current user/, `loadAvailability('typeA');

        document.getElementById('applyForm').addEventListener('submit', async (e) => { 
            e.preventDefault(); 
            
            // Check if partition is selected
            if (!selectedPartitionInput.value) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No Partition Selected',
                    text: 'Please select a partition from the floor plan before submitting.',
                    confirmButtonColor: '#2d72d2'
                });
                return;
            }

            // Check if declaration is checked
            if (!document.getElementById('declaration').checked) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Declaration Required',
                    text: 'Please confirm that all information is correct by checking the declaration box.',
                    confirmButtonColor: '#2d72d2'
                });
                return;
            }
            
            // Get current user`);
        console.log('Fixed via regex!');
    }
}

fs.writeFileSync('c:/Users/Al Hafiz/public/room-apply.html', content);
