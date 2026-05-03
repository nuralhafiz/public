const fs = require('fs');

const filePath = 'c:/Users/Al Hafiz/public/move-out.html';
let content = fs.readFileSync(filePath, 'utf8');

// The items array
const items = [
    "Single Bed c/w Mattress",
    "Wardrobe s/w Accessories",
    "Study Table",
    "Study Chair",
    "Curtain Rail",
    "Main Entrance Door",
    "Toilet Main Entrance Door",
    "Toilet Door",
    "Shower Door",
    "Cleanliness (Overall)"
];

// 0. Inject SweetAlert2
if (!content.includes('sweetalert2')) {
    content = content.replace('</head>', '    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>\n</head>');
}

// Generate checklist HTML
let checklistRows = items.map((item, index) => {
    let id = item.replace(/[^a-zA-Z0-9]/g, '');
    return `
                                            <tr>
                                                <td style="padding: 12px; border-bottom: 1px solid #eee;">${item}</td>
                                                <td style="padding: 12px; text-align: center; border-bottom: 1px solid #eee;">
                                                    <input type="radio" name="item_${id}" value="Good" required style="width: 18px; height: 18px; margin: 0; padding: 0;">
                                                </td>
                                                <td style="padding: 12px; text-align: center; border-bottom: 1px solid #eee;">
                                                    <input type="radio" name="item_${id}" value="Faulty" style="width: 18px; height: 18px; margin: 0; padding: 0;">
                                                </td>
                                                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                                                    <input type="text" id="remark_${id}" placeholder="Remarks (optional)" style="padding: 8px 12px; margin: 0; min-width: 150px; border: 1px solid #e0e0e0; border-radius: 6px;">
                                                </td>
                                            </tr>`;
}).join("");

// 1. Wrap Section A and B in #step1
const sectionAMarker = '<!-- Section A: Personal Data -->';
content = content.replace(sectionAMarker, '<div id="step1">\n                        ' + sectionAMarker);

// 2. Before Section C, close step1 and open step2
const sectionCMarker = '<!-- Section C: Declaration -->';
const newStepSeparator = `
                            <button type="button" class="btn-submit" id="nextBtn" style="margin-top: 30px;">
                                <span>Next</span> <i class="fas fa-arrow-right" style="margin-left: 8px; margin-right: 0;"></i>
                            </button>
                        </div>

                        <!-- STEP 2: Clearance Form -->
                        <div id="step2" style="display: none;">
                            <div class="section-title">
                                <i class="fas fa-clipboard-list"></i>
                                Section C: Hostel Clearance Form
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="required">IC No / Passport No</label>
                                    <input type="text" id="icNo" required>
                                </div>
                                <div class="form-group">
                                    <label class="required">Date Joined</label>
                                    <input type="date" id="dateJoined" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="required">Date Completed Study</label>
                                    <input type="date" id="dateCompleted" required>
                                </div>
                                <div class="form-group">
                                    <label class="required">Status</label>
                                    <select id="studentStatus" required>
                                        <option value="" disabled selected>Select Status</option>
                                        <option value="Graduated">Graduated</option>
                                        <option value="Dismissed">Dismissed</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group" style="margin-top: 20px;">
                                <label class="required"><i class="fas fa-list-check"></i> Household Item Checklist</label>
                                <div class="table-container" style="border-radius: 12px; border: 1px solid #e0e0e0; overflow-x: auto; background: white;">
                                    <table style="width: 100%; border-collapse: collapse; min-width: 500px;">
                                        <thead style="background: #f8f9fa;">
                                            <tr>
                                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e0e0e0; color: #0f1638;">Items</th>
                                                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e0e0e0; width: 80px; color: #4caf50;">Good</th>
                                                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e0e0e0; width: 80px; color: #f44336;">Faulty</th>
                                                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e0e0e0; color: #0f1638;">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
${checklistRows}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="section-title" style="margin-top: 40px;">
                                <i class="fas fa-file-signature"></i>
                                Section D: Declaration
                            </div>`;

// Apply separator
content = content.replace(sectionCMarker, newStepSeparator);

