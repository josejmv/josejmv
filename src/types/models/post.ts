export type PostDataType = {
  id: number
  title: string
  picture: string
  content: string
  category: string
}

export type CategoryDataType = {
  url: string
} & PostDataType
