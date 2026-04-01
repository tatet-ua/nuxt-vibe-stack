export type DocumentType = 'page' | 'folder' | 'article'
export type DocumentStatus = 'published' | 'hidden' | 'draft'

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  published: 'Опубліковано',
  hidden: 'Приховано',
  draft: 'Чернетка',
}

export const DOCUMENT_STATUS_VARIANTS: Record<DocumentStatus, 'default' | 'secondary' | 'outline'> = {
  published: 'default',
  hidden: 'secondary',
  draft: 'outline',
}

export const DOCUMENT_STATUS_COLORS: Record<DocumentStatus, string> = {
  published: 'bg-green-500',
  hidden: 'bg-yellow-500',
  draft: 'bg-gray-400',
}

export interface Document {
  id: string
  parentId: string | null
  type: DocumentType
  title: string
  alias: string
  sort: number
  h1: string
  intro: string
  content: string
  status: DocumentStatus
  robots: boolean
  coverImage: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export interface DocumentTreeRow extends Document {
  depth: number
  hasChildren: boolean
  isExpanded: boolean
  childCount: number
}
