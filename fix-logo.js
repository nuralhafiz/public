const fs = require('fs');

const cssFix = `
/* Fix Logo Wrapping on Mobile */
.brand-blue, .brand-lime {
    white-space: nowrap;
}
.logo, a.logo {
    white-space: nowrap !important;
    display: inline-flex !important;
    align-items: center;
    flex-wrap: nowrap;
}
.i-wrapper {
    white-space: nowrap;
}
`;

fs.appendFileSync('css/global.css', cssFix);
console.log('Logo fix appended to CSS');
