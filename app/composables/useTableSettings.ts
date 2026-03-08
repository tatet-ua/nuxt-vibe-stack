// composables/useTableSettings.ts
// Логика сохранения настроек таблицы в localStorage
// Вынесена из компонента — компонент отвечает только за рендер

export interface TableHeader {
  text: string
  value: string
  width?: number
  sortable?: boolean
  visible?: boolean
}

export function useTableSettings(tableId: string, headers: Ref<TableHeader[]>) {
  const STORAGE_KEY = `table_settings_${tableId}`

  const localHeaders = ref<TableHeader[]>([])

  // ─── Загрузка из localStorage ──────────────────────────────────────
  function load(): TableHeader[] | null {
    if (!tableId) return null
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw).headers ?? null
    } catch {
      console.warn(`[useTableSettings] Ошибка чтения для tableId="${tableId}"`)
    }
    return null
  }

  // ─── Сохранение в localStorage ────────────────────────────────────
  function save() {
    if (!tableId) return
    const settings = {
      headers: localHeaders.value.map(h => ({
        value: h.value,
        width: h.width,
        visible: h.visible,
      })),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }

  // ─── Сброс настроек ───────────────────────────────────────────────
  function reset() {
    localStorage.removeItem(STORAGE_KEY)
    localHeaders.value = headers.value.map(h => ({
      ...h,
      visible: h.visible ?? true,
      width: h.width ?? 100,
    }))
  }

  // ─── Инициализация при изменении headers ──────────────────────────
  watch(
    headers,
    (newHeaders) => {
      if (!newHeaders?.length) return

      const saved = load()

      // Клонируем объекты — НЕ мутируем пропсы!
      localHeaders.value = newHeaders.map(h => {
        const s = saved?.find(s => s.value === h.value)
        return {
          ...h,
          visible: s?.visible !== undefined ? s.visible : (h.visible ?? true),
          width: s?.width ?? h.width ?? 100,
        }
      })
    },
    { immediate: true, deep: true },
  )

  const visibleHeaders = computed(() =>
    localHeaders.value.filter(h => h.visible !== false),
  )

  // ─── Действия ─────────────────────────────────────────────────────
  function setVisible(header: TableHeader, value: boolean) {
    const h = localHeaders.value.find(h => h.value === header.value)
    if (h) { h.visible = value; save() }
  }

  function setWidth(header: TableHeader, width: number) {
    const h = localHeaders.value.find(h => h.value === header.value)
    if (h) { h.width = width; save() }
  }

  function showAll() {
    localHeaders.value.forEach(h => (h.visible = true))
    save()
  }

  function hideAll() {
    localHeaders.value.forEach(h => (h.visible = false))
    save()
  }

  function resetWidths() {
    localHeaders.value.forEach(h => (h.width = 100))
    save()
  }

  return {
    localHeaders,
    visibleHeaders,
    save,
    reset,
    setVisible,
    setWidth,
    showAll,
    hideAll,
    resetWidths,
  }
}
