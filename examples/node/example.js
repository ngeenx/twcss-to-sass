// eslint-disable-next-line @typescript-eslint/no-var-requires
const TwCssToSass = require('../../dist/umd/index')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')

const htmlContent = fs.readFileSync(
  path.resolve(__dirname, './templates/template-1.html'),
  'UTF-8'
)

const result = TwCssToSass.convertToSass(htmlContent)

console.log(result)