// Ensure there is no duplicated "Section C: Declaration" after Section D.
const duplicateTitleRegex = /<div class="section-title">[\s\n]*<i class="fas fa-file-signature"><\/i>[\s\n]*Section C: Declaration[\s\n]*<\/div>/g;
content = content.replace(duplicateTitleRegex, '');

// 3. Close step2 at the end
const submitBtnMarkerRegex = /<button type="submit" class="btn-submit" id="submitBtn">/g;
const replacementSubmit = `                            <div style="display: flex; gap: 15px; margin-top: 30px;">
                                <button type="button" class="btn-submit" id="backBtn" style="background: #9e9e9e; width: 60px; padding: 16px 0; margin: 0; flex-shrink: 0; border-radius: 12px;">
                                    <i class="fas fa-arrow-left" style="margin: 0;"></i>
                                </button>
                                <button type="submit" class="btn-submit" id="submitBtn" style="flex: 1; margin: 0; width: auto; border-radius: 12px;">`;
content = content.replace(submitBtnMarkerRegex, replacementSubmit);

const submitBtnEndMarkerRegex = /<\/button>\s*<\/form>/g;
content = content.replace(submitBtnEndMarkerRegex, '</button>\n                            </div>\n                        </div>\n                    </form>');

// 4. Update the JS part for step transition
const formSubmitMarker = "// Handle form submission with Firestore";
const nextBtnLogic = `
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        const nextBtn = document.getElementById('nextBtn');
        const backBtn = document.getElementById('backBtn');

        // Validation helper for step 1
        function validateStep1() {
            const requiredFields = ['fullName', 'indexNumber', 'course', 'semester', 'correspondenceAddress', 'unitNo', 'contactNo', 'reason', 'moveOutDate'];
            for (let id of requiredFields) {
                if (!document.getElementById(id).value) {
                    Swal.fire({ heightAuto: false, icon: 'warning', title: 'Required Fields', text: 'Please fill in all required fields in Step 1.', confirmButtonColor: '#2d72d2' });
                    document.getElementById(id).focus();
                    return false;
                }
            }
            return true;
        }

        // Handle Next
        if(nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (validateStep1()) {
                    step1.style.display = 'none';
                    step2.style.display = 'block';
                    window.scrollTo(0, 0);
                }
            });
        }

        // Handle Back
        if(backBtn) {
            backBtn.addEventListener('click', () => {
                step2.style.display = 'none';
                step1.style.display = 'block';
                window.scrollTo(0, 0);
            });
        }

        // Checklist Items Array
        const checklistItems = [
            "SingleBedcwMattress", "WardrobeswAccessories", "StudyTable", "StudyChair",
            "CurtainRail", "MainEntranceDoor", "ToiletMainEntranceDoor", "ToiletDoor",
            "ShowerDoor", "CleanlinessOverall"
        ];

        ${formSubmitMarker}`;

content = content.replace(formSubmitMarker, nextBtnLogic);

// 5. Update formData to include new fields
const formDataRegex = /const formData = {[\s\S]*?submittedAt: serverTimestamp\(\)[\s]*};/;
const formDataMatch = content.match(formDataRegex);
if(formDataMatch) {
    let formDataContent = formDataMatch[0];
    
    // add new fields before submittedAt
    let checklistData = `
                    icNo: document.getElementById('icNo').value,
                    dateJoined: document.getElementById('dateJoined').value,
                    dateCompleted: document.getElementById('dateCompleted').value,
                    studentStatus: document.getElementById('studentStatus').value,
                    checklist: {},`;

    let replacePoint = "submittedAt: serverTimestamp()";
    formDataContent = formDataContent.replace(replacePoint, checklistData + "\n                    " + replacePoint);
    
    content = content.replace(formDataMatch[0], formDataContent);
}

