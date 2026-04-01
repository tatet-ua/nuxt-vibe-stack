// Відновлення стану з localStorage ПІСЛЯ гідрації Pinia
// .client.ts — працює тільки на клієнті

export default defineNuxtPlugin({
  name: 'restore-layout',
  hooks: {
    'app:created'() {
      // Layout панелі
      const appStore = useAppStore()
      try {
        const raw = localStorage.getItem('app-layout-state')
        if (raw) {
          const saved = JSON.parse(raw)
          if (typeof saved.sidebarOpen === 'boolean') appStore.sidebarOpen = saved.sidebarOpen
          if (typeof saved.asideOpen === 'boolean') appStore.asideOpen = saved.asideOpen
        }
      } catch { /* ignore */ }

      // Розгорнуті папки дерева
      const documentStore = useDocumentStore()
      try {
        const raw = localStorage.getItem('document-tree-state')
        if (raw) {
          documentStore.expandedIds = new Set(JSON.parse(raw))
        }
      } catch { /* ignore */ }
    },
  },
})
