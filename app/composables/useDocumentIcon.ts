import { Home, Folder, FolderOpen, FileText, Newspaper } from 'lucide-vue-next'
import type { DocumentTreeRow } from '~/types/document'
import type { FunctionalComponent } from 'vue'

export function getDocumentIcon(row: DocumentTreeRow): FunctionalComponent {
  if (row.alias === 'general') return Home
  if (row.type === 'folder') return row.isExpanded ? FolderOpen : Folder
  if (row.type === 'article') return Newspaper
  return FileText
}
