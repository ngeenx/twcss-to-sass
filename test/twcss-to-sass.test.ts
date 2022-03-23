import { ITwToSassOptions } from '../src/interfaces/tw-to-sass-options'
import { convertToSass } from '../src/twcss-to-sass'

test('convert to sass', () => {
  const htmlCotnent =
    '<div class="w-72 h-40 bg-green-400 transform transition-all">My Text 1</div>'

  const sassOutput = `/* div -> 1 */
.class-div-1 {
    @apply w-72 h-40 bg-green-400 transform transition-all;
}`

  const converterResult = convertToSass(htmlCotnent)

  expect(converterResult?.sass).toBe(sassOutput)
})

test('convert to sass with inline css', () => {
  const htmlCotnent =
    '<div class="w-72 h-40 bg-green-400 transform transition-all" style="border: 1px solid white; padding: 30px; font-weight: 50px;">My Text 1</div>'

  const sassOutput = `/* div -> 1 */
.class-div-1 {
    @apply w-72 h-40 bg-green-400 transform transition-all;

    border: 1px solid white;
    padding: 30px;
    font-weight: 50px;
}`

  const converterResult = convertToSass(htmlCotnent)

  expect(converterResult?.sass).toBe(sassOutput)
})

test('convert to sass with comments', () => {
  const htmlCotnent = `<!-- Container Start -->
<!-- Container Any -->
<div class="bg-white">
    <!-- Some Div -->
    <div class="flex justify-center items-center min-h-screen min-w-full">
        ...
    </div>
</div>
<!-- Container End-->`

  const sassOutput = `/* Container Any -> 1 */
.class-div-1 {
    @apply bg-white;

    /* Some Div -> 2 */
    .class-div-2 {
        @apply flex justify-center items-center min-h-screen min-w-full;
    }
}`

  const converterConfigs = <ITwToSassOptions>{
    useCommentBlocksAsClassName: false,
    printSassComments: true,
  }
  const converterResult = convertToSass(htmlCotnent, converterConfigs)

  expect(converterResult?.sass).toBe(sassOutput)
})

test('convert to sass with comments class names', () => {
  const htmlCotnent = `<!-- Container Start -->
<!-- Container Any -->
<div class="bg-white">
    <!-- Some Div -->
    <div class="flex justify-center items-center min-h-screen min-w-full">
        ...
    </div>
</div>
<!-- Container End-->`

  const sassOutput = `/* Container Any -> 1 */
.pre_container_any_suf {
    @apply bg-white;

    /* Some Div -> 2 */
    .pre_some_div_suf {
        @apply flex justify-center items-center min-h-screen min-w-full;
    }
}`

  const converterConfigs = <ITwToSassOptions>{
    useCommentBlocksAsClassName: true,
    printSassComments: true,
    classNameOptions: {
      lowercase: true,
      replacement: '_',
      prefix: 'pre_',
      suffix: '_suf',
    },
  }

  const converterResult = convertToSass(htmlCotnent, converterConfigs)

  expect(converterResult?.sass).toBe(sassOutput)
})

test('convert to sass with group-modifier', () => {
  const htmlCotnent = `<div class="inline relative group h-48">
    <div class=" bottom-0 px-3 space-x-2 group-hover:opacity-100 group-hover:bg-gradient-to-t">
        Test
    </div>
</div>`

  const sassOutput = `/* div -> 1 */
.class-div-1 {
    @apply inline relative h-48;

    /* #region Group modifier: hover */

    &:hover {
        .class-div-2 {
            @apply opacity-100 bg-gradient-to-t;
        }
    }

    /* #endregion */

    /* div -> 2 */
    .class-div-2 {
        @apply bottom-0 px-3 space-x-2;
    }
}`

  const converterResult = convertToSass(htmlCotnent)

  expect(converterResult?.sass).toBe(sassOutput)
})
