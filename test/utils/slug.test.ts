import SlugUtils from '../../src/utils/slug'

test('slug simple test', () => {
  const content = ' ====== Pricing Section Start ',
    expected = 'pricing-section-start'

  expect(
    SlugUtils.slugify(content, {
      lowercase: true,
      replacement: '-',
      prefix: '',
      suffix: '',
    })
  ).toBe(expected)
})

test('get slug with remove url', () => {
  const content = ' ====== Pricing Section Start URL: https://example.com',
    expected = 'pricing-section-start-url'

  const slugResult = SlugUtils.slugify(SlugUtils.removeUrl(content), {
    lowercase: true,
    replacement: '-',
    prefix: '',
    suffix: '',
  })

  expect(slugResult).toBe(expected)
})
