import { defineStore } from 'pinia'

// Пример Pinia store
// Использование: const appStore = useAppStore()

export const useAppStore = defineStore('app', () => {
  const isDark = ref(false)
  const sidebarOpen = ref(false)

  function toggleDark() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  return {
    isDark,
    sidebarOpen,
    toggleDark,
    toggleSidebar,
  }
})
