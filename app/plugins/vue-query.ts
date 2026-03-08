// plugins/vue-query.ts
// Подключение TanStack Vue Query к Nuxt

import { VueQueryPlugin, QueryClient, hydrate, dehydrate } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxt) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 минут
        refetchOnWindowFocus: false,
      },
    },
  })

  // SSR: дегидратация на сервере, гидратация на клиенте
  const vueQueryState = useState('vue-query')

  if (import.meta.server) {
    nuxt.hooks.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient)
    })
  }

  if (import.meta.client) {
    hydrate(queryClient, vueQueryState.value)
  }

  nuxt.vueApp.use(VueQueryPlugin, { queryClient })
})
