<script setup lang="ts">
import { toast } from 'vue-sonner'

useHead({ title: 'Главная' })
</script>

<template>
  <div class="container mx-auto py-10 space-y-6">
    <h1 class="text-3xl font-bold tracking-tight">Nuxt Vibe Stack</h1>
    <p class="text-muted-foreground">
      Nuxt 4 · Tailwind v4 · shadcn-vue · Pinia · TanStack
    </p>

    <div class="flex gap-3 flex-wrap">
      <UiButton @click="toast.success('Стек работает!')">
        Проверить Toast
      </UiButton>

      <UiButton variant="outline" as-child>
        <NuxtLink to="/demo">Примеры компонентов →</NuxtLink>
      </UiButton>
    </div>
  </div>
</template>
