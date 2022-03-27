import { CSSBeautifyOptions } from 'js-beautify'
import { IClassNameOptions } from './classname-options'

export interface ITwToSassOptions {
  formatOutput: boolean
  formatterOptions: CSSBeautifyOptions
  printHtmlComments: boolean
  printSassComments: boolean
  useCommentBlocksAsClassName: boolean
  maxClassNameLength: number
  classNameOptions: IClassNameOptions
  preventDuplicateClasses: boolean
  orderByTailwindClasses: boolean
}
