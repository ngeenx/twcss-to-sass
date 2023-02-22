# twcss-to-sass
[![EgoistDeveloper twcss-to-sass](https://preview.dragon-code.pro/EgoistDeveloper/TW-CSS-to-SASS.svg)](https://github.com/EgoistDeveloper/twcss-to-sass)

HTML template to SASS converter for TailwindCSS

[![CodeFactor](https://www.codefactor.io/repository/github/egoistdeveloper/twcss-to-sass/badge)](https://www.codefactor.io/repository/github/egoistdeveloper/twcss-to-sass)
[![NPM](https://img.shields.io/npm/v/@egoistdeveloper/twcss-to-sass)](https://www.npmjs.com/package/@egoistdeveloper/twcss-to-sass)
[![NPM Type Definitions](https://img.shields.io/npm/types/@egoistdeveloper/twcss-to-sass)](https://www.npmjs.com/package/@egoistdeveloper/twcss-to-sass)
[![NPM](https://img.shields.io/npm/l/@egoistdeveloper/twcss-to-sass)](https://github.com/EgoistDeveloper/twcss-to-sass/blob/dev/LICENSE)

## About

There are many tailwind component sharing platforms, snippet websites, code pens, UI kits, etc. We generally see static demos and inline class lists like `<div class="text-base leading-6 text-gray-500 hover:text-gray-900">...`. If you want to choose the SASS option for your project, you need to convert inline classes and templates one by one. And this process takes time. This tool converts inline class lists to SASS and it takes just milliseconds.

This tool is useful for a quick start but all cases did not consider. There are many edge cases. So, you may need to refactor output HTML and SASS results.

## 🚀 [Playground](https://egoistdeveloper.github.io/twcss-to-sass-playground)

Use converter playground for quick start.

## 📦 Installation

### NPM

```dsconfig
npm i @egoistdeveloper/twcss-to-sass
```

### CDN

```javascript
<script src="https://unpkg.com/@egoistdeveloper/twcss-to-sass@latest/dist/umd/index.js"></script>
```

## Todo

- [x] Fix missing texts with child element
- [x] Fix self-closing tags like `link`, `base`, `area`, `br` etc
- [x] Fix url conflict with class name in comment line
- [x] Add option for duplicated classes
- [x] Fix `group` and `peer` utility classes issue on SASS
- [ ] Filter non tailwind classes
- [x] Order classes
- [x] Group classes
- [ ] Print as group classes
- [x] Add configs menu for playground
- [ ] Detect tailwind classes

## Input-Output

**Template Input**

```xml
<!-- Container Start -->
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
<!-- Container Start -->
<div class="container-start">
    <!-- Some Div -->
    <div class="some-div">
        <div class="class-div-3">
            <!-- Inner Div -->
            <div class="inner-div">
                My Text 1
            </div>
        </div>
    </div>
</div>
```

**SASS Output**

```scss
/* Container Start -> 1 */
.container-start {
    @apply bg-white;

    /* Some Div -> 2 */
    .some-div {
        @apply flex items-center justify-center min-h-screen min-w-full;

        /* div -> 3 */
        .class-div-3 {
            @apply flex relative;

            /* Inner Div -> 4 */
            .inner-div {
                @apply bg-green-400 h-40 transform transition-all w-72;
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

console.log(TwCssToSass.convertToSass(htmlContent).html);
console.log(TwCssToSass.convertToSass(htmlContent).sass);

```

## 🔰 Angular, React, Vue, etc...

```javascript
import { convertToSass } from '@egoistdeveloper/twcss-to-sass';

const htmlContent = '<div class="w-72 h-40 bg-green-400 transform transition-all">My Text 1</div>';

console.log(convertToSass(htmlContent).html);
console.log(convertToSass(htmlContent).sass);

```

## Attribution

<a href="https://www.flaticon.com/free-icons/wind" title="wind icons">Wind icons created by smalllikeart - Flaticon</a>
