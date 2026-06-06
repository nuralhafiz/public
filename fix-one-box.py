import re

with open('warden-settings.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the current main content structure
old_content_pattern = r'<main id="mainContent">.*?</main>'

new_main_content = """<main id="mainContent" style="display: flex; justify-content: center; align-items: flex-start; padding: 40px 20px;">
            <div class="settings-card">
                <div class="settings-card-header">
                    <div class="header-icon">
                        <i class="fas fa-cog"></i>
                    </div>
                    <div>
                        <h1 class="header-title">System Settings</h1>
                        <p class="header-subtitle">Manage global configurations and preferences</p>
                    </div>
                </div>

                <div class="settings-divider"></div>

                <div class="settings-section">
                    <h2 class="section-title">
                        <i class="fas fa-calendar-alt"></i> Room Application Period
                    </h2>
                    
                    <form id="settingsForm">
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
                    </form>
                </div>
            </div>
        </main>"""

content = re.sub(old_content_pattern, new_main_content, content, flags=re.DOTALL)

# Add CSS for the new layout
css = """
        .settings-card {
            background: white;
            border-radius: 24px;
            padding: 45px;
            width: 100%;
            max-width: 650px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
            animation: slideUp 0.4s ease;
        }

        .settings-card-header {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 30px;
        }

        .header-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #1e3a8a 0%, #2d72d2 100%);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 26px;
            box-shadow: 0 10px 20px rgba(45, 114, 210, 0.2);
            flex-shrink: 0;
        }

        .header-title {
            color: #0f1638;
            font-size: 26px;
            font-weight: 700;
            margin: 0 0 5px 0;
        }

        .header-subtitle {
            color: #64748b;
            margin: 0;
            font-size: 15px;
        }

        .settings-divider {
            height: 1px;
            background: #e2e8f0;
            margin: 0 0 35px 0;
        }

        .section-title {
            color: #0f1638;
            font-size: 18px;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-title i {
            color: #2d72d2;
        }

        .form-group {
            margin-bottom: 25px;
        }

        .form-group label {
            display: block;
            font-weight: 600;
            color: #0f1638;
            margin-bottom: 8px;
            font-size: 14px;
        }

        .form-group input {
            width: 100%;
            padding: 14px 15px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-family: 'Poppins', sans-serif;
            font-size: 15px;
            transition: all 0.3s;
            box-sizing: border-box;
        }

        .form-group input:focus {
            border-color: #2d72d2;
            outline: none;
            box-shadow: 0 0 0 3px rgba(45, 114, 210, 0.1);
        }

        .save-settings-btn {
            background: linear-gradient(135deg, #1e3a8a 0%, #2d72d2 100%);
            color: white;
            border: none;
            padding: 16px 25px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            box-shadow: 0 10px 20px rgba(45, 114, 210, 0.2);
            margin-top: 10px;
        }

        .save-settings-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px rgba(45, 114, 210, 0.3);
        }
"""
if ".settings-card {" not in content:
    content = content.replace('</head>', f'    <style>{css}</style>\n</head>')

with open('warden-settings.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Settings layout unified into a single card")
