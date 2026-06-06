import glob
import re

files = glob.glob('warden-*.html')

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 1. Remove any existing Settings link to avoid duplicates
    content = re.sub(r'[\s]*<a href="warden-settings\.html"[^>]*><i class="fas fa-cog"></i> Settings</a>', '', content)
    
    # 2. Re-insert it right inside nav-menu, before the closing </div>
    settings_link = '                <a href="warden-settings.html" class="nav-item" title="Navigation Link"><i class="fas fa-cog"></i> Settings</a>\n            '
    if f == 'warden-settings.html':
        settings_link = '                <a href="warden-settings.html" class="nav-item active" title="Navigation Link"><i class="fas fa-cog"></i> Settings</a>\n            '
    
    # Match the closing </div> of nav-menu that precedes the logout button
    pattern = re.compile(r'(</div>\s*(?:<!-- Logout Button -->\s*)?<a href="#" class="nav-item logout-btn" id="logoutBtn")', re.DOTALL)
    
    content = pattern.sub(settings_link + r'\1', content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Done restoring Settings links.")
