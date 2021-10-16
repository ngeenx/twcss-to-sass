const twsToSass = require('./twcss-to-sass');
const path = require('path');
const fs = require('fs');

const htmlContent = fs.readFileSync(path.resolve(__dirname, './../../src/data/mock3.html'), 'UTF-8');

console.log(twsToSass.convertToSass(htmlContent));