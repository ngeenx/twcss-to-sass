import { IHtmlNode } from '../interfaces/html-node'
import { ITwToSassOptions } from '../interfaces/tw-to-sass-options'
import SlugUtils from './slug'

const ClassUtils = {
  /**
   * Order by class names
   *
   * @param classes string
   * @returns string
   */
  orderClasses(classes: string): string {
    const classList = classes.split(/\s+/g)

    const orderedClassList = classList
      .sort((a, b) => {
        return a > b ? 1 : a < b ? -1 : 0
      })
      .join(' ')

    return orderedClassList
  },

  /**
   * Group by class names
   *
   * @param classes string
   * @param sort boolean
   * @returns string
   */
  groupClasses(classes: string, sort = false): string {
    // group by class names
    const classGroups = classes.split(/\s+/g)?.reduce(
      (
        result: {
          [key: string]: string[]
        },
        word: string
      ) => {
        let _word = null

        if (word) {
          const match = word?.match('-?[a-z0-9]+')

          if (match && match[0]) {
            _word = match[0]
          } else {
            _word = word
          }
        }

        if (!result) {
          result = {}
        }

        if (_word) {
          result[_word] = result[_word] || []
          result[_word].push(word)
        }

        return result
      },
      {}
    )

    // convert to string back
    const classGroupsMerged = Object.entries(classGroups)
      .sort((a, b) => {
        // sort by group name (as key)
        return sort ? (a > b ? 1 : a < b ? -1 : 0) : 0
      })
      .map(function (item) {
        // merge group classes
        return item[1].join(' ')
      })
      .join(' ')

    return classGroupsMerged
  },

  /**
   * Get CSS class name from node details
   *
   * @param node IHtmlNode
   * @param deepth number
   *
   * @returns string
   */
  getClassName(
    node: IHtmlNode,
    deepth: number,
    options: ITwToSassOptions
  ): string {
    let className = ''

    const exceptTagNames = ['html', 'head', 'body', 'style']

    // comment to class name
    if (node.comment && options.useCommentBlocksAsClassName) {
      let classSlug = options.classNameOptions.prefix

      classSlug += SlugUtils.slugify(
        SlugUtils.removeUrl(node.comment),
        options.classNameOptions
      )

      classSlug =
        classSlug.length > options.maxClassNameLength
          ? classSlug.substring(0, options.maxClassNameLength)
          : classSlug

      classSlug += options.classNameOptions.suffix

      className = '.' + classSlug
    } // tag name selector
    else if (
      exceptTagNames.indexOf(node.tagName) > -1 ||
      (!node.hasElementChildren && node.tagName != 'div')
    ) {
      // TODO: add exclude option for tag names
      className = `${node.tagName}`
    } // default placeholder class name
    else {
      className = `.class-${node.tagName}${deepth ? '-' + deepth : ''}`
    }

    return className
  },
}

export default ClassUtils
