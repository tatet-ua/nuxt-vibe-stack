<script setup lang="ts">
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderTree,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Menu,
  Settings,
} from 'lucide-vue-next'

const appStore = useAppStore()
const route = useRoute()
const isMobile = useIsMobile()

const navItems = [
  { to: '/', label: 'Главная', icon: LayoutDashboard },
  { to: '/users', label: 'Пользователи', icon: Users },
  { to: '/documents', label: 'Документи', icon: FolderTree },
  { to: '/demo', label: 'Компоненты', icon: FileText },
]
</script>

<template>
  <div class="h-screen flex flex-col bg-background">
    <!-- Хедер -->
    <header class="flex items-center justify-between h-12 px-4 border-b bg-background shrink-0">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <UiButton
            v-if="isMobile"
            variant="ghost" size="sm" class="cursor-pointer"
            @click="appStore.mobileSidebarOpen = true"
          >
            <Menu class="size-4" />
          </UiButton>
          <UiButton
            v-else
            variant="ghost" size="sm" class="cursor-pointer"
            @click="appStore.toggleSidebar()"
          >
            <PanelLeftOpen v-if="!appStore.sidebarOpen" class="size-4" />
            <PanelLeftClose v-else class="size-4" />
          </UiButton>
          <span class="font-semibold text-sm">Nuxt Vibe Stack</span>
        </div>
        <UiSeparator orientation="vertical" class="h-5" />
        <BaseBreadcrumbs />
      </div>
      <div class="flex items-center gap-1">
        <UiButton
          v-if="!isMobile"
          variant="ghost" size="sm" class="cursor-pointer"
          @click="appStore.toggleAside()"
        >
          <PanelRightOpen v-if="!appStore.asideOpen" class="size-4" />
          <PanelRightClose v-else class="size-4" />
        </UiButton>
        <UiButton
          v-if="isMobile"
          variant="ghost" size="sm" class="cursor-pointer"
          @click="appStore.mobileAsideOpen = true"
        >
          <Settings class="size-4" />
        </UiButton>
      </div>
    </header>

    <!-- Desktop: Resizable Panels -->
    <ClientOnly>
    <div v-if="!isMobile" class="flex-1 overflow-hidden">
      <UiResizablePanelGroup direction="horizontal">
        <!-- Sidebar -->
        <template v-if="appStore.sidebarOpen">
          <UiResizablePanel :default-size="20" :min-size="14" :max-size="28">
            <nav class="h-full flex flex-col border-r bg-muted/30">
              <div class="p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Навигация
              </div>
              <div class="flex-1 px-2 space-y-0.5">
                <NuxtLink
                  v-for="item in navItems"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer"
                  :class="route.path === item.to
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'"
                >
                  <component :is="item.icon" class="size-4 shrink-0" />
                  {{ item.label }}
                </NuxtLink>
              </div>
            </nav>
          </UiResizablePanel>
          <UiResizableHandle with-handle />
        </template>

        <!-- Main -->
        <UiResizablePanel :default-size="appStore.sidebarOpen ? 80 : 100">
          <main class="h-full overflow-auto">
            <slot />
          </main>
        </UiResizablePanel>

        <!-- Aside -->
        <template v-if="appStore.asideOpen">
          <UiResizableHandle with-handle />
          <UiResizablePanel :default-size="25" :min-size="15" :max-size="35">
            <aside class="h-full flex flex-col border-l bg-muted/30">
              <div class="p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Детали
              </div>
              <div class="flex-1 p-3 overflow-auto">
                <slot name="aside">
                  <p class="text-sm text-muted-foreground">
                    Выберите элемент для просмотра деталей
                  </p>
                </slot>
              </div>
            </aside>
          </UiResizablePanel>
        </template>
      </UiResizablePanelGroup>
    </div>

    <template #fallback>
      <div class="flex-1 flex items-center justify-center">
        <div class="size-6 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin" />
      </div>
    </template>
    </ClientOnly>

    <!-- Мобілка -->
    <main v-if="isMobile" class="flex-1 overflow-auto">
      <slot />
    </main>

    <UiSheet v-model:open="appStore.mobileSidebarOpen">
      <UiSheetContent side="left" class="w-72 p-0">
        <UiSheetHeader class="p-4 border-b">
          <UiSheetTitle class="text-sm">Навигация</UiSheetTitle>
        </UiSheetHeader>
        <nav class="px-2 py-3 space-y-0.5">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer"
            :class="route.path === item.to
              ? 'bg-accent text-accent-foreground font-medium'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'"
            @click="appStore.mobileSidebarOpen = false"
          >
            <component :is="item.icon" class="size-4 shrink-0" />
            {{ item.label }}
          </NuxtLink>
        </nav>
      </UiSheetContent>
    </UiSheet>

    <UiSheet v-model:open="appStore.mobileAsideOpen">
      <UiSheetContent side="right" class="w-80 p-0">
        <UiSheetHeader class="p-4 border-b">
          <UiSheetTitle class="text-sm">Детали</UiSheetTitle>
        </UiSheetHeader>
        <div class="p-4">
          <slot name="aside">
            <p class="text-sm text-muted-foreground">
              Выберите элемент для просмотра деталей
            </p>
          </slot>
        </div>
      </UiSheetContent>
    </UiSheet>
  </div>
</template>
