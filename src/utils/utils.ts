const Utils = {
  /**
   * Clean new lines and duplicated whitespaces in string
   *
   * @param {string} string
   * @param {boolean} preventEmpty
   *
   * @returns string
   */
  cleanText: function (string: string, preventEmpty = false): string {
    if (string && string.length) {
      const _string = string
        .replace(/(\r\n|\n|\r|\s+)/gm, ' ')
        .replace(/  +/g, ' ')
        .trim()

      return preventEmpty && /^\s+$/gm.test(string) ? '' : _string
    }

    return ''
  },

  /**
   * Add missing suffix
   *
   * @param {string} string
   * @param {string} suffix
   *
   * @return string
   */
  addMissingSuffix: function (string: string, suffix: string): string {
    if (string && string.length) {
      if (!string.endsWith(suffix)) {
        return `${string}${suffix}`
      }
    }

    return string
  },

  /**
   * Fix formatted SASS output @apply
   *
   * Css formatter brokes colon (":") syntax with @apply decorator
   *
   * Exp: @apply bg-white hover: shadow-2xl md: shadow-4xl lg: shadow-6xl;
   *                           ^^^            ^^^            ^^^
   * Will be convert to: @apply bg-white hover:shadow-2xl md:shadow-4xl lg:shadow-6xl;
   *                                           ^^^            ^^^          ^^^
   * @param {string} content
   *
   * @return string
   */
  fixFomatterApplyIssue: function (content: string): string {
    if (content && content.length) {
      const lines = content.split('\n'),
        pattern =
          /@apply( [a-zA-Z0-9-_\/: ]+)? [a-zA-Z0-9-_\/:]+(: )([a-zA-Z0-9-_\/: ]+)?;/gm

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        if (line.match(pattern)) {
          lines[i] = line.replace(/: /gm, ':')
        }
      }

      return lines.join('\n')
    }

    return content
  },
}

export default Utils
