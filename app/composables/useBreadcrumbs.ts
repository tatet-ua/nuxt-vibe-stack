interface BreadcrumbItem {
  label: string
  to?: string
}

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Главная',
  '/users': 'Пользователи',
  '/documents': 'Документи',
  '/demo': 'Компоненти',
}

export function useBreadcrumbs() {
  const route = useRoute()

  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const path = route.path
    if (path === '/') return [{ label: 'Главная' }]

    const items: BreadcrumbItem[] = [{ label: 'Главная', to: '/' }]

    const segments = path.split('/').filter(Boolean)
    let currentPath = ''

    for (const segment of segments) {
      currentPath += `/${segment}`
      const label = ROUTE_LABELS[currentPath] ?? segment
      items.push({
        label,
        to: currentPath === path ? undefined : currentPath,
      })
    }

    return items
  })

  return { breadcrumbs }
}
