const fs = require('fs');
const path = require('path');

const publicDir = './'; // Since script runs in public folder

function updateFiles() {
    fs.readdir(publicDir, (err, files) => {
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
        }

        files.forEach((file, index) => {
            if (path.extname(file) === '.html') {
                const filePath = path.join(publicDir, file);
                let content = fs.readFileSync(filePath, 'utf8');

                // Find the brand-lime block
                const brandLimeStart = content.indexOf('.brand-lime {');
                if (brandLimeStart !== -1) {
                    const brandLimeEnd = content.indexOf('}', brandLimeStart);
                    if (brandLimeEnd !== -1) {
                        let brandLimeBlock = content.substring(brandLimeStart, brandLimeEnd);
                        
                        // Replace #fff with #000 in text-shadow
                        const updatedBlock = brandLimeBlock.replace(/#fff/g, '#000');
                        
                        if (brandLimeBlock !== updatedBlock) {
                            content = content.substring(0, brandLimeStart) + updatedBlock + content.substring(brandLimeEnd);
                            fs.writeFileSync(filePath, content, 'utf8');
                            console.log(`Updated outline for ${file}`);
                        }
                    }
                }
            }
        });
        console.log("Done updating all HTML pages.");
    });
}

updateFiles();
