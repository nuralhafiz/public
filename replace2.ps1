$content = Get-Content "room-apply.html" -Raw

$content = $content -replace 'userId: user.uid,\s*userEmail: user.email,', "userId: user.uid,`r`n                    userEmail: user.email,`r`n                    referenceNumber: document.getElementById('referenceNumber').value,"

$content = $content -replace '<p><b>Application ID:</b> \$\{docRef.id\}</p>', "<p><b>Ref No:</b> `${formData.referenceNumber}</p>"

Set-Content "room-apply.html" $content
