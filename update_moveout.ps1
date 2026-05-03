$content = Get-Content "c:\Users\Al Hafiz\public\warden-moveout.html" -Raw

$swalTag = '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>'
if (-not ($content -match 'sweetalert2')) {
    $content = $content -replace '</head>', "$swalTag`n</head>"
}

$oldViewReq = '        window.viewRequest = \(id\) => \{[\s\S]*?Address: \$\{req.correspondenceAddress\}`\);[\s\S]*?\};'
$newViewReq = @'
        window.viewRequest = (id) => {
            const req = allRequests.find(r => r.id === id);
            
            const htmlContent = `
                <div style="text-align: left; font-size: 14px; line-height: 1.6; padding: 10px;">
                    <h4 style="color: #2d72d2; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 15px;"><i class="fas fa-user"></i> Student Information</h4>
                    <p style="margin-bottom: 5px;"><strong>Name:</strong> ${req.fullName || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Index No:</strong> ${req.indexNumber || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Course/Sem:</strong> ${req.course || 'N/A'} (Sem ${req.semester || 'N/A'})</p>
                    <p style="margin-bottom: 5px;"><strong>Unit:</strong> ${req.unitNo || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Contact:</strong> <a href="tel:${req.contactNo}" style="color: #2d72d2;">${req.contactNo || 'N/A'}</a></p>
                    
                    <h4 style="color: #2d72d2; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px; margin-top: 25px; margin-bottom: 15px;"><i class="fas fa-box-open"></i> Move-Out Details</h4>
                    <p style="margin-bottom: 5px;"><strong>Reason:</strong> ${req.reason || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Move-Out Date:</strong> ${req.moveOutDate || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Inspection Time:</strong> ${req.inspectionTime || 'Not specified'}</p>
                    <p style="margin-bottom: 5px;"><strong>Forwarding Address:</strong> ${req.correspondenceAddress || 'N/A'}</p>
                </div>
            `;

            Swal.fire({
                title: 'Move-Out Details',
                html: htmlContent,
                width: '500px',
                confirmButtonText: 'Close',
                confirmButtonColor: '#2d72d2',
                showClass: { popup: 'animate__animated animate__fadeInUp animate__faster' },
                hideClass: { popup: 'animate__animated animate__fadeOutDown animate__faster' }
            });
        };
'@

$oldUpdateReq = '        window.updateRequestStatus = async \(id, status\) => \{[\s\S]*?catch \(error\) \{[\s\S]*?alert\("Error updating request: " \+ error\.message\);[\s\S]*?\}[\s\S]*?\}[\s\S]*?\};'
$newUpdateReq = @'
        window.updateRequestStatus = async (id, status) => {
            const confirmColor = '#2d72d2';
            
            const result = await Swal.fire({
                title: 'Confirm Action',
                text: `Are you sure you want to mark this request as ${status}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: confirmColor,
                cancelButtonColor: '#9e9e9e',
                confirmButtonText: `Yes, Mark as ${status}`,
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                try {
                    await updateDoc(doc(db, "moveout_requests", id), {
                        status: status,
                        updatedAt: new Date()
                    });
                    Swal.fire({
                        title: 'Success!',
                        text: `Request marked as ${status} successfully.`,
                        icon: 'success',
                        confirmButtonColor: '#2d72d2'
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: "Error updating request: " + error.message,
                        icon: 'error',
                        confirmButtonColor: '#2d72d2'
                    });
                }
            }
        };
'@

$content = $content -replace $oldViewReq, $newViewReq
$content = $content -replace $oldUpdateReq, $newUpdateReq

Set-Content "c:\Users\Al Hafiz\public\warden-moveout.html" $content
Write-Host "Updated moveout!"
