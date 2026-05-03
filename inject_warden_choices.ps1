$headTags = @'
    <!-- Choices.js CSS & JS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
    <style>
        /* Custom Choices.js Theme (Flat Design) */
        .choices[data-type*="select-one"] .choices__inner {
            padding: 10px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 0;
            background-color: white;
            min-height: 48px;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            color: #333;
            transition: all 0.3s;
            box-shadow: none;
        }
        .choices[data-type*="select-one"].is-focused .choices__inner {
            border-color: #2d72d2;
            box-shadow: none;
        }
        .choices__list--dropdown {
            border-radius: 0;
            box-shadow: none;
            border: 1px solid #e0e0e0;
            margin-top: 0;
            z-index: 100;
        }
        .choices__list--dropdown .choices__item--selectable.is-highlighted {
            background-color: rgba(45, 114, 210, 0.05);
            color: #2d72d2;
            font-weight: 500;
        }
        .choices__list--dropdown .choices__item {
            padding: 12px 15px;
            font-size: 14px;
            font-family: 'Poppins', sans-serif;
        }
        .choices[data-type*="select-one"]::after {
            border-color: #64748b transparent transparent transparent;
            margin-top: -2.5px;
            right: 15px;
        }
        .choices[data-type*="select-one"].is-open::after {
            border-color: transparent transparent #2d72d2 transparent;
            margin-top: -7.5px;
        }
        
        /* Fix for filter-group spacing with Choices.js */
        .filter-group .choices {
            min-width: 140px;
            margin-bottom: 0;
        }
    </style>
</head>
'@

$bodyTags = @'
    <!-- Initialize Choices.js -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const selects = document.querySelectorAll('.filter-select');
            selects.forEach(select => {
                new Choices(select, {
                    searchEnabled: false,
                    itemSelectText: '',
                    shouldSort: false
                });
            });
        });
    </script>
</body>
'@

$files = Get-ChildItem -Path "c:\Users\Al Hafiz\public" -Filter "warden-*.html"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match 'class="filter-select"' -and -not ($content -match 'choices\.min\.css')) {
        $content = $content -replace '</head>', $headTags
        $content = $content -replace '</body>', $bodyTags
        Set-Content $file.FullName $content
        Write-Host "Updated $($file.Name)"
    }
}
