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

  /**
   * Remove URL or URLs from string
   *
   * @param text string
   *
   * @returns string
   */
  removeUrl: function (text: string): string {
    return text.replace(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
      ''
    )
  },
}

export default SlugUtils
