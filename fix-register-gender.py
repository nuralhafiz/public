import re

with open('register.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Gender Dropdown before Current Semester
gender_html = """            <div class="form-group">
                <label>Jantina (Gender)</label>
                <select id="gender" required>
                    <option value="" disabled selected>Pilih Jantina</option>
                    <option value="Lelaki">Lelaki</option>
                    <option value="Perempuan">Perempuan</option>
                </select>
            </div>"""

content = content.replace("""            <div class="form-group">
                <label>Current Semester</label>""", gender_html + """
            <div class="form-group">
                <label>Current Semester</label>""")

# Add to JS
old_js_vars = """            const fullName = document.getElementById('fullName').value;
            const idNumber = document.getElementById('idNumber').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const course = document.getElementById('course').value;
            const semester = document.getElementById('semester').value;"""

new_js_vars = """            const fullName = document.getElementById('fullName').value;
            const idNumber = document.getElementById('idNumber').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const course = document.getElementById('course').value;
            const semester = document.getElementById('semester').value;
            const gender = document.getElementById('gender').value;"""

content = content.replace(old_js_vars, new_js_vars)

old_db_save = """                        idNumber: idNumber,
                        phoneNumber: phoneNumber,
                        course: course,
                        semester: semester,
                        email: email,"""

new_db_save = """                        idNumber: idNumber,
                        phoneNumber: phoneNumber,
                        course: course,
                        semester: semester,
                        gender: gender,
                        email: email,"""

content = content.replace(old_db_save, new_db_save)

with open('register.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done updating register.html")
