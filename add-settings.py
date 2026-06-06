import os
import re

html_files = [
    'warden-dashboard.html',
    'warden-applications.html',
    'warden-moveout.html',
    'warden-maintenance.html',
    'warden-students.html',
    'warden-rooms.html',
    'warden-reports.html',
    'warden-profile.html'
]

# 1. Update sidebars
nav_link = '                <a href="warden-settings.html" class="nav-item" title="Navigation Link"><i class="fas fa-cog"></i> Settings</a>\n'

for filename in html_files:
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Don't add if already exists
        if 'href="warden-settings.html"' not in content:
            # Insert before logout button
            logout_line = '        <!-- Logout Button at Bottom -->'
            if logout_line in content:
                content = content.replace(logout_line, nav_link + logout_line)
            else:
                # Try fallback
                logout_fallback = '<a href="#" class="nav-item logout-btn" id="logoutBtn" aria-label="Logout">'
                content = content.replace(logout_fallback, nav_link + "        " + logout_fallback)
                
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)

# 2. Create warden-settings.html from warden-profile.html
if os.path.exists('warden-profile.html'):
    with open('warden-profile.html', 'r', encoding='utf-8') as f:
        settings_content = f.read()
    
    # Ensure it has the settings link too and is active
    settings_content = settings_content.replace('href="warden-settings.html" class="nav-item"', 'href="warden-settings.html" class="nav-item active"')
    # Remove active from profile
    settings_content = settings_content.replace('href="warden-profile.html" class="nav-item active"', 'href="warden-profile.html" class="nav-item"')
    
    # Change Title
    settings_content = settings_content.replace('<title>GMI HostelKu - Warden Profile</title>', '<title>GMI HostelKu - System Settings</title>')
    
    # Replace main content
    main_pattern = re.compile(r'<main id="mainContent">.*?</main>', re.DOTALL)
    
    new_main = """<main id="mainContent">
            <div class="content-header" style="padding: 20px 30px;">
                <h1 style="color: #0f1638; font-size: 28px; font-weight: 700; margin: 0;">System Settings</h1>
                <p style="color: #64748b; margin: 5px 0 0;">Manage global configurations and preferences</p>
            </div>

            <div style="padding: 0 30px 30px;">
                <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); padding: 35px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); max-width: 600px;">
                    <h2 style="color: #0f1638; font-size: 22px; margin-bottom: 25px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-calendar-alt" style="color: #2d72d2;"></i> Room Application Period
                    </h2>
                    
                    <form id="settingsForm">
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; font-weight: 600; color: #0f1638; margin-bottom: 8px;">Start Date</label>
                            <input type="date" id="startDate" style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 10px; font-family: 'Poppins', sans-serif;" required>
                        </div>
                        
                        <div style="margin-bottom: 30px;">
                            <label style="display: block; font-weight: 600; color: #0f1638; margin-bottom: 8px;">End Date</label>
                            <input type="date" id="endDate" style="width: 100%; padding: 12px 15px; border: 2px solid #e2e8f0; border-radius: 10px; font-family: 'Poppins', sans-serif;" required>
                        </div>
                        
                        <button type="submit" id="saveBtn" style="background: linear-gradient(135deg, #1e3a8a 0%, #2d72d2 100%); color: white; border: none; padding: 14px 25px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; width: 100%; justify-content: center;">
                            <i class="fas fa-save"></i> Save Settings
                        </button>
                    </form>
                </div>
            </div>
        </main>"""
        
    settings_content = main_pattern.sub(new_main, settings_content)
    
    # Replace JS script for profile with settings script
    script_pattern = re.compile(r"// Fetch profile data.*?(?=// Logout button functionality)", re.DOTALL)
    
    new_script = """// Fetch settings data
        const settingsDocRef = doc(db, "settings", "application_period");
        getDoc(settingsDocRef).then(docSnap => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.startDate) document.getElementById('startDate').value = data.startDate;
                if (data.endDate) document.getElementById('endDate').value = data.endDate;
            }
        }).catch(err => console.error("Error fetching settings:", err));

        // Handle settings save
        document.getElementById('settingsForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('saveBtn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            btn.disabled = true;

            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;

            try {
                await setDoc(settingsDocRef, {
                    startDate: startDate,
                    endDate: endDate
                }, { merge: true });

                Swal.fire({
                    icon: 'success',
                    title: 'Saved!',
                    text: 'Application period settings have been updated.',
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#ffffff',
                    customClass: {
                        popup: 'animated-popup',
                        title: 'swal2-title'
                    }
                });
            } catch (error) {
                console.error("Error saving settings: ", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to save settings. Please try again.',
                    confirmButtonColor: '#1e3a8a'
                });
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
        
        """
        
    settings_content = script_pattern.sub(new_script, settings_content)
    
    with open('warden-settings.html', 'w', encoding='utf-8') as f:
        f.write(settings_content)

print("Done generating warden-settings.html and updating sidebars.")
