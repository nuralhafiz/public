import re

# 1. Update css/global.css
with open('css/global.css', 'r', encoding='utf-8') as f:
    css = f.read()

neo_tabs_css = """
/* Neo-Brutalism Tabs UI */
.neo-tabs-container {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 15px;
}

.neo-tab-btn {
    background: none;
    border: 2px solid transparent;
    font-family: 'Poppins', sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 8px;
    transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
    white-space: nowrap;
}

.neo-tab-btn:hover:not(.active) {
    color: #2d72d2;
    background: rgba(45, 114, 210, 0.05);
}

.neo-tab-btn.active {
    background: #e3f2fd;
    color: #2d72d2;
    border: 2px solid #0f1638;
    box-shadow: 3px 3px 0px #2d72d2;
    font-weight: 600;
    transform: translateY(-2px);
}
"""

if "neo-tabs-container" not in css:
    with open('css/global.css', 'a', encoding='utf-8') as f:
        f.write(neo_tabs_css)

# 2. Update warden-students.html
with open('warden-students.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('class="tabs-container"', 'class="neo-tabs-container"')
content = content.replace('class="tab-btn active"', 'class="neo-tab-btn active"')
content = content.replace('class="tab-btn"', 'class="neo-tab-btn"')

with open('warden-students.html', 'w', encoding='utf-8') as f:
    f.write(content)


# 3. Update warden-moveout.html
with open('warden-moveout.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('class="tabs-container"', 'class="neo-tabs-container"')
content = content.replace('class="tab-btn active"', 'class="neo-tab-btn active"')
content = content.replace('class="tab-btn"', 'class="neo-tab-btn"')
# Replace document.querySelectorAll('.tab-btn') in JS
content = content.replace("querySelectorAll('.tab-btn')", "querySelectorAll('.neo-tab-btn')")

with open('warden-moveout.html', 'w', encoding='utf-8') as f:
    f.write(content)


# 4. Update warden-rooms.html
with open('warden-rooms.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('class="block-tabs"', 'class="neo-tabs-container"')
content = content.replace('class="block-tab active"', 'class="neo-tab-btn active"')
content = content.replace('class="block-tab"', 'class="neo-tab-btn"')
# Replace document.querySelectorAll('.block-tab') in JS
content = content.replace("querySelectorAll('.block-tab')", "querySelectorAll('.neo-tab-btn')")

with open('warden-rooms.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated tabs successfully.")
