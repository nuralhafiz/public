const fs = require('fs');
let content = fs.readFileSync('c:/Users/Al Hafiz/public/move-out.html', 'utf8');

// Add SweetAlert2 if not present
if (!content.includes('sweetalert2')) {
    content = content.replace('</head>', '    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>\n</head>');
}

// 1. RBAC Warden
content = content.replace(
    /alert\('🛡️ Access Denied: Warden accounts cannot access Student pages\.'\);\s*window\.location\.href = 'warden-dashboard\.html';/g,
    `Swal.fire({ heightAuto: false, icon: 'error', title: 'Access Denied', text: 'Warden accounts cannot access Student pages.', confirmButtonColor: '#2d72d2' }).then(() => { window.location.href = 'warden-dashboard.html'; });`
);

// 2. Logout fail
content = content.replace(
    /alert\("Logout failed: " \+ error\.message\);/g,
    `Swal.fire({ heightAuto: false, icon: 'error', title: 'Logout Failed', text: error.message, confirmButtonColor: '#2d72d2' });`
);

// 3. Step 1 validation
content = content.replace(
    /alert\("Please fill in all required fields in Step 1\."\);/g,
    `Swal.fire({ heightAuto: false, icon: 'warning', title: 'Required Fields', text: 'Please fill in all required fields in Step 1.', confirmButtonColor: '#2d72d2' });`
);

// 4. Declaration
content = content.replace(
    /alert\("Please confirm the declaration to proceed\."\);/g,
    `Swal.fire({ heightAuto: false, icon: 'warning', title: 'Declaration Required', text: 'Please confirm the declaration to proceed.', confirmButtonColor: '#2d72d2' });`
);

// 5. Not logged in
content = content.replace(
    /alert\("You must be logged in to submit an application\."\);/g,
    `Swal.fire({ heightAuto: false, icon: 'error', title: 'Authentication Required', text: 'You must be logged in to submit an application.', confirmButtonColor: '#2d72d2' });`
);

// 6. Generic required fields
content = content.replace(
    /alert\("Please fill in all required fields"\);/g,
    `Swal.fire({ heightAuto: false, icon: 'warning', title: 'Required Fields', text: 'Please fill in all required fields.', confirmButtonColor: '#2d72d2' });`
);

// 7. Submit success
const successAlertOld = `alert("✅ Move-out application submitted successfully!\\n\\n" +
                      "📋 Request ID: " + docRef.id + "\\n" +
                      "👤 Name: " + formData.fullName + "\\n" +
                      "🏷️ Index No: " + formData.indexNumber + "\\n" +
                      "🚪 Unit: " + formData.unitNo + "\\n" +
                      "📅 Move-Out Date: " + formattedDate + "\\n" +
                      "⏰ Inspection: " + (formData.inspectionTime || 'Not specified') + "\\n\\n" +
                      "The hostel management will contact you within 3 working days to confirm the inspection.");
                
                // Reset form
                e.target.reset();
                document.getElementById('declarationDate').value = today;
                document.getElementById('moveOutDate').setAttribute('min', today);
                
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    window.location.href = "student-dashboard.html";
                }, 2000);`;

const successAlertNew = `let successHtml = \`
                    <div style="text-align: left; font-size: 14px; line-height: 1.6;">
                        <p style="margin-bottom: 8px;"><i class="fas fa-file-alt" style="color: #2d72d2; width: 20px;"></i> <strong>Request ID:</strong> \${docRef.id}</p>
                        <p style="margin-bottom: 8px;"><i class="fas fa-user" style="color: #2d72d2; width: 20px;"></i> <strong>Name:</strong> \${formData.fullName}</p>
                        <p style="margin-bottom: 8px;"><i class="fas fa-id-badge" style="color: #2d72d2; width: 20px;"></i> <strong>Index No:</strong> \${formData.indexNumber}</p>
                        <p style="margin-bottom: 8px;"><i class="fas fa-door-open" style="color: #2d72d2; width: 20px;"></i> <strong>Unit:</strong> \${formData.unitNo}</p>
                        <p style="margin-bottom: 8px;"><i class="fas fa-calendar-alt" style="color: #2d72d2; width: 20px;"></i> <strong>Move-Out Date:</strong> \${formattedDate}</p>
                        <p style="margin-bottom: 15px;"><i class="fas fa-clock" style="color: #2d72d2; width: 20px;"></i> <strong>Inspection:</strong> \${formData.inspectionTime || 'Not specified'}</p>
                        <p style="font-size: 13px; color: #666; padding-top: 10px; border-top: 1px solid #eee;">
                            The hostel management will contact you within 3 working days to confirm the inspection.
                        </p>
                    </div>
                \`;
                
                Swal.fire({ heightAuto: false,
                    icon: 'success',
                    title: 'Move-out application submitted successfully!',
                    html: successHtml,
                    confirmButtonColor: '#2d72d2',
                    confirmButtonText: 'Back to Dashboard',
                    allowOutsideClick: false
                }).then(() => {
                    window.location.href = "student-dashboard.html";
                });`;

content = content.replace(successAlertOld, successAlertNew);

// 8. Submit failed
content = content.replace(
    /alert\("Failed to submit application: " \+ error\.message\);/g,
    `Swal.fire({ heightAuto: false, icon: 'error', title: 'Submission Failed', text: error.message, confirmButtonColor: '#2d72d2' });`
);

fs.writeFileSync('c:/Users/Al Hafiz/public/move-out.html', content, 'utf8');
console.log("Updated to use SweetAlert2");
