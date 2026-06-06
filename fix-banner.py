import re

with open('warden-settings.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the old page-header
old_header_pattern = r'<div class="page-header" style="padding: 0 30px; display: block;">.*?</div>'
new_header = """<div class="settings-banner">
                <div class="settings-content">
                    <h1><i class="fas fa-cog"></i> System Settings</h1>
                    <p>Manage global configurations and preferences</p>
                </div>
            </div>"""

content = re.sub(old_header_pattern, new_header, content, flags=re.DOTALL)

# 2. Add CSS for settings-banner
css = """
        .settings-banner {
            background: white;
            border-radius: 20px;
            padding: 35px 40px;
            color: #0f1638;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }
        .settings-banner .settings-content h1 {
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 10px 0;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .settings-banner .settings-content h1 i {
            color: white;
            background: linear-gradient(135deg, #1e3a8a 0%, #2d72d2 100%);
            padding: 12px;
            border-radius: 12px;
            font-size: 20px;
            box-shadow: 0 5px 15px rgba(45, 114, 210, 0.2);
        }
        .settings-banner .settings-content p {
            color: #64748b;
            margin: 0;
            font-size: 15px;
        }
"""
if ".settings-banner {" not in content:
    content = content.replace('</head>', f'    <style>{css}</style>\n</head>')

# 3. Remove double padding and width limit for the card
content = content.replace('<div style="padding: 0 30px 30px;">', '<div>')
content = content.replace(
    'background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); padding: 35px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); max-width: 800px; margin: 0 auto;">',
    'background: white; padding: 35px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); width: 100%;">')

with open('warden-settings.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("UI successfully fixed")
