# twcss-to-sass
HTML template to SASS converter for TailwindCSS

## **[Demo](https://egoistdeveloper.github.io/twcss-to-sass/)**

## Browser Example

```javascript
<script src="./twcss-to-sass.js"></script>

<script>
    const { convertToSass } = twcssToSass,
    html = `<div class="bg-white">
                <div class="flex justify-center items-center min-h-screen min-w-full">
                    <div class="flex relative">
                        <div class="w-72 h-40 bg-green-400 transform transition-all skew-x-12 -skew-y-12 absolute rounded-lg">
                            My Text 1
                        </div>
                        <div class="w-72 h-40 bg-yellow-400 transform transition-all skew-x-12 -skew-y-12 absolute -top-4 -left-4 rounded-lg">
                            My Text 2
                        </div>
                    </div>
                </div>
            </div>`;

    console.log(convertToSass(html));
</script>
```

## NodeJS Example

```javascript
const twsToSass = require('./twcss-to-sass');
const path = require('path');
const fs = require('fs');

const htmlContent = fs.readFileSync(path.resolve(__dirname, './../../src/data/mock3.html'), 'UTF-8');

console.log(twsToSass.convertToSass(htmlContent));

```