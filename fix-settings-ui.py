import glob
import re

files = glob.glob('warden-*.html')

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # We want to match:
    #             </div>
    #
    #         <!-- Logout Button -->
    #                         <a href="warden-settings.html" class="nav-item" title="Navigation Link"><i class="fas fa-cog"></i> Settings</a>
    # Or 'class="nav-item active"'

    # 1. First, remove the wrongly placed Settings link completely
    content = re.sub(r'[\s]*<a href="warden-settings\.html"[^>]*><i class="fas fa-cog"></i> Settings</a>', '', content)
    
    # 2. Re-insert it right before </div>\n\n        <!-- Logout Button -->
    settings_link = '                <a href="warden-settings.html" class="nav-item" title="Navigation Link">\n                    <i class="fas fa-cog"></i> Settings</a>\n'
    if f == 'warden-settings.html':
        settings_link = '                <a href="warden-settings.html" class="nav-item active" title="Navigation Link">\n                    <i class="fas fa-cog"></i> Settings</a>\n'
    
    # Find the closing div of nav-menu which precedes <!-- Logout Button -->
    # The pattern is:
    #             </div>
    #
    #         <!-- Logout Button -->
    # OR
    #             </div>
    #         <!-- Logout Button -->
    
    content = re.sub(r'(            </div>[\s]*<!-- Logout Button)', settings_link + r'\1', content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Done fixing Settings button placement.")
