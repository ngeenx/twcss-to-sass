import Utils from '../../src/utils/utils'

test('clean text', () => {
  const content = 'is      this\n\r\r dirty text \n\r\r',
    result = 'is this dirty text'

  expect(Utils.cleanText(content)).toBe(result)
})

test('add missing suffix', () => {
  const content = 'width: 100px; height: 100px',
    requiredSuffix = ';',
    result = 'width: 100px; height: 100px' + requiredSuffix

  expect(Utils.addMissingSuffix(content, requiredSuffix)).toBe(result)
})

test('fix fomatter apply issue', () => {
  const content =
      '@apply bg-white hover: shadow-2xl md: shadow-4xl lg: shadow-6xl;',
    result = '@apply bg-white hover:shadow-2xl md:shadow-4xl lg:shadow-6xl;'

  expect(Utils.fixFomatterApplyIssue(content)).toBe(result)
})
