const fs = require('fs');

if (fs.existsSync('student-profile.html')) {
    let content = fs.readFileSync('student-profile.html', 'utf8');

    // Remove the HTML blocks
    content = content.replace(/<div class="detail-item">\s*<i class="fas fa-id-card"><\/i>[\s\S]*?<\/div>/g, '');
    content = content.replace(/<div class="detail-item">\s*<i class="fas fa-phone"><\/i>[\s\S]*?<\/div>/g, '');
    content = content.replace(/<div class="detail-item">\s*<i class="fas fa-map-marker-alt"><\/i>[\s\S]*?<\/div>/g, '');
    content = content.replace(/<div class="detail-item">\s*<i class="fas fa-calendar-alt"><\/i>[\s\S]*?<\/div>/g, '');

    // Remove JS logic
    content = content.replace(/\/\/ Format join date[\s\S]*?\}\);/g, '');
    content = content.replace(/document\.getElementById\('joinDate'\)\.textContent = formattedDate;/g, '');
    content = content.replace(/\/\/ Generate a simple student ID[\s\S]*?document\.getElementById\('studentId'\)\.textContent = studentId;/g, '');
    content = content.replace(/\/\/ You can load additional profile data[\s\S]*?document\.getElementById\('roomNumber'\)\.textContent = "A-3-12";/g, '');

    fs.writeFileSync('student-profile.html', content);
    console.log("Mock data removed from student profile!");
}
