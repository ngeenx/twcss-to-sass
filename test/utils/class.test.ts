import ClassUtils from '../../src/utils/class'

import { IHtmlNode } from '../../src/interfaces/html-node'
import { ITwToSassOptions } from '../../src/interfaces/tw-to-sass-options'

test('class utility get class name', () => {
  const node = <IHtmlNode>{
      tagName: 'div',
      comment: 'Some Div',
      hasElementChildren: false,
    },
    expected = '.pre_some_div_suf'

  const converterConfigs = <ITwToSassOptions>{
    useCommentBlocksAsClassName: true,
    printSassComments: true,
    orderByTailwindClasses: false,
    classNameOptions: {
      lowercase: true,
      replacement: '_',
      prefix: 'pre_',
      suffix: '_suf',
    },
  }

  const result = ClassUtils.getClassName(node, 1, converterConfigs)

  expect(expected).toBe(result)
})

test('class utility order utility classes', () => {
  const content =
      'flex items-center justify-center w-full px-4 py-2 space-x-1 font-medium tracking-wider uppercase bg-gray-100 border rounded-md focus:outline-none focus:ring',
    result =
      'bg-gray-100 border flex focus:outline-none focus:ring font-medium items-center justify-center px-4 py-2 rounded-md space-x-1 tracking-wider uppercase w-full'

  expect(ClassUtils.orderClasses(content)).toBe(result)
})
