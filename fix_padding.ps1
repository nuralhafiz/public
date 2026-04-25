$mobileCssFixed = @"
            .detail-item {
                padding: 15px;
                flex-wrap: wrap;
                gap: 10px;
            }

            .detail-label {
                width: 100%;
                font-size: 12px;
                margin-bottom: 5px;
            }

            .detail-value {
                width: 100%;
                margin-left: 0;
                padding-left: 0;
            }

            .email-container {
                width: 100%;
            }

            .email-value {
                width: 100%;
                word-break: break-all;
                font-size: 13px;
            }

            .copy-btn {
                margin-left: 0;
                margin-top: 5px;
            }
"@

function Fix-Padding {
    param([string]$FilePath)
    $content = Get-Content $FilePath -Raw
    
    $regex = '(?s)\.detail-item\s*\{\s*padding:\s*15px;\s*flex-wrap:\s*wrap;\s*gap:\s*10px;\s*\}\s*\.detail-label\s*\{\s*width:\s*100%;\s*font-size:\s*12px;\s*margin-bottom:\s*5px;\s*\}\s*\.detail-value\s*\{\s*width:\s*100%;\s*margin-left:\s*0;\s*padding-left:\s*30px;\s*\}\s*\.email-container\s*\{\s*width:\s*100%;\s*\}\s*\.email-value\s*\{\s*width:\s*100%;\s*word-break:\s*break-all;\s*font-size:\s*13px;\s*\}\s*\.copy-btn\s*\{\s*margin-left:\s*30px;\s*\}'
    
    if ($content -match $regex) {
        $content = $content -replace $regex, $mobileCssFixed
        Set-Content $FilePath $content
        Write-Host "Fixed padding in $FilePath"
    } else {
        Write-Host "Could not find block in $FilePath"
    }
}

Fix-Padding "c:\Users\Al Hafiz\public\student-profile.html"
Fix-Padding "c:\Users\Al Hafiz\public\warden-profile.html"
