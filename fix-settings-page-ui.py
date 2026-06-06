import re

with open('warden-settings.html', 'r', encoding='utf-8') as f:
    content = f.read()

css = """
    <style>
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }

        .page-header h2 {
            font-size: 24px;
            color: #0f1638;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .page-header h2 i {
            color: #2d72d2;
            background: white;
            padding: 12px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
    </style>
"""

# Insert CSS before </head>
if ".page-header h2 {" not in content:
    content = content.replace('</head>', f'{css}\n</head>')

# Replace the header block
old_header_pattern = r'<div class="content-header" style="padding: 20px 30px;">.*?</div>'
new_header = """<div class="page-header" style="padding: 0 30px; display: block;">
                <h2>
                    <i class="fas fa-cog"></i>
                    System Settings
                </h2>
                <p style="color: #64748b; margin: 10px 0 0 60px;">Manage global configurations and preferences</p>
            </div>"""
content = re.sub(old_header_pattern, new_header, content, flags=re.DOTALL)

# Center the card
content = content.replace('box-shadow: 0 10px 30px rgba(0,0,0,0.05); max-width: 600px;">', 'box-shadow: 0 10px 30px rgba(0,0,0,0.05); max-width: 800px; margin: 0 auto;">')

with open('warden-settings.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("UI Updated")
