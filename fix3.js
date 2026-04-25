const fs = require('fs');
let content = fs.readFileSync('c:\\Users\\Al Hafiz\\public\\warden-dashboard.html', 'utf8');

const cssToInsert = `
    /* Modal Styling */
    .profile-modal {
        display: none;
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s;
    }
    .profile-modal.active {
        display: flex;
        opacity: 1;
    }
    .modal-content {
        background: white;
        border-radius: 15px;
        width: 90%;
        max-width: 500px;
        padding: 25px;
        transform: translateY(20px);
        transition: transform 0.3s;
        box-shadow: 0 15px 50px rgba(0,0,0,0.2);
    }
    .profile-modal.active .modal-content {
        transform: translateY(0);
    }
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
    }
    .close-modal {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
    }
    .modal-detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #f5f5f5;
    }
    .modal-detail-label {
        font-weight: 500;
        color: #666;
    }
    .modal-detail-value {
        font-weight: 600;
        color: #0f1638;
    }
    .modal-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
        justify-content: flex-end;
    }
`;

if (!content.includes('.profile-modal {')) {
    content = content.replace('</style>', cssToInsert + '\\n</style>');
    fs.writeFileSync('c:\\Users\\Al Hafiz\\public\\warden-dashboard.html', content);
    console.log('Added CSS');
}
