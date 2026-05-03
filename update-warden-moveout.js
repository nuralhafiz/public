const fs = require('fs');

const filePath = 'c:/Users/Al Hafiz/public/warden-moveout.html';
let content = fs.readFileSync(filePath, 'utf8');

const originalHtmlContent = `                    <h4 style="color: #2d72d2; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px; margin-top: 25px; margin-bottom: 15px;"><i class="fas fa-box-open"></i> Move-Out Details</h4>
                    <p style="margin-bottom: 5px;"><strong>Reason:</strong> \${req.reason || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Move-Out Date:</strong> \${req.moveOutDate || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Inspection Time:</strong> \${req.inspectionTime || 'Not specified'}</p>
                    <p style="margin-bottom: 5px;"><strong>Forwarding Address:</strong> \${req.correspondenceAddress || 'N/A'}</p>
                </div>`;

const newHtmlContent = `                    <h4 style="color: #2d72d2; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px; margin-top: 25px; margin-bottom: 15px;"><i class="fas fa-box-open"></i> Move-Out Details</h4>
                    <p style="margin-bottom: 5px;"><strong>Reason:</strong> \${req.reason || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Move-Out Date:</strong> \${req.moveOutDate || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Inspection Time:</strong> \${req.inspectionTime || 'Not specified'}</p>
                    <p style="margin-bottom: 5px;"><strong>Forwarding Address:</strong> \${req.correspondenceAddress || 'N/A'}</p>

                    <h4 style="color: #2d72d2; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px; margin-top: 25px; margin-bottom: 15px;"><i class="fas fa-clipboard-list"></i> Hostel Clearance</h4>
                    <p style="margin-bottom: 5px;"><strong>IC No:</strong> \${req.icNo || 'N/A'}</p>
                    <p style="margin-bottom: 5px;"><strong>Date Joined:</strong> \${req.dateJoined || 'N/A'} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Date Completed:</strong> \${req.dateCompleted || 'N/A'}</p>
                    <p style="margin-bottom: 15px;"><strong>Status:</strong> \${req.studentStatus || 'N/A'}</p>
                    
                    \${req.checklist ? \`
                    <div style="background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 10px; font-size: 13px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #ddd;">Item</th>
                                    <th style="text-align: center; padding: 5px; border-bottom: 1px solid #ddd;">Status</th>
                                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #ddd;">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                \${Object.entries(req.checklist).map(([key, value]) => {
                                    const friendlyKey = key.replace(/([A-Z])/g, ' $1').trim();
                                    const statusColor = value.condition === 'Good' ? '#4caf50' : (value.condition === 'Faulty' ? '#f44336' : '#999');
                                    return \`
                                    <tr>
                                        <td style="padding: 5px; border-bottom: 1px solid #eee;">\${friendlyKey}</td>
                                        <td style="padding: 5px; text-align: center; border-bottom: 1px solid #eee; color: \${statusColor}; font-weight: bold;">\${value.condition || '-'}</td>
                                        <td style="padding: 5px; border-bottom: 1px solid #eee; color: #666;">\${value.remarks || '-'}</td>
                                    </tr>\`;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>\` : '<p style="color: #999; font-style: italic;">No checklist data available.</p>'}
                </div>`;

content = content.replace(originalHtmlContent, newHtmlContent);

// Also increase modal width to fit the table better
content = content.replace("width: '500px',", "width: '600px',");

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated warden-moveout.html");
