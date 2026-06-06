import re

with open('student-profile.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Display Gender in Profile Card
display_gender = """                    <div class="detail-item">
                        <i class="fas fa-venus-mars"></i>
                        <span class="detail-label">Gender</span>
                        <span class="detail-value" id="profileGender">-</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-graduation-cap"></i>
                        <span class="detail-label">Semester</span>"""

content = content.replace("""                    <div class="detail-item">
                        <i class="fas fa-graduation-cap"></i>
                        <span class="detail-label">Semester</span>""", display_gender)


# Add Gender dropdown to Edit Profile Modal
modal_gender = """                <div class="form-group">
                    <label>Jantina (Gender)</label>
                    <select id="editGender" required>
                        <option value="" disabled selected>Pilih Jantina</option>
                        <option value="Lelaki">Lelaki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Current Semester</label>"""

content = content.replace("""                <div class="form-group">
                    <label>Current Semester</label>""", modal_gender)

# JS Updates
# Fill modal
fill_modal_old = """            document.getElementById('editSemester').value = semNum && semNum !== '-' ? semNum : '';"""
fill_modal_new = """            document.getElementById('editSemester').value = semNum && semNum !== '-' ? semNum : '';
            const currentGender = document.getElementById('profileGender').textContent;
            document.getElementById('editGender').value = currentGender !== '-' ? currentGender : '';"""
content = content.replace(fill_modal_old, fill_modal_new)

# Save changes
save_old = """            const newSemester = document.getElementById('editSemester').value;"""
save_new = """            const newSemester = document.getElementById('editSemester').value;
            const newGender = document.getElementById('editGender').value;"""
content = content.replace(save_old, save_new)

db_save_old = """                    semester: newSemester,"""
db_save_new = """                    semester: newSemester,
                    gender: newGender,"""
content = content.replace(db_save_old, db_save_new)

ui_update_old = """                document.getElementById('profileSemester').textContent = "Semester " + newSemester;"""
ui_update_new = """                document.getElementById('profileSemester').textContent = "Semester " + newSemester;
                document.getElementById('profileGender').textContent = newGender;"""
content = content.replace(ui_update_old, ui_update_new)

# Initial Load
load_old = """                    if(data.semester) document.getElementById('profileSemester').textContent = "Semester " + data.semester;"""
load_new = """                    if(data.semester) document.getElementById('profileSemester').textContent = "Semester " + data.semester;
                    if(data.gender) document.getElementById('profileGender').textContent = data.gender;"""
content = content.replace(load_old, load_new)

with open('student-profile.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done updating student-profile.html")
