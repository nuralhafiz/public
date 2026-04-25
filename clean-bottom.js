const fs = require('fs');
let content = fs.readFileSync('c:/Users/Al Hafiz/public/warden-students.html', 'utf8');

// I know that the duplication started because I tried to replace the script tag.
// Let's just find the first instance of 'document.getElementById('nextPage').addEventListener'
// and truncate the file properly after it.

const nextPageStr = `        document.getElementById('nextPage').addEventListener('click', () => {
            const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderStudents();
            }
        });
    </script>
</body>
</html>`;

// The duplication starts somewhere around line 1270.
// Let's just find the EXACT start of the nextpage listener and replace everything after it.
const splitStr = "        document.getElementById('nextPage').addEventListener('click', () => {";
const parts = content.split(splitStr);

if (parts.length >= 2) {
    // Keep everything up to the FIRST instance
    let newContent = parts[0] + nextPageStr;
    fs.writeFileSync('c:/Users/Al Hafiz/public/warden-students.html', newContent);
    console.log("File bottom cleaned up successfully!");
} else {
    console.log("Could not find the split string.");
}
