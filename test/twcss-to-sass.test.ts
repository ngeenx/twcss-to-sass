import { convertToSass } from '../src/twcss-to-sass'

test('convert to sass', () => {
  const htmlCotnent =
      '<div class="w-72 h-40 bg-green-400 transform transition-all">My Text 1</div>',
    sassOutput = `/* div -> 1 */
.class-1-div {
    @apply w-72 h-40 bg-green-400 transform transition-all;
}`

  expect(convertToSass(htmlCotnent)).toBe(sassOutput)
})

test('convert to sass with inline css', () => {
  const htmlCotnent =
      '<div class="w-72 h-40 bg-green-400 transform transition-all" style="border: 1px solid white; padding: 30px; font-weight: 50px;">My Text 1</div>',
    sassOutput = `/* div -> 1 */
.class-1-div {
    @apply w-72 h-40 bg-green-400 transform transition-all;
    border: 1px solid white;
    padding: 30px;
    font-weight: 50px;
}`

  expect(convertToSass(htmlCotnent)).toBe(sassOutput)
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
<!-- Container End-->`,
    sassOutput = `/* Container Start, Container Any -> 1 */
.class-1-div {
    @apply bg-white;

    /* Some Div -> 2 */
    .class-2-div {
        @apply flex justify-center items-center min-h-screen min-w-full;
    }
}`

  expect(convertToSass(htmlCotnent)).toBe(sassOutput)
})
