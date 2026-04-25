$content = Get-Content "c:\Users\Al Hafiz\public\room-apply.html" -Raw

$headAdd = @"
    <!-- Choices.js CSS & JS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
    <style>
        /* Custom Choices.js Theme */
        .choices[data-type*="select-one"] .choices__inner {
            padding: 10px 15px;
            border: 2px solid #eee;
            border-radius: 10px;
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
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border: 1px solid #eee;
            margin-top: 8px;
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
    </style>
</head>
"@

$jsAdd = @"
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize Choices.js
            const selectElements = document.querySelectorAll('select');
            selectElements.forEach(el => {
                new Choices(el, {
                    searchEnabled: false,
                    itemSelectText: '',
                    shouldSort: false
                });
            });

            const today = new Date().toISOString().split('T')[0];
"@

$content = $content -replace '</head>', $headAdd
$content = $content -replace "document\.addEventListener\('DOMContentLoaded', \(\) => \{\s*const today = new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\];", $jsAdd

Set-Content "c:\Users\Al Hafiz\public\room-apply.html" $content
Write-Host "Injected Choices.js"
