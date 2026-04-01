export function useIsMobile(breakpoint: number = 768) {
  const isMobile = ref(false)

  if (import.meta.client) {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    isMobile.value = mql.matches

    const handler = (e: MediaQueryListEvent) => {
      isMobile.value = e.matches
    }

    onMounted(() => mql.addEventListener('change', handler))
    onUnmounted(() => mql.removeEventListener('change', handler))
  }

  return isMobile
}
