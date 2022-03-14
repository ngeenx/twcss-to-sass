import { parse } from 'himalaya'
import beautifyCss, { CSSBeautifyOptions } from 'js-beautify'

import Utils from './utils/utils'
import HtmlUtils from './utils/html'
import SlugUtils from './utils/slug'

import { ITwToSassOptions } from './interfaces/tw-to-sass-options'
import {
  IAttribute,
  IHtmlNode,
  IHtmlNodeAttribute,
} from './interfaces/html-node'
import { IConverterResult } from './interfaces/converter-result'

/**
 * Default js-beautify css formatter options
 */
const formatterOptions: CSSBeautifyOptions = {
  indent_size: 4,
  indent_char: ' ',
  max_preserve_newlines: 5,
  preserve_newlines: true,
  end_with_newline: false,
  wrap_line_length: 0,
  indent_empty_lines: false,
}

/**
 * Default options
 */
const defaultOptions: ITwToSassOptions = {
  formatOutput: true,
  useCommentBlocksAsClassName: true,
  maxClassNameLength: 50,
  printComments: true,
  formatterOptions: formatterOptions,
  classNameOptions: {
    lowercase: true,
    replacement: '-',
    prefix: '',
    suffix: '',
  },
}

let _defaultOptions: ITwToSassOptions = defaultOptions

/**
 * Get style and class attributes
 *
 * @param attributes IHtmlNodeAttribute[] | null
 * @param keys string | string[]
 *
 * @returns IAttribute | null
 */
function getAttributes(
  attributes: IHtmlNodeAttribute[] | null,
  keys: string | string[]
): IAttribute | null {
  if (attributes) {
    if (!Array.isArray(keys)) {
      keys = [keys]
    }

    const _attributes = attributes
      .filter((attribute: IHtmlNodeAttribute) => keys.includes(attribute.key))
      .map((attribute: IHtmlNodeAttribute) => {
        attribute.value = Utils.cleanText(attribute.value)

        return attribute
      })

    if (_attributes) {
      return {
        style:
          _attributes.find((x: IHtmlNodeAttribute) => x.key == 'style')
            ?.value ?? null,
        class:
          _attributes.find((x: IHtmlNodeAttribute) => x.key == 'class')
            ?.value ?? null,
      }
    }
  }

  return null
}

/**
 * Get style contents
 *
 * @param {array} styleElements
 */
function getStyleContents(styleElements: IHtmlNode[]): IHtmlNode[] {
  return styleElements.map((element: IHtmlNode) => {
    const styleContents = element.children
      .filter((x: IHtmlNode) => (x.type = 'text'))
      .map((x: IHtmlNode) => x.content)
      .join('')

    return <IHtmlNode>(<unknown>{
      tagName: 'style',
      text: 'STYLE',
      filterAttributes: {
        style: styleContents,
      },
    })
  })
}

/**
 * Filter IHtmlNode array by node type and tagName
 *
 * @param {string} htmlJson
 *
 * @returns Object
 */
function filterHtmlData(
  htmlJson: IHtmlNode[] | IHtmlNode,
  nestedOrder = 1
): IHtmlNode[] | null {
  if (htmlJson && Array.isArray(htmlJson)) {
    const parentNode = htmlJson.filter(
        (x: IHtmlNode) =>
          (x.type == 'element' || x.type == 'comment') && x.tagName != 'style'
      ),
      styleElements = htmlJson.filter((x) => x.tagName == 'style')

    let styleList: IHtmlNode[] = []

    if (styleElements && styleElements.length) {
      styleList = getStyleContents(styleElements)
    }

    if (parentNode && parentNode.length) {
      const elementList: IHtmlNode[] | null = []

      parentNode.forEach((node: IHtmlNode) => {
        if (Array.isArray(node.children)) {
          const previousNodes = []

          // find available previous nodes
          for (let i = 0; i < parentNode.length; i++) {
            if (parentNode[i] == node) {
              if (parentNode[i - 1]) {
                previousNodes.push(parentNode[i - 1])
              }

              if (parentNode[i - 2]) {
                previousNodes.push(parentNode[i - 2])
              }

              break
            }
          }

          // get parent comment text
          node.comment = previousNodes
            .filter((x) => x.type == 'comment')
            .map((x) => Utils.cleanText(x.content, true))
            .filter((x) => x !== null)
            .reverse()
            .join(', ')

          node.order = nestedOrder

          const children: IHtmlNode[] | null = filterHtmlData(
            node.children,
            nestedOrder + 1
          )

          if (children && children.length) {
            node.children = children.filter(
              (x: IHtmlNode) => x.type == 'element'
            )
          }
        }

        // get only class and inline style attributes
        node.filterAttributes = getAttributes(node.attributes, [
          'class',
          'style',
        ])

        if (node.filterAttributes !== null || node.children !== null) {
          elementList?.push(node)
        }
      })

      if (elementList && elementList.length) {
        return [...styleList, ...elementList]
      }
    }
  }

  return null
}

/**
 * Get CSS class name from node details
 *
 * @param node IHtmlNode
 * @param deepth number
 *
 * @returns string
 */
function getClassName(node: IHtmlNode, deepth: number): string {
  let className = ''

  if (node.comment && _defaultOptions.useCommentBlocksAsClassName) {
    let classSlug = _defaultOptions.classNameOptions.prefix

    classSlug += SlugUtils.slugify(
      node.comment,
      _defaultOptions.classNameOptions
    )

    classSlug =
      classSlug.length > _defaultOptions.maxClassNameLength
        ? classSlug.substring(0, _defaultOptions.maxClassNameLength)
        : classSlug

    classSlug += _defaultOptions.classNameOptions.suffix

    className = '.' + classSlug
  } else if (node.tagName != 'div') {
    className = `${node.tagName}`
  } else {
    className = `.class-${node.tagName}-${deepth}`
  }

  return className
}

