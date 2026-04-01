import { defineStore } from 'pinia'

const STORAGE_KEY = 'document-tree-state'

export const useDocumentStore = defineStore('document', () => {
  const selectedDocumentId = ref<string | null>(null)
  const expandedIds = ref<Set<string>>(new Set())

  const isEditing = computed(() => selectedDocumentId.value !== null)

  function selectDocument(id: string | null) {
    selectedDocumentId.value = id
  }

  function toggleExpanded(id: string) {
    const next = new Set(expandedIds.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    expandedIds.value = next
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
    }
  }

  function expandAll(ids: string[]) {
    expandedIds.value = new Set(ids)
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    }
  }

  function collapseAll() {
    expandedIds.value = new Set()
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, '[]')
    }
  }

  return {
    selectedDocumentId,
    expandedIds,
    isEditing,
    selectDocument,
    toggleExpanded,
    expandAll,
    collapseAll,
  }
})
