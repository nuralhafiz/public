import glob
import re

files = glob.glob('warden-*.html')

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Remove ALL settings links including those spanning multiple lines
    pattern = re.compile(r'[\s]*<a href="warden-settings\.html"[^>]*>[\s]*<i class="fas fa-cog"></i> Settings</a>', re.DOTALL)
    content = pattern.sub('', content)
    
    # Insert EXACTLY one correct settings link
    settings_link = '\n                <a href="warden-settings.html" class="nav-item" title="Navigation Link"><i class="fas fa-cog"></i> Settings</a>\n            '
    if f == 'warden-settings.html':
        settings_link = '\n                <a href="warden-settings.html" class="nav-item active" title="Navigation Link"><i class="fas fa-cog"></i> Settings</a>\n            '
    
    pattern_insert = re.compile(r'(</div>\s*(?:<!-- Logout Button -->\s*)?<a href="#" class="nav-item logout-btn" id="logoutBtn")', re.DOTALL)
    content = pattern_insert.sub(settings_link + r'\1', content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Done removing duplicates.")
