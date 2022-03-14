import IClassNameOptions from '../interfaces/classname-options'

const SlugUtils = {
  /**
   * Slugify a string
   * @source https://stackoverflow.com/a/54744145/6940144
   *
   * @param text string
   *
   * @returns string
   */
  slugify: (text: string, confg: IClassNameOptions): string => {
    // text = text.trim()

    if (confg.lowercase) {
      text = text.toLowerCase()
    }

    const replacement = confg.replacement ? confg.replacement : '-'

    text = text
      .trim()
      .replace(/\s+/g, replacement)
      .replace(/[^\w\-]+/g, '')
      .replace(/`${replacement}`+/g, replacement)
      .replace(/^-+/, '')
      .replace(/-+$/, '')

    return text
  },
}

export default SlugUtils
