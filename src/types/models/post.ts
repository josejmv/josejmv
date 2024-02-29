export type PostDataType = {
  id: number
  title: string
  picture: string
  content: string
  category: string
  assets?: { url: string; order: number; tooltip?: string }[]
}

export type CategoryDataType = {
  url: string
} & PostDataType