/**
 * Extract SASS tree from HTML JSON tree
 *
 * @param {IHtmlNode} nodeTree
 * @param {int} deepth
 *
 * @returns string
 */
function getSassTree(nodeTree: IHtmlNode[] | IHtmlNode, deepth = 0) {
  if (nodeTree) {
    let styleCount = 0

    if (!Array.isArray(nodeTree)) {
      nodeTree = nodeTree.children
    }

    return nodeTree
      .map((node: IHtmlNode) => {
        let treeString = '',
          subTreeString = ''

        if (node.filterAttributes === null && node.children === null) {
          return ''
        }

        if (Array.isArray(node.children) && node.children.length) {
          ++deepth
          subTreeString = getSassTree(node, deepth)
        }

        if (node.tagName == 'style' && node.filterAttributes) {
          styleCount += 1

          let result = `// #region STYLE #${styleCount}\n`
          result += `\n${node.filterAttributes.style}\n`
          result += '// #endregion\n\n'

          return result
        } else {
          if (node.filterAttributes) {
            if (node.filterAttributes.class) {
              treeString += node.filterAttributes.class
                ? `@apply ${node.filterAttributes.class};`
                : ''
            }

            if (node.filterAttributes.style) {
              node.filterAttributes.style = Utils.addMissingSuffix(
                node.filterAttributes.style,
                ';'
              )

              treeString += node.filterAttributes.style
                ? `\n${node.filterAttributes.style}\n`
                : ''
            }
          }

          if (treeString.length || subTreeString.length) {
            const classComment = _defaultOptions.printComments
              ? `/* ${node.comment ? node.comment : node.tagName} -> ${
                  node.order
                } */`
              : ''

            const className = getClassName(node, deepth)

            return `${classComment}${className}{${treeString}${subTreeString}}`
          }
        }

        return null
      })
      .join('')
  }

  return ''
}

/**
 * Get ready to use HTML tree
 *
 * @param {IHtmlNode} nodeTree
 * @param {int} deepth
 *
 * @returns string
 */
function getHtmlTree(nodeTree: IHtmlNode[] | IHtmlNode, deepth = 0): string {
  if (nodeTree) {
    if (!Array.isArray(nodeTree)) {
      nodeTree = nodeTree.children
    }

    let htmlTree = ''

    nodeTree.forEach(function (node: IHtmlNode) {
      if (node.type == 'element') {
        const className = getClassName(node, deepth)

        if (_defaultOptions.printComments) {
          if (node.comment) {
            htmlTree += `\n<!-- ${node.comment.trim()} -->`
          }
        }

        // other attributes
        const attributes = node.attributes
          ?.filter(
            (attribute) =>
              attribute.key !== 'class' && attribute.key !== 'style'
          )
          ?.map((attribute) => `${attribute.key}="${attribute.value}"`)
          ?.join('')

        // void elements
        const isVoidElement = HtmlUtils.isVoidElement(node.tagName)

        // open tag
        if (className.indexOf('.') > -1) {
          const _className = className.replace('.', '')

          htmlTree += `\n<${node.tagName} class="${_className}" ${attributes} ${
            isVoidElement ? '/' : ''
          }>`
        } else {
          htmlTree += `\n<${node.tagName} ${attributes} ${
            isVoidElement ? '/' : ''
          }>`
        }

        const innerText = node.children
          ?.filter((child) => child.type === 'text')
          .map((child) => child.content)
          .join('')

        // inner text
        htmlTree += innerText ? `\n${innerText}\n` : ''

        const hasSubElement = node.children?.filter(
          (child) => child.type === 'element'
        ).length

        // sub tree
        if (hasSubElement) {
          htmlTree += getHtmlTree(node, deepth + 1)
        }

        htmlTree += (!isVoidElement ? `</${node.tagName}>` : '') + '\n'
      }
    })

    return htmlTree
  }

  return ''
}

/**
 * Convert HMTL to SASS
 *
 * @param {string} html
 * @param {ITwToSassOptions} options
 *
 * @returns string
 */
export function convertToSass(
  html: string,
  options: ITwToSassOptions | null = defaultOptions
): null | IConverterResult {
  if (html && html.length) {
    if (options) {
      _defaultOptions = {
        ...defaultOptions,
        ...options,
      }
    }

    html = Utils.cleanText(html)

    const htmlJson: IHtmlNode[] | IHtmlNode = parse(html)

    const filteredHtmlData = filterHtmlData(htmlJson)

    if (filteredHtmlData) {
      const sassTreeResult = getSassTree(filteredHtmlData)
      let htmlTreeResult = ''

      if (sassTreeResult) {
        htmlTreeResult = getHtmlTree(filteredHtmlData)
      }

      // export with formatted output
      if (_defaultOptions.formatOutput === true) {
        const formattedHtmlResult = beautifyCss.html(htmlTreeResult)

        const formattedSassResult = beautifyCss.css(
          sassTreeResult,
          _defaultOptions.formatterOptions
        )

        return {
          sass: Utils.fixFomatterApplyIssue(formattedSassResult),
          html: formattedHtmlResult,
        }
      }

      return {
        sass: sassTreeResult,
        html: htmlTreeResult,
      }
    }
  }

  return null
}
