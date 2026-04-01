import { defineStore } from 'pinia'

const STORAGE_KEY = 'app-layout-state'

export const useAppStore = defineStore('app', () => {
  const isDark = ref(false)
  const sidebarOpen = ref(true)
  const asideOpen = ref(false)

  const mobileSidebarOpen = ref(false)
  const mobileAsideOpen = ref(false)

  function toggleDark() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function toggleAside() {
    asideOpen.value = !asideOpen.value
  }

  // Зберігаємо стан панелей при зміні
  if (import.meta.client) {
    watch([sidebarOpen, asideOpen], () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        sidebarOpen: sidebarOpen.value,
        asideOpen: asideOpen.value,
      }))
    })
  }

  return {
    isDark,
    sidebarOpen,
    asideOpen,
    mobileSidebarOpen,
    mobileAsideOpen,
    toggleDark,
    toggleSidebar,
    toggleAside,
  }
})
