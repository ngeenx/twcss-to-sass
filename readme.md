# twcss-to-sass
[![EgoistDeveloper twCss-to-sass](https://preview.dragon-code.pro/EgoistDeveloper/twCss-to-sass.svg)](https://github.com/EgoistDeveloper/twcss-to-sass)

HTML template to SASS converter for TailwindCSS

[![NPM](https://img.shields.io/npm/v/@egoistdeveloper/twcss-to-sass)](https://www.npmjs.com/package/@egoistdeveloper/twcss-to-sass)
[![NPM Type Definitions](https://img.shields.io/npm/types/@egoistdeveloper/twcss-to-sass)](https://www.npmjs.com/package/@egoistdeveloper/twcss-to-sass)
[![NPM Bundle Size](https://img.shields.io/bundlephobia/minzip/@egoistdeveloper/twcss-to-sass)](https://www.npmjs.com/package/@egoistdeveloper/twcss-to-sass)
[![NPM](https://img.shields.io/npm/l/@egoistdeveloper/twcss-to-sass)](https://github.com/EgoistDeveloper/twcss-to-sass/blob/dev/LICENSE)

## 🚀 **[Playground](https://egoistdeveloper.github.io/twcss-to-sass/)**


## 📦 Installation

### NPM

```dsconfig
npm i @egoistdeveloper/twcss-to-sass
```

### CDN

```javascript
<script src="https://unpkg.com/@egoistdeveloper/twcss-to-sass@latest/dist/umd/index.js"></script>
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

**HTML Output**

```xml
<!-- Container Start, Container Any -->
<div class="class-div-0">
    <!-- Some Div -->
    <div class="class-div-1">
        <div class="class-div-2">
            <!-- Inner Div -->
            <div class="class-div-3"></div>
        </div>
    </div>
</div>
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

```html
<!-- local -->
<script src="./../../dist/umd/index.js"></script>

<!-- or -->

<!-- CDN -->
<script src="https://unpkg.com/@egoistdeveloper/twcss-to-sass@latest/dist/umd/index.js"></script>

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

    console.log(convertToSass(html).html);
    console.log(convertToSass(html).sass);
</script>
```

## 🔰 NodeJS Example

```javascript
const TwCssToSass = require('./twcss-to-sass');
const path = require('path');
const fs = require('fs');

const htmlContent = fs.readFileSync(
  path.resolve(__dirname, './templates/template-1.html'),
  'UTF-8'
)

console.log(TwCssToSass.convertToSass(htmlContent).sass);
console.log(TwCssToSass.convertToSass(htmlContent).html);

```

## 🔰 Angular, React, Vue, etc...

```javascript
import { convertToSass } from '@egoistdeveloper/twcss-to-sass';

const htmlContent = '<div class="w-72 h-40 bg-green-400 transform transition-all">My Text 1</div>';

console.log(convertToSass(htmlContent).sass);
console.log(convertToSass(htmlContent).html);

```

## Attribution

<a href="https://www.flaticon.com/free-icons/wind" title="wind icons">Wind icons created by smalllikeart - Flaticon</a>
