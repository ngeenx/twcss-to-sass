export interface IAttribute {
  style: string | null
  class: string | null
}

export interface IHtmlNodeAttribute {
  key: string
  value: string
}

export interface IHtmlNode {
  type: string
  tagName: string
  content: string
  comment: string
  order: number
  attributes: IHtmlNodeAttribute[] | null
  filterAttributes: IAttribute | null
  sassClassName: string
  children: this[]
  length: number
}
