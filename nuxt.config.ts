import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  // ─── Модули ───────────────────────────────────────────
  modules: [
    '@pinia/nuxt',
    'shadcn-nuxt',
  ],

  // ─── shadcn-vue ───────────────────────────────────────
  // Используем префикс 'Ui' → UiButton, UiSheet, UiDialog
  // НЕ менять prefix без обновления CLAUDE.md
  shadcn: {
    prefix: 'Ui',
    componentDir: './app/components/ui',
  },

  // ─── CSS ──────────────────────────────────────────────
  // НЕ использовать @nuxtjs/tailwindcss — он в альфе для v4
  // Только @tailwindcss/vite напрямую
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // ─── TypeScript ───────────────────────────────────────
  typescript: {
    strict: true,
    typeCheck: false, // включить когда нужен CI typecheck
  },

  // ─── Nuxt 4 ───────────────────────────────────────────
  future: {
    compatibilityVersion: 4,
  },
})
