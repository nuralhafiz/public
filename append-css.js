const fs = require('fs');
const css = `

/* Notification Bell Styling */
.notification-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.15);
    text-decoration: none !important;
    transition: all 0.3s ease;
    margin-right: 15px;
}

.notification-container:hover {
    background-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
}

.notification-bell {
    font-size: 1.25rem;
    color: #ffffff !important;
    transition: transform 0.3s ease;
}

.notification-container:hover .notification-bell {
    transform: rotate(15deg);
}

.notification-badge {
    position: absolute;
    top: -2px;
    right: -4px;
    background-color: #f93144;
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #1118a8;
    padding: 0 4px;
    box-sizing: border-box;
}

.notification-badge.hidden {
    display: none;
}
`;

fs.appendFileSync('css/global.css', css);
console.log('CSS Appended Successfully');
