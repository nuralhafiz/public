const fs = require('fs');

if (fs.existsSync('room-apply.html')) {
    let content = fs.readFileSync('room-apply.html', 'utf8');

    // 1. Extract the Floor Plan HTML
    const startStr = '<div class="floor-plan-section">';
    const endStr = '\\n\\n                <div class="form-group">';
    
    // We need to find the exact chunk
    const startIndex = content.indexOf(startStr);
    const endIndex = content.indexOf(endStr, startIndex);
    
    if (startIndex !== -1 && endIndex !== -1) {
        // The block we want to extract is from startIndex to endIndex
        const floorPlanBlock = content.substring(startIndex, endIndex);
        
        // Remove it from its current position
        content = content.substring(0, startIndex) + content.substring(endIndex + '\\n\\n                '.length);
        
        // 2. Modify Section B to Section C
        content = content.replace('<!-- Section B: Declaration -->', '<!-- Section C: Declaration -->');
        content = content.replace('<span class="section-letter">B</span>\\n                            <i class="fas fa-file-signature"></i>\\n                            Section B: Declaration', '<span class="section-letter">C</span>\\n                            <i class="fas fa-file-signature"></i>\\n                            Section C: Declaration');
        
        // 3. Create new Section B
        const newSectionB = `<!-- Section B: Choose Partition -->
                        <div class="section-title">
                            <span class="section-letter">B</span>
                            <i class="fas fa-bed"></i>
                            Section B: Choose Partition
                        </div>

                        ${floorPlanBlock}
                        
                        `;
        
        // Insert it right before Section C
        content = content.replace('<!-- Section C: Declaration -->', newSectionB + '<!-- Section C: Declaration -->');
        
        fs.writeFileSync('room-apply.html', content);
        console.log("Layout fixed: Floor plan moved to Section B. Declaration moved to Section C.");
    } else {
        console.log("Could not find the exact strings to extract.");
    }
}
