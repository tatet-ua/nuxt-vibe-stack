interface HotKeyBinding {
  key: string
  ctrl?: boolean
  handler: () => void
}

export function useHotKeys(bindings: HotKeyBinding[]) {
  function onKeydown(e: KeyboardEvent) {
    // Не перехоплювати коли фокус в input/textarea/select
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      // Дозволяємо тільки Escape в полях вводу
      if (e.key !== 'Escape') return
    }

    for (const binding of bindings) {
      const ctrlMatch = binding.ctrl ? (e.ctrlKey || e.metaKey) : true
      if (e.key === binding.key && ctrlMatch) {
        e.preventDefault()
        binding.handler()
        return
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
  })
}
