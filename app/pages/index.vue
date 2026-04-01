<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Users, LayoutPanelLeft, FileText, FolderTree, ArrowRight } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Главная' })
</script>

<template>
  <div class="p-6 space-y-8">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">Nuxt Vibe Stack</h1>
      <p class="text-muted-foreground mt-1">
        Nuxt 4 · Tailwind v4 · shadcn-vue · Pinia · TanStack
      </p>
    </div>

    <!-- Карточки-ссылки -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink to="/users" class="group">
        <UiCard class="transition-colors hover:border-primary/50 cursor-pointer">
          <UiCardHeader>
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center size-10 rounded-lg bg-primary/10">
                <Users class="size-5 text-primary" />
              </div>
              <div>
                <UiCardTitle class="text-base">CRUD-таблица</UiCardTitle>
                <UiCardDescription>Пользователи с пагинацией</UiCardDescription>
              </div>
            </div>
          </UiCardHeader>
          <UiCardContent>
            <p class="text-sm text-muted-foreground">
              TanStack Table + Query, сортировка, поиск, удаление с подтверждением
            </p>
          </UiCardContent>
          <UiCardFooter>
            <span class="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Открыть <ArrowRight class="size-3" />
            </span>
          </UiCardFooter>
        </UiCard>
      </NuxtLink>

      <div class="group">
        <UiCard class="transition-colors hover:border-primary/50 cursor-pointer" @click="toast.info('Вы уже внутри admin layout с панелями!')">
          <UiCardHeader>
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center size-10 rounded-lg bg-primary/10">
                <LayoutPanelLeft class="size-5 text-primary" />
              </div>
              <div>
                <UiCardTitle class="text-base">Layout с панелями</UiCardTitle>
                <UiCardDescription>Resizable sidebar / main / aside</UiCardDescription>
              </div>
            </div>
          </UiCardHeader>
          <UiCardContent>
            <p class="text-sm text-muted-foreground">
              Движущиеся панели, сворачивание, мобильные overlay. Попробуйте потянуть разделители
            </p>
          </UiCardContent>
          <UiCardFooter>
            <span class="text-sm text-muted-foreground">Текущий layout</span>
          </UiCardFooter>
        </UiCard>
      </div>

      <NuxtLink to="/documents" class="group">
        <UiCard class="transition-colors hover:border-primary/50 cursor-pointer">
          <UiCardHeader>
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center size-10 rounded-lg bg-primary/10">
                <FolderTree class="size-5 text-primary" />
              </div>
              <div>
                <UiCardTitle class="text-base">Дерево документів</UiCardTitle>
                <UiCardDescription>Ієрархія з редагуванням</UiCardDescription>
              </div>
            </div>
          </UiCardHeader>
          <UiCardContent>
            <p class="text-sm text-muted-foreground">
              Дерево-таблиця, split-pane редактор, aside з метаданими
            </p>
          </UiCardContent>
          <UiCardFooter>
            <span class="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Відкрити <ArrowRight class="size-3" />
            </span>
          </UiCardFooter>
        </UiCard>
      </NuxtLink>

      <NuxtLink to="/demo" class="group">
        <UiCard class="transition-colors hover:border-primary/50 cursor-pointer">
          <UiCardHeader>
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center size-10 rounded-lg bg-primary/10">
                <FileText class="size-5 text-primary" />
              </div>
              <div>
                <UiCardTitle class="text-base">Компоненты</UiCardTitle>
                <UiCardDescription>Примеры shadcn-vue</UiCardDescription>
              </div>
            </div>
          </UiCardHeader>
          <UiCardContent>
            <p class="text-sm text-muted-foreground">
              Button, Dialog, Sheet, Table, Pagination, Sonner — демо всех компонентов
            </p>
          </UiCardContent>
          <UiCardFooter>
            <span class="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Открыть <ArrowRight class="size-3" />
            </span>
          </UiCardFooter>
        </UiCard>
      </NuxtLink>
    </div>

    <!-- Быстрый тест -->
    <div class="flex gap-3">
      <UiButton class="cursor-pointer" @click="toast.success('Стек работает!')">
        Проверить Toast
      </UiButton>
    </div>
  </div>
</template>
