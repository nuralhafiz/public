const fs = require('fs');
let content = fs.readFileSync('c:/Users/Al Hafiz/public/move-out.html', 'utf8');

// Remove duplicate section C declaration
const duplicateSectionC = `                        <div class="section-title">
                            <i class="fas fa-file-signature"></i>
                            Section C: Declaration
                        </div>`;

content = content.replace(duplicateSectionC, '');

// Make sure the div is properly closed before script starts
const brokenDivEnd = `                                <button type="submit" class="btn-submit" id="submitBtn" style="flex: 1; margin: 0; width: auto; border-radius: 12px;">
                            <span>Submit Application</span>
                            <span class="spinner"></span>
                        </button>
                    </form>
                </div>
            </div>`;

const fixedDivEnd = `                                <button type="submit" class="btn-submit" id="submitBtn" style="flex: 1; margin: 0; width: auto; border-radius: 12px;">
                                    <span>Submit Application</span>
                                    <span class="spinner"></span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>`;

content = content.replace(brokenDivEnd, fixedDivEnd);

fs.writeFileSync('c:/Users/Al Hafiz/public/move-out.html', content, 'utf8');
console.log("Fixed move-out.html");
