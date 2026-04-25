$content = Get-Content "c:\Users\Al Hafiz\public\room-apply.html" -Raw

$refBlockRegex = '(?s)<div class="form-row" style="margin-bottom: 5px;">\s*<div class="form-group" style="width: 100%;">\s*<label class="required">\s*<i class="fas fa-hashtag"></i>\s*Reference Number\s*</label>\s*<input type="text" id="referenceNumber" readonly style="background: #f1f5f9; cursor: not-allowed; color: #64748b; font-weight: bold; border-color: #cbd5e1;" required>\s*<small style="display: block; margin-top: 5px; color: #64748b; font-size: 11px;"><i class="fas fa-info-circle"></i> Auto-generated application tracking ID</small>\s*</div>\s*</div>'

$match = [regex]::Match($content, $refBlockRegex)
if ($match.Success) {
    $refBlock = $match.Value
    
    # Remove it from the top
    $content = $content.Replace($refBlock, "")
    
    # Create the modified block
    $newRefBlock = @"
                        <div class="form-row" style="margin-top: 15px;">
                            <div class="form-group" style="max-width: 300px;">
                                <label class="required">
                                    <i class="fas fa-hashtag"></i>
                                    Reference Number
                                </label>
                                <input type="text" id="referenceNumber" readonly style="background: #f1f5f9; cursor: not-allowed; color: #64748b; font-weight: bold; border-color: #cbd5e1;" required>
                                <small style="display: block; margin-top: 5px; color: #64748b; font-size: 11px;"><i class="fas fa-info-circle"></i> Auto-generated application tracking ID</small>
                            </div>
                        </div>
"@
    
    # Inject it after address textarea
    $addressBlock = '</textarea>' + "`r`n" + '                        </div>'
    $content = $content.Replace($addressBlock, $addressBlock + "`r`n" + $newRefBlock)
    
    Set-Content "c:\Users\Al Hafiz\public\room-apply.html" $content
    Write-Host "Success"
} else {
    Write-Host "Ref block not found"
}
