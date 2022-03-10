import { CSSBeautifyOptions } from 'js-beautify'
import { IClassNameOptions } from './classname-options'

export interface ITwToSassOptions {
  formatOutput: boolean
  formatterOptions: CSSBeautifyOptions
  printComments: boolean
  useCommentBlocksAsClassName: boolean
  maxClassNameLength: number
  classNameOptions: IClassNameOptions
}
