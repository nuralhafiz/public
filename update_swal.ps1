$content = Get-Content "c:\Users\Al Hafiz\public\warden-applications.html" -Raw

$swalTag = '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>'
if (-not ($content -match 'sweetalert2')) {
    $content = $content -replace '</head>', "$swalTag`n</head>"
}

$oldViewApp = '        window.viewApplication = \(id\) => \{[\s\S]*?Submitted: \$\{app.submittedAt\?\.toDate\(\)\.toLocaleString\(\) \|\| ''N/A''\}`\);[\s\S]*?\};'

$newViewApp = @'
        window.viewApplication = (id) => {
            const app = applications.find(a => a.id === id);
            
            // Format HTML for sweetalert
            const htmlContent = `
                <div style="text-align: left; font-size: 14px; line-height: 1.6; padding: 10px;">
                    <h4 style="color: #2d72d2; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 15px;"><i class="fas fa-user"></i> Personal Information</h4>
                    <p style="margin-bottom: 5px;"><strong>Name:</strong> ${app.fullName || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Student ID:</strong> ${app.studentId || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>IC Number:</strong> ${app.icNumber || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Gender:</strong> ${app.gender || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Race:</strong> ${app.race || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Religion:</strong> ${app.religion || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Course:</strong> ${app.course || 'N/A'}</p>
                    
                    <h4 style="color: #2d72d2; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px; margin-top: 25px; margin-bottom: 15px;"><i class="fas fa-address-card"></i> Contact & Details</h4>
                    <p style="margin-bottom: 5px;"><strong>Email:</strong> <a href="mailto:${app.email}" style="color: #2d72d2;">${app.email || 'N/A'}</a></p>
                    <p style="margin-bottom: 5px;"><strong>Phone:</strong> <a href="tel:${app.phone}" style="color: #2d72d2;">${app.phone || 'N/A'}</a></p>
                    <p style="margin-bottom: 5px;"><strong>Address:</strong> ${app.address || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Submitted:</strong> ${app.submittedAt?.toDate().toLocaleString() || 'N/A'}</p>
                    ${app.referenceNumber ? `<p style="margin-top: 15px;"><strong>Reference Number:</strong> <span style="background: #e8f5e9; color: #4caf50; padding: 4px 10px; border-radius: 6px; font-weight: bold; border: 1px solid #c8e6c9;">${app.referenceNumber}</span></p>` : ''}
                </div>
            `;

            Swal.fire({
                title: 'Application Details',
                html: htmlContent,
                width: '500px',
                confirmButtonText: 'Close',
                confirmButtonColor: '#2d72d2',
                showClass: {
                    popup: 'animate__animated animate__fadeInUp animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutDown animate__faster'
                }
            });
        };
'@

$oldUpdateApp = '        window.updateApplicationStatus = async \(id, status\) => \{[\s\S]*?catch \(error\) \{[\s\S]*?alert\("Error updating application: " \+ error\.message\);[\s\S]*?\}[\s\S]*?\}[\s\S]*?\};'

$newUpdateApp = @'
        window.updateApplicationStatus = async (id, status) => {
            const isApprove = status === 'approved';
            const confirmColor = isApprove ? '#4caf50' : '#f44336';
            const actionText = isApprove ? 'Approve' : 'Reject';
            const iconType = isApprove ? 'question' : 'warning';
            
            const result = await Swal.fire({
                title: 'Confirm Action',
                text: `Are you sure you want to ${status} this application?`,
                icon: iconType,
                showCancelButton: true,
                confirmButtonColor: confirmColor,
                cancelButtonColor: '#9e9e9e',
                confirmButtonText: `Yes, ${actionText}`,
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                try {
                    await updateDoc(doc(db, "applications", id), {
                        status: status,
                        reviewedAt: new Date()
                    });
                    Swal.fire({
                        title: 'Success!',
                        text: `Application has been ${status}.`,
                        icon: 'success',
                        confirmButtonColor: '#2d72d2'
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: "Error updating application: " + error.message,
                        icon: 'error',
                        confirmButtonColor: '#2d72d2'
                    });
                }
            }
        };
'@

$content = $content -replace $oldViewApp, $newViewApp
$content = $content -replace $oldUpdateApp, $newUpdateApp

Set-Content "c:\Users\Al Hafiz\public\warden-applications.html" $content
Write-Host "Updated UI functions!"
