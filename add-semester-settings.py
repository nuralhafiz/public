import re

with open('warden-settings.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update UI form
old_form = """                    <form id="settingsForm">
                        <div class="form-group">
                            <label>Start Date</label>
                            <input type="date" id="startDate" required>
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 30px;">
                            <label>End Date</label>
                            <input type="date" id="endDate" required>
                        </div>
                        
                        <button type="submit" id="saveBtn" class="save-settings-btn">
                            <i class="fas fa-save"></i> Save Settings
                        </button>
                    </form>"""

new_form = """                    <form id="settingsForm">
                        <div class="semester-grid">
                            <div class="semester-card">
                                <h3>Semester 1</h3>
                                <div class="form-group">
                                    <label>Start Date</label>
                                    <input type="date" id="sem1_start">
                                </div>
                                <div class="form-group">
                                    <label>End Date</label>
                                    <input type="date" id="sem1_end">
                                </div>
                            </div>
                            <div class="semester-card">
                                <h3>Semester 2</h3>
                                <div class="form-group">
                                    <label>Start Date</label>
                                    <input type="date" id="sem2_start">
                                </div>
                                <div class="form-group">
                                    <label>End Date</label>
                                    <input type="date" id="sem2_end">
                                </div>
                            </div>
                            <div class="semester-card">
                                <h3>Semester 3</h3>
                                <div class="form-group">
                                    <label>Start Date</label>
                                    <input type="date" id="sem3_start">
                                </div>
                                <div class="form-group">
                                    <label>End Date</label>
                                    <input type="date" id="sem3_end">
                                </div>
                            </div>
                            <div class="semester-card">
                                <h3>Semester 4</h3>
                                <div class="form-group">
                                    <label>Start Date</label>
                                    <input type="date" id="sem4_start">
                                </div>
                                <div class="form-group">
                                    <label>End Date</label>
                                    <input type="date" id="sem4_end">
                                </div>
                            </div>
                            <div class="semester-card">
                                <h3>Semester 5</h3>
                                <div class="form-group">
                                    <label>Start Date</label>
                                    <input type="date" id="sem5_start">
                                </div>
                                <div class="form-group">
                                    <label>End Date</label>
                                    <input type="date" id="sem5_end">
                                </div>
                            </div>
                            <div class="semester-card">
                                <h3>Semester 6</h3>
                                <div class="form-group">
                                    <label>Start Date</label>
                                    <input type="date" id="sem6_start">
                                </div>
                                <div class="form-group">
                                    <label>End Date</label>
                                    <input type="date" id="sem6_end">
                                </div>
                            </div>
                        </div>
                        
                        <button type="submit" id="saveBtn" class="save-settings-btn" style="margin-top: 20px;">
                            <i class="fas fa-save"></i> Save Settings
                        </button>
                    </form>"""

content = content.replace(old_form, new_form)

# 2. Update CSS
css_addition = """
        .semester-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .semester-card {
            background: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.02);
            transition: all 0.3s ease;
        }
        .semester-card:hover {
            box-shadow: 0 8px 15px rgba(0,0,0,0.05);
            border-color: #2d72d2;
        }
        .semester-card h3 {
            margin-top: 0;
            color: #1e3a8a;
            font-size: 16px;
            margin-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
            display: flex;
            align-items: center;
        }
        .semester-card h3::before {
            content: '\\f19d';
            font-family: 'Font Awesome 5 Free';
            font-weight: 900;
            margin-right: 8px;
            color: #2d72d2;
        }
        .semester-card .form-group {
            margin-bottom: 15px;
        }
        .semester-card .form-group:last-child {
            margin-bottom: 0;
        }
"""
content = content.replace('</style>', css_addition + '\n    </style>', 1)

# 3. Update getDoc
old_getdoc = """                // Fetch settings data
                const settingsDocRef = doc(db, "settings", "application_period");
                getDoc(settingsDocRef).then(docSnap => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.startDate) document.getElementById('startDate').value = data.startDate;
                        if (data.endDate) document.getElementById('endDate').value = data.endDate;
                    }
                }).catch(err => console.error("Error fetching settings:", err));"""

new_getdoc = """                // Fetch settings data
                const settingsDocRef = doc(db, "settings", "application_period");
                getDoc(settingsDocRef).then(docSnap => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        for(let i=1; i<=6; i++) {
                            if (data[`sem${i}_start`]) document.getElementById(`sem${i}_start`).value = data[`sem${i}_start`];
                            if (data[`sem${i}_end`]) document.getElementById(`sem${i}_end`).value = data[`sem${i}_end`];
                        }
                    }
                }).catch(err => console.error("Error fetching settings:", err));"""

content = content.replace(old_getdoc, new_getdoc)

# 4. Update setDoc
old_setdoc = """            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;

            try {
                const settingsDocRef = doc(db, "settings", "application_period");
                await setDoc(settingsDocRef, {
                    startDate: startDate,
                    endDate: endDate
                }, { merge: true });"""

new_setdoc = """            const updateData = {};
            for(let i=1; i<=6; i++) {
                updateData[`sem${i}_start`] = document.getElementById(`sem${i}_start`).value || "";
                updateData[`sem${i}_end`] = document.getElementById(`sem${i}_end`).value || "";
            }

            try {
                const settingsDocRef = doc(db, "settings", "application_period");
                await setDoc(settingsDocRef, updateData, { merge: true });"""

content = content.replace(old_setdoc, new_setdoc)

with open('warden-settings.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done updating warden-settings.html")
