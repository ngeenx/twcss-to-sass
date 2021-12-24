# twcss-to-sass
HTML template to SASS converter for TailwindCSS

## 🚀 **[Demo](https://egoistdeveloper.github.io/twcss-to-sass/)**



## 📦 Installation
```bash
npm i @egoistdeveloper/twcss-to-sass
```

## 🔰 Browser Example

```javascript
<script src="./twcss-to-sass.js"></script>

<script>
    const { convertToSass } = twcssToSass,
    html = `<!-- Container Start -->
            <!-- Container Any -->
            <div class="bg-white">
                <!-- Some Div -->
                <div class="flex justify-center items-center min-h-screen min-w-full">
                    <div class="flex relative">
                        <!-- Inner Div -->
                        <div class="w-72 h-40 bg-green-400 transform transition-all skew-x-12 -skew-y-12 absolute rounded-lg">
                            My Text 1
                        </div>
                    </div>
                </div>
            </div>
            <!-- Container End-->`;

    console.log(convertToSass(html));
</script>
```

## 🔰 NodeJS Example

```javascript
const twsToSass = require('./twcss-to-sass');
const path = require('path');
const fs = require('fs');

const htmlContent = fs.readFileSync(path.resolve(__dirname, './../../src/data/mock3.html'), 'UTF-8');

console.log(twsToSass.convertToSass(htmlContent));

```