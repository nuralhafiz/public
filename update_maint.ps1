$content = Get-Content "c:\Users\Al Hafiz\public\warden-maintenance.html" -Raw

$swalTag = '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>'
if (-not ($content -match 'sweetalert2')) {
    $content = $content -replace '</head>', "$swalTag`n</head>"
}

$oldViewReq = '        window.viewRequest = \(id\) => \{[\s\S]*?Submitted: \$\{req.submittedAt\?\.toDate\(\)\.toLocaleString\(\) \|\| ''N/A''\}`\);[\s\S]*?\};'
$newViewReq = @'
        window.viewRequest = (id) => {
            const req = allRequests.find(r => r.id === id);
            
            const htmlContent = `
                <div style="text-align: left; font-size: 14px; line-height: 1.6; padding: 10px;">
                    <h4 style="color: #2d72d2; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 15px;"><i class="fas fa-tools"></i> Issue Information</h4>
                    <p style="margin-bottom: 5px;"><strong>Category:</strong> ${req.category || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Description:</strong> ${req.description || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Room:</strong> ${req.room || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Priority:</strong> <span style="text-transform: uppercase; font-weight: bold; color: ${req.priority === 'high' ? '#f44336' : req.priority === 'medium' ? '#ff9800' : '#4caf50'};">${req.priority || 'N/A'}</span></p>
                    <p style="margin-bottom: 5px;"><strong>Status:</strong> <span style="text-transform: uppercase;">${(req.status || 'pending').replace('-', ' ')}</span></p>
                    
                    <h4 style="color: #2d72d2; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px; margin-top: 25px; margin-bottom: 15px;"><i class="fas fa-clock"></i> Timeline & Reporter</h4>
                    <p style="margin-bottom: 5px;"><strong>Reported by:</strong> <a href="mailto:${req.userEmail}" style="color: #2d72d2;">${req.userEmail || 'N/A'}</a></p>
                    <p style="margin-bottom: 5px;"><strong>Preferred Time:</strong> ${req.preferredTime ? new Date(req.preferredTime).toLocaleString() : 'Not specified'}</p>
                    <p style="margin-bottom: 5px;"><strong>Submitted:</strong> ${req.submittedAt?.toDate().toLocaleString() || 'N/A'}</p>
                </div>
            `;

            Swal.fire({
                title: 'Maintenance Details',
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
                    await updateDoc(doc(db, "maintenance_requests", id), {
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

Set-Content "c:\Users\Al Hafiz\public\warden-maintenance.html" $content
Write-Host "Updated maintenance!"
