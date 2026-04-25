$oldMobileCss = @"
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
                padding-left: 30px;
            }
"@

$currentMobileCss = @"
            .detail-item {
                padding: 15px;
                flex-wrap: wrap;
                align-items: center;
                gap: 10px;
            }

            .detail-label {
                width: auto;
                flex: 1;
                font-size: 13px;
                margin-bottom: 0;
            }

            .detail-value {
                width: 100%;
                margin-left: 0;
                padding-left: 34px;
                margin-top: 4px;
            }
"@

function Revert-ProfileCSS {
    param([string]$FilePath)
    $content = Get-Content $FilePath -Raw
    
    # Remove exact carriage returns/newlines mismatch
    $currentRegex = '(?s)\.detail-item\s*\{\s*padding:\s*15px;\s*flex-wrap:\s*wrap;\s*align-items:\s*center;\s*gap:\s*10px;\s*\}\s*\.detail-label\s*\{\s*width:\s*auto;\s*flex:\s*1;\s*font-size:\s*13px;\s*margin-bottom:\s*0;\s*\}\s*\.detail-value\s*\{\s*width:\s*100%;\s*margin-left:\s*0;\s*padding-left:\s*34px;\s*margin-top:\s*4px;\s*\}'
    
    if ($content -match $currentRegex) {
        $content = $content -replace $currentRegex, $oldMobileCss
        Set-Content $FilePath $content
        Write-Host "Reverted $FilePath"
    } else {
        Write-Host "Could not find current block in $FilePath"
    }
}

Revert-ProfileCSS "c:\Users\Al Hafiz\public\student-profile.html"
Revert-ProfileCSS "c:\Users\Al Hafiz\public\warden-profile.html"
