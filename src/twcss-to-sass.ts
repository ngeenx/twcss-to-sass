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
import { IGroupModifierPair } from './interfaces/group-modifier-pair'

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
  printHtmlComments: true,
  printSassComments: true,
  formatterOptions: formatterOptions,
  preventDuplicateClasses: true,
  classNameOptions: {
    lowercase: true,
    replacement: '-',
    prefix: '',
    suffix: '',
  },
}

let _defaultOptions: ITwToSassOptions = defaultOptions

let styles: IHtmlNode[] = []

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
function getStyleContents(element: IHtmlNode): IHtmlNode {
  const content = element.children
    .filter((x) => x.type == 'text')
    .map((x) => x.content)
    .join('')

  return <IHtmlNode>(<unknown>{
    tagName: 'style',
    text: 'STYLE',
    content: content,
  })
}

/**
 * Filter IHtmlNode array by node type and tagName
 *
 * @param {string} htmlJson
 * @param {number} deepth
 *
 * @returns IHtmlNode
 */
function filterHtmlData(nodeTree: IHtmlNode[], deepth = 0): IHtmlNode[] {
  if (nodeTree.length > 0) {
    // we do need to empty or doctype declaration
    nodeTree = nodeTree.filter(
      (x: IHtmlNode) => x.content !== ' ' && x.tagName != '!doctype'
    )

    nodeTree.forEach((node: IHtmlNode, index) => {
      if (node.type == 'element') {
        if (node.tagName == 'style') {
          styles.push(getStyleContents(node))
        } else {
          node.filterAttributes = getAttributes(node.attributes, [
            'class',
            'style',
          ])
        }

        // find element's comment in previous node
        node.comment =
          nodeTree[index - 1] && nodeTree[index - 1].type == 'comment'
            ? Utils.cleanText(nodeTree[index - 1].content, true)
            : null
      }

      // let's go deeper
      if (Array.isArray(node.children) && node.children.length > 0) {
        node.order = ++deepth

        const childNodes: IHtmlNode[] = filterHtmlData(node.children, deepth)

        if (childNodes && childNodes.length) {
          node.children = childNodes.filter(
            (x: IHtmlNode) => x.tagName != 'style' && x.type != 'comment'
          )

          node.hasElementChildren =
            node.children.filter((x) => x.type == 'element').length > 0
        }
      }
    })

    return nodeTree
  }

  return []
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

  const exceptTagNames = ['html', 'head', 'body', 'style']

  // comment to class name
  if (node.comment && _defaultOptions.useCommentBlocksAsClassName) {
    let classSlug = _defaultOptions.classNameOptions.prefix

    classSlug += SlugUtils.slugify(
      SlugUtils.removeUrl(node.comment),
      _defaultOptions.classNameOptions
    )

    classSlug =
      classSlug.length > _defaultOptions.maxClassNameLength
        ? classSlug.substring(0, _defaultOptions.maxClassNameLength)
        : classSlug

    classSlug += _defaultOptions.classNameOptions.suffix

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
}

/**
 * Get CSS class name from node details
 *
 * @param styles IHtmlNode[]
 *
 * @returns string
 */
function getCssTree(cssTree: IHtmlNode[]): string {
  let css = ''

  if (styles.length > 0) {
    cssTree.forEach((style: IHtmlNode, index) => {
      css += `/* #region Style Group ${index + 1} */\n\n`
      css += `${style.content}\n`
      css += `/* #endregion */\n\n`
    })
  }

  return css
}

let groupModifierList: IGroupModifierPair[] = []

/**
 * Convert group-* modifiers to sub-selectors
 *
 * @param nodeTree IHtmlNode[]
 * @param isChildNodes boolean
 *
 * @returns string
 */
function groupUtilityToSass(
  nodeTree: IHtmlNode[],
  isChildNodes = false
): string {
  if (!isChildNodes) {
    groupModifierList = []
  }

  let groupSass = ''

  const groupPattern = / group-([a-z0-9]+):([a-z0-9-:\/]+)/gm

  nodeTree.forEach((node: IHtmlNode) => {
    if (node.filterAttributes) {
      if (
        node.filterAttributes.class &&
        node.filterAttributes.class?.match(groupPattern)
      ) {
        node.filterAttributes.class?.match(groupPattern)?.forEach((item) => {
          const matches = new RegExp(groupPattern).exec(item)

          const groupModifierPair = <IGroupModifierPair>{
            modifier: matches?.[1],
            utility: matches?.[2],
            className: getClassName(node, node.order),
          }

          groupModifierList.push(groupModifierPair)
        })

        if (node.filterAttributes.class.match(/(group)(?!-)/gm)) {
          return groupSass
        } else if (node.children.length) {
          groupUtilityToSass(node.children, true)
        }
      } else {
        groupUtilityToSass(node.children, true)
      }
    }
  })

  if (!isChildNodes) {
    if (groupModifierList.length > 0) {
      const modifierGroups = groupModifierList.reduce((prev, next) => {
        prev[next.modifier] = prev[next.modifier] || []
        prev[next.modifier].push(next)

        return prev
      }, Object.create(null))

      Object.entries(modifierGroups)?.forEach(([modifier, utilityList]) => {
        const _utilityList = <IGroupModifierPair[]>utilityList

        const classGroups = _utilityList.reduce((prev, next) => {
          prev[next.className] = prev[next.className] || []
          prev[next.className].push(next)

          return prev
        }, Object.create(null))

        groupSass += `\n\n/* #region Group modifier: ${modifier} */\n\n`
        groupSass += `&:${modifier} {\n`

        Object.entries(classGroups)?.forEach(([className, utilityList]) => {
          const _utilityList = <IGroupModifierPair[]>utilityList

          const classList = _utilityList
            .map((x: IGroupModifierPair) => x.utility)
            .join(' ')

          groupSass += `\t${className} {\n`
          groupSass += `\t\t@apply ${classList};\n`
          groupSass += `\t}\n`
        })

        groupSass += `}`
        groupSass += `\n/* #endregion */\n\n`
      })
    }

    return groupSass
  }

  return ''
}

let peerModifierList: IGroupModifierPair[] = []

/**
 * Convert peer-* modifiers to sub-selectors
 *
 * @param nodeTree IHtmlNode[]
 * @param deepth number
 * @param isChildNodes boolean
 *
 * @returns string
 */
function peerUtilityToSass(
  nodeTree: IHtmlNode[],
  peerClass: string,
  isChildNodes = false
): string {
  if (!isChildNodes) {
    peerModifierList = []
  }

  let groupSass = ''

  const groupPattern = /peer-([a-z0-9]+):([a-z0-9-:\/]+)/gm

  nodeTree.forEach((node: IHtmlNode) => {
    if (node.filterAttributes) {
      if (
        node.filterAttributes.class &&
        node.filterAttributes.class?.match(groupPattern)
      ) {
        node.filterAttributes.class?.match(groupPattern)?.forEach((item) => {
          const matches = new RegExp(groupPattern).exec(item)

          const groupModifierPair = <IGroupModifierPair>{
            modifier: matches?.[1],
            utility: matches?.[2],
            className: getClassName(node, node.order),
          }

          peerModifierList.push(groupModifierPair)
        })

        if (node.filterAttributes.class.match(/(peer)(?!-)/gm)) {
          return groupSass
        } else if (node.children.length) {
          peerUtilityToSass(node.children, peerClass, true)
        }
      } else {
        peerUtilityToSass(node.children, peerClass, true)
      }
    }
  })

  if (!isChildNodes) {
    if (peerModifierList.length > 0) {
      const modifierGroups = peerModifierList.reduce((prev, next) => {
        prev[next.modifier] = prev[next.modifier] || []
        prev[next.modifier].push(next)

        return prev
      }, Object.create(null))

      Object.entries(modifierGroups)?.forEach(([modifier, utilityList]) => {
        const _utilityList = <IGroupModifierPair[]>utilityList

        const classGroups = _utilityList.reduce((prev, next) => {
          prev[next.className] = prev[next.className] || []
          prev[next.className].push(next)

          return prev
        }, Object.create(null))

        groupSass += `\n\n/* #region Peer modifier: ${modifier} */\n\n`

        Object.entries(classGroups)?.forEach(([className, utilityList]) => {
          const _utilityList = <IGroupModifierPair[]>utilityList

          const classList = _utilityList
            .map((x: IGroupModifierPair) => x.utility)
            .join(' ')

          groupSass += `${peerClass}:${modifier} ~ ${className}{\n`
          groupSass += `\t\t@apply ${classList};\n`
          groupSass += `\t}\n`
        })

        groupSass += `\n/* #endregion */\n\n`
      })
    }

    return groupSass
  }

  return ''
}

/**
 * Get class name and styles of node as SASS format
 *
 * @param node IHtmlNode
 *
 * @returns string
 */
function getNodeClassAndStyles(node: IHtmlNode): string {
  let nodeClassAndStyles = ''

  if (node.filterAttributes) {
    // print tailwind class names
    if (node.filterAttributes.class) {
      nodeClassAndStyles += node.filterAttributes.class
        ? `@apply ${node.filterAttributes.class};`
        : ''
    }

    // inline style printing
    if (node.filterAttributes.style) {
      node.filterAttributes.style = Utils.addMissingSuffix(
        node.filterAttributes.style,
        ';'
      )

      nodeClassAndStyles += node.filterAttributes.style
        ? `\n\n${node.filterAttributes.style}`
        : ''
    }
  }

  return nodeClassAndStyles
}

/**
 * Extract SASS tree from HTML JSON tree
 *
 * @param {IHtmlNode} nodeTree
 *
 * @returns string
 */
function getSassTree(nodeTree: IHtmlNode[]): string {
  let sassTree = '',
    isLastLevel = false,
    duplicatedItems: string[] = []

  nodeTree.forEach((node: IHtmlNode, index) => {
    let treeString = '',
      subTreeString = ''

    const hasSubElement = node.children?.filter(
      (child) => child.type === 'element'
    ).length

    if (hasSubElement) {
      subTreeString = getSassTree(node.children)

      isLastLevel = false
    } else if (_defaultOptions.preventDuplicateClasses) {
      isLastLevel = true
    }

    let nodeClassAndStyles = ''

    nodeClassAndStyles += getNodeClassAndStyles(node)

    if (
      _defaultOptions.preventDuplicateClasses &&
      isLastLevel &&
      nodeTree[index + 1]
    ) {
      const _hasSubElement = nodeTree[index + 1].children?.filter(
        (child) => child.type === 'element'
      ).length

      if (!_hasSubElement) {
        const _nodeClassAndStyles = getNodeClassAndStyles(nodeTree[index + 1])

        // compare node sass content with next node sass content or
        // in same level other nodes
        if (nodeClassAndStyles != '' && _nodeClassAndStyles != '') {
          if (
            nodeClassAndStyles == _nodeClassAndStyles ||
            !duplicatedItems.includes(nodeClassAndStyles)
          ) {
            duplicatedItems.push(_nodeClassAndStyles)

            // clear duplicated node sass content
            nodeClassAndStyles = ''
          }
        }
      }
    }

    treeString += nodeClassAndStyles

    if (treeString.length || subTreeString.length) {
      const classComment = _defaultOptions.printSassComments
        ? `/* ${node.comment ? node.comment : node.tagName}${
            node.order ? ' -> ' + node.order : ''
          } */`
        : ''

      const className = getClassName(node, node.order)

      let groupUtilityTree = ''

      // convert group utilities
      if (node.filterAttributes?.class?.match(/(group)(?!-)/gm)) {
        groupUtilityTree = groupUtilityToSass(node.children)

        if (groupUtilityTree !== '') {
          treeString += groupUtilityTree

          // clear parent group class name
          treeString = treeString.replace(/(group)(?!-)/gm, ' ')

          // clear group modifier classes from @apply
          subTreeString = subTreeString.replace(
            / group-([a-z0-9]+):([a-z0-9-:\/]+)/gm,
            ''
          )
        }
      }

      let peerUtilityTree = ''

      // convert peer utilities
      if (node.filterAttributes?.class?.match(/(peer)(?!-)/gm)) {
        peerUtilityTree = peerUtilityToSass(nodeTree, className)

        if (peerUtilityTree !== '') {
          // clear parent group class name
          treeString = treeString.replace(/(peer)(?!-)/gm, ' ')
        }
      }

      sassTree += `${classComment}${peerUtilityTree}
          ${className} {
            ${treeString} ${subTreeString}
          }`
    }

    return null
  })

  return sassTree
}

/**
 * Get ready to use HTML tree
 *
 * @param {IHtmlNode} nodeTree
 *
 * @returns string
 */
function getHtmlTree(nodeTree: IHtmlNode[]): string {
  if (nodeTree) {
    let htmlTree = ''

    nodeTree.forEach(function (node: IHtmlNode, index) {
      const className = getClassName(node, node.order)

      if (node.type == 'element' && node.tagName != 'style') {
        if (_defaultOptions.printHtmlComments) {
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

        // inner text

        const textChildNodes = node.children?.filter(
          (child) => child.type === 'text'
        )

        const innerText =
          node.children?.length == textChildNodes?.length
            ? textChildNodes.map((child) => child.content).join('')
            : ''

        // inner text
        htmlTree += innerText ? `\n${innerText}\n` : ''

        const hasSubElement = node.children?.filter(
          (child) => child.type === 'element'
        ).length

        // sub tree
        if (hasSubElement) {
          htmlTree += getHtmlTree(node.children)
        }

        // prevent new line for siblings
        let isNextNodeSibling = false

        if (!hasSubElement && nodeTree[index + 1]) {
          isNextNodeSibling =
            nodeTree[index + 1].tagName === node.tagName &&
            nodeTree[index + 1].comment === null
        }

        htmlTree +=
          (!isVoidElement ? `</${node.tagName}>` : '') +
          (!isNextNodeSibling ? '\n' : '')
      } else if (node.type == 'text') {
        htmlTree += node.content ? `\n${node.content}\n` : ''
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
  styles = []

  if (html && html.length) {
    if (options) {
      _defaultOptions = {
        ...defaultOptions,
        ...options,
      }
    }

    html = Utils.cleanText(html)

    const htmlJson: IHtmlNode[] = parse(html)

    const filteredHtmlData = filterHtmlData(htmlJson)

    if (filteredHtmlData) {
      let sassTreeResult = getSassTree(filteredHtmlData),
        htmlTreeResult = ''

      if (sassTreeResult) {
        sassTreeResult = sassTreeResult.replace(
          / peer-([a-z0-9]+):([a-z0-9-:\/]+)/gm,
          ''
        )

        htmlTreeResult = getHtmlTree(filteredHtmlData)

        const cssTreeResult = getCssTree(styles)

        sassTreeResult = cssTreeResult + sassTreeResult
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
