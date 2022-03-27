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
