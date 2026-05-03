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
                                <span>Next: Hostel Clearance Form</span> <i class="fas fa-arrow-right" style="margin-left: 8px; margin-right: 0;"></i>
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

                            <!-- Section D: Declaration (Old Section C) -->
                            <div class="section-title" style="margin-top: 40px;">
                                <i class="fas fa-file-signature"></i>
                                Section D: Declaration
                            </div>`;

content = content.replace(sectionCMarker, newStepSeparator);

// 3. Close step2 at the end
const submitBtnMarker = '<button type="submit" class="btn-submit" id="submitBtn">';
const replacementSubmit = `                            <div style="display: flex; gap: 15px; margin-top: 30px;">
                                <button type="button" class="btn-submit" id="backBtn" style="background: #9e9e9e; width: 60px; padding: 16px 0; margin: 0; flex-shrink: 0; border-radius: 12px;">
                                    <i class="fas fa-arrow-left" style="margin: 0;"></i>
                                </button>
                                <button type="submit" class="btn-submit" id="submitBtn" style="flex: 1; margin: 0; width: auto; border-radius: 12px;">`;
content = content.replace(submitBtnMarker, replacementSubmit);

// 4. Close the step2 div after submitBtn
const submitBtnEndMarker = '</button>\n                    </form>';
content = content.replace(submitBtnEndMarker, '</button>\n                            </div>\n                        </div>\n                    </form>');

// 5. Update the JS part for step transition
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
                    alert("Please fill in all required fields in Step 1.");
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

// Update formData to include new fields
const formDataRegex = /const formData = {[\s\S]*?};/;
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

// After capturing formData, we need to populate the checklist object
const tryBlockStart = "try {";
const tryBlockReplacement = `try {
                // Populate checklist data
                const checklistData = {};
                for (let id of checklistItems) {
                    const conditionRadio = document.querySelector(\`input[name="item_\${id}"]:checked\`);
                    const remarkInput = document.getElementById(\`remark_\${id}\`).value;
                    checklistData[id] = {
                        condition: conditionRadio ? conditionRadio.value : '',
                        remarks: remarkInput || ''
                    };
                }`;
content = content.replace(tryBlockStart, tryBlockReplacement);

// Update simple validation to exclude new required fields from breaking Step 1 submission
const validationStart = `for (let key in formData) {`;
const validationReplacement = `// Assign checklist
                formData.checklist = checklistData;

                for (let key in formData) {
                    if (key === 'checklist') continue;`;
content = content.replace(validationStart, validationReplacement);


fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully updated move-out.html");
