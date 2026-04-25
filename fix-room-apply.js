const fs = require('fs');

if (fs.existsSync('room-apply.html')) {
    let content = fs.readFileSync('room-apply.html', 'utf8');

    // 1. Remove the bad validation from the hamburger menu
    const badHamburgerLogic = `            e.preventDefault();\\n
            if (!document.getElementById('selectedPartitionInput').value) {
                alert("Please select a Partition (P1-P6) from the Floor Plan.");
                return;
            }`;
    content = content.replace(badHamburgerLogic, "            e.preventDefault();");

    // 2. Add validation to the form submit event
    const formSubmitTarget = `        document.getElementById('applyForm').addEventListener('submit', async (e) => { \\n            e.preventDefault();`;
    const newFormSubmit = `        document.getElementById('applyForm').addEventListener('submit', async (e) => { \\n            e.preventDefault();\\n            \\n            if (!document.getElementById('selectedPartitionInput').value) {\\n                Swal.fire({\\n                    icon: 'warning',\\n                    title: 'Partition Required',\\n                    text: 'Please select a Partition (P1-P6) from the Floor Plan layout.',\\n                    confirmButtonColor: '#2d72d2'\\n                });\\n                return;\\n            }`;
    
    // Replace if it hasn't been added properly
    if (!content.includes("title: 'Partition Required'")) {
        content = content.replace("document.getElementById('applyForm').addEventListener('submit', async (e) => { \\n            e.preventDefault();", newFormSubmit);
    }

    // 3. Add partition to the payload
    const payloadTarget = "applicationType: 'room'\\n                };";
    const newPayload = "applicationType: 'room',\\n                    partition: document.getElementById('selectedPartitionInput').value\\n                };";
    
    if (!content.includes("partition: document.getElementById('selectedPartitionInput').value")) {
        content = content.replace(payloadTarget, newPayload);
    }

    // 4. Update the Success Alert to show Partition
    const successAlertTarget = "<p><b>Email:</b> ${formData.email}</p>\\n                            <p><b>Date:</b> ${formData.declarationDate}</p>";
    const newSuccessAlert = "<p><b>Email:</b> ${formData.email}</p>\\n                            <p><b>Partition:</b> ${formData.partition}</p>\\n                            <p><b>Date:</b> ${formData.declarationDate}</p>";
    
    if (!content.includes("<p><b>Partition:</b> ${formData.partition}</p>")) {
        content = content.replace(successAlertTarget, newSuccessAlert);
    }

    fs.writeFileSync('room-apply.html', content);
    console.log("Fixed room-apply.html logic");
}
