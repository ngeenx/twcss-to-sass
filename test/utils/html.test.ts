import HtmlUtils from '../../src/utils/html'

test('is void element: link', () => {
  const content = 'link'

  expect(HtmlUtils.isVoidElement(content)).toBeTruthy()
})

test('is void element: hr', () => {
  const content = 'hr'

  expect(HtmlUtils.isVoidElement(content)).toBeTruthy()
})
