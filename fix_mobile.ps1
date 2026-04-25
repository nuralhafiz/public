$mobileCss = @"
        /* Mobile Responsive */
        @media (max-width: 768px) {
            nav {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                transform: translateX(-100%);
                box-shadow: 5px 0 25px rgba(0, 0, 0, 0.2);
                width: 280px;
            }

            nav.open {
                transform: translateX(0);
            }

            .menu-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 800;
                backdrop-filter: blur(3px);
            }

            .menu-overlay.active {
                display: block;
            }

            .profile-card {
                padding: 20px;
            }

            .profile-name {
                font-size: 22px;
            }

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

            .email-container {
                width: 100%;
            }

            .email-value {
                width: 100%;
                word-break: break-all;
                font-size: 13px;
            }

            .copy-btn {
                margin-left: 30px;
            }

            /* Show truncated email on mobile */
            .email-full {
                display: none;
            }

            .email-truncated {
                display: inline-block;
            }
        }
"@

function Fix-ProfileCSS {
    param([string]$FilePath)
    $content = Get-Content $FilePath -Raw
    
    # Simple regex to find the entire @media (max-width: 768px) block until the next @media block
    $pattern = '(?s)/\* Mobile Responsive \*/\s*@media \(max-width: 768px\) \{.*?\}\s*\}'
    
    # Try finding it
    if ($content -match $pattern) {
        $content = $content -replace $pattern, $mobileCss
        Set-Content $FilePath $content
        Write-Host "Fixed $FilePath"
    } else {
        # The file might be broken and missing parts. Let's do a looser match for student-profile.html
        $patternBroken = '(?s)/\*\s*Mobile Responsive\s*\*/\s*@media\s*\(max-width:\s*768px\)\s*\{.*?(?=\s*/\*\s*Small mobile devices\s*\*/)'
        if ($content -match $patternBroken) {
            $content = $content -replace $patternBroken, ($mobileCss + "`r`n")
            Set-Content $FilePath $content
            Write-Host "Fixed broken $FilePath"
        } else {
            Write-Host "Could not find block in $FilePath"
        }
    }
}

Fix-ProfileCSS "c:\Users\Al Hafiz\public\student-profile.html"
Fix-ProfileCSS "c:\Users\Al Hafiz\public\warden-profile.html"
