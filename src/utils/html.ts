const HtmlUtils = {
  /**
   * @source https://www.w3.org/TR/2011/WD-html-markup-20110113/syntax.html#syntax-elements
   */
  voidElements: [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ],

  /**
   * Check if element is void
   *
   * @param tagName string
   *
   * @returns boolean
   */
  isVoidElement(tagName: string): boolean {
    return this.voidElements.includes(tagName)
  },
}

export default HtmlUtils
