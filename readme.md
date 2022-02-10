# twcss-to-sass
HTML template to SASS converter for TailwindCSS

![NPM](https://img.shields.io/npm/v/@egoistdeveloper/twcss-to-sass)
![NPM Type Definitions](https://img.shields.io/npm/types/@egoistdeveloper/twcss-to-sass)
![NPM Bundle Size](https://img.shields.io/bundlephobia/minzip/@egoistdeveloper/twcss-to-sass)
![NPM](https://img.shields.io/npm/l/@egoistdeveloper/twcss-to-sass)

## 🚀 Demo

### **[Demo](https://egoistdeveloper.github.io/twcss-to-sass/)**


## 📦 Installation
```bash
npm i @egoistdeveloper/twcss-to-sass
```

## Input-Output

**Template Input**

```xml
<!-- Container Start -->
<!-- Container Any -->
<div class="bg-white">
	<!-- Some Div -->
	<div class="flex justify-center items-center min-h-screen min-w-full">
		<div class="flex relative">
			<!-- Inner Div -->
			<div class="w-72 h-40 bg-green-400 transform transition-all">
				My Text 1
			</div>
		</div>
	</div>
</div>
<!-- Container End-->
```

**SASS Output**

```scss
/* Container Start, Container Any -> 1 */
.class-1-div {
    @apply bg-white;

    /* Some Div -> 2 */
    .class-2-div {
        @apply flex justify-center items-center min-h-screen min-w-full;

        /* div -> 3 */
        .class-3-div {
            @apply flex relative;

            /* Inner Div -> 4 */
            .class-3-div {
                @apply w-72 h-40 bg-green-400 transform transition-all;
            }
        }
    }
}
```

## 🔰 Browser Example

```javascript
<script src="./twcss-to-sass.js"></script>

<script>
    const { convertToSass } = TwCssToSass,
    html = `<!-- Container Start -->
            <!-- Container Any -->
            <div class="bg-white">
                <!-- Some Div -->
                <div class="flex justify-center items-center min-h-screen">
                    <div class="flex relative">
                        <!-- Inner Div -->
                        <div class="w-72 h-40 bg-green-400 absolute">
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
const TwCssToSass = require('./twcss-to-sass');
const path = require('path');
const fs = require('fs');

const htmlContent = fs.readFileSync(path.resolve(__dirname, './../../src/data/mock3.html'), 'UTF-8');

console.log(TwCssToSass.convertToSass(htmlContent));

```

## 🔰 Angular, React, Vue, etc...

```javascript
import { convertToSass } from '@egoistdeveloper/twcss-to-sass';

const htmlContent = '<div class="w-72 h-40 bg-green-400 transform transition-all">My Text 1</div>';

console.log(convertToSass(htmlContent));

```
