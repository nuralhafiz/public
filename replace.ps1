$studentFiles = @("student-dashboard.html", "room-apply.html", "maintenance.html", "move-out.html", "student-profile.html")
foreach ($file in $studentFiles) {
    (Get-Content $file -Raw) -replace "onclick=`"window.location.href='index.html'`"", "onclick=`"window.location.href='student-dashboard.html'`"" | Set-Content $file
}

$wardenFiles = @("warden-dashboard.html", "warden-applications.html", "warden-maintenance.html", "warden-moveout.html", "warden-profile.html", "warden-reports.html", "warden-students.html", "warden-rooms.html")
foreach ($file in $wardenFiles) {
    (Get-Content $file -Raw) -replace "onclick=`"window.location.href='index.html'`"", "onclick=`"window.location.href='warden-dashboard.html'`"" | Set-Content $file
}