// 6. After capturing formData, we need to populate the checklist object
const simpleValidationRegex = /\/\/ Simple validation[\s\S]*?for \(let key in formData\) {/;
const simpleValidationReplacement = `// Populate checklist data
                const checklistData = {};
                for (let id of checklistItems) {
                    const conditionRadio = document.querySelector(\`input[name="item_\${id}"]:checked\`);
                    const remarkInput = document.getElementById(\`remark_\${id}\`).value;
                    checklistData[id] = {
                        condition: conditionRadio ? conditionRadio.value : '',
                        remarks: remarkInput || ''
                    };
                }

                // Simple validation
                formData.checklist = checklistData;

                for (let key in formData) {
                    if (key === 'checklist') continue;`;
content = content.replace(simpleValidationRegex, simpleValidationReplacement);

// 7. SWEETALERTS REPLACEMENTS
content = content.replace(
    /alert\('🛡️ Access Denied: Warden accounts cannot access Student pages\.'\);/g,
    `Swal.fire({ heightAuto: false, icon: 'error', title: 'Access Denied', text: 'Warden accounts cannot access Student pages.', confirmButtonColor: '#2d72d2' });`
);

content = content.replace(
    /alert\("Logout failed: " \+ error\.message\);/g,
    `Swal.fire({ heightAuto: false, icon: 'error', title: 'Logout Failed', text: error.message, confirmButtonColor: '#2d72d2' });`
);

content = content.replace(
    /alert\("Please confirm the declaration to proceed\."\);/g,
    `Swal.fire({ heightAuto: false, icon: 'warning', title: 'Declaration Required', text: 'Please confirm the declaration to proceed.', confirmButtonColor: '#2d72d2' });`
);

content = content.replace(
    /alert\("You must be logged in to submit an application\."\);/g,
    `Swal.fire({ heightAuto: false, icon: 'error', title: 'Authentication Required', text: 'You must be logged in to submit an application.', confirmButtonColor: '#2d72d2' });`
);

content = content.replace(
    /alert\("Please fill in all required fields"\);/g,
    `Swal.fire({ heightAuto: false, icon: 'warning', title: 'Required Fields', text: 'Please fill in all required fields.', confirmButtonColor: '#2d72d2' });`
);

content = content.replace(
    /alert\("Failed to submit application: " \+ error\.message\);/g,
    `Swal.fire({ heightAuto: false, icon: 'error', title: 'Submission Failed', text: error.message, confirmButtonColor: '#2d72d2' });`
);

// 8. Submit success SweetAlert
const successAlertRegex = /alert\("✅ Move-out application submitted successfully![^;]+;/;
const newSuccessAlert = `let successHtml = \`
                    <div style="text-align: left; font-size: 14px; line-height: 1.6;">
                        <p style="margin-bottom: 8px;"><i class="fas fa-file-alt" style="color: #2d72d2; width: 20px;"></i> <strong>Request ID:</strong> \${docRef.id}</p>
                        <p style="margin-bottom: 8px;"><i class="fas fa-user" style="color: #2d72d2; width: 20px;"></i> <strong>Name:</strong> \${formData.fullName}</p>
                        <p style="margin-bottom: 8px;"><i class="fas fa-id-badge" style="color: #2d72d2; width: 20px;"></i> <strong>Index No:</strong> \${formData.indexNumber}</p>
                        <p style="margin-bottom: 8px;"><i class="fas fa-door-open" style="color: #2d72d2; width: 20px;"></i> <strong>Unit:</strong> \${formData.unitNo}</p>
                        <p style="margin-bottom: 8px;"><i class="fas fa-calendar-alt" style="color: #2d72d2; width: 20px;"></i> <strong>Move-Out Date:</strong> \${formattedDate}</p>
                        <p style="margin-bottom: 15px;"><i class="fas fa-clock" style="color: #2d72d2; width: 20px;"></i> <strong>Inspection:</strong> \${formData.inspectionTime || 'Not specified'}</p>
                        <p style="font-size: 13px; color: #666; padding-top: 10px; border-top: 1px solid #eee;">
                            The hostel management will contact you within 3 working days to confirm the inspection.
                        </p>
                    </div>
                \`;
                
                await Swal.fire({ heightAuto: false,
                    icon: 'success',
                    title: 'Move-out application submitted successfully!',
                    html: successHtml,
                    confirmButtonColor: '#2d72d2',
                    confirmButtonText: 'Back to Dashboard',
                    allowOutsideClick: false
                });`;

content = content.replace(successAlertRegex, newSuccessAlert);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully rebuilt move-out.html");
