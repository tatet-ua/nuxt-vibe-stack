<script setup lang="ts">
import { toast } from 'vue-sonner'
import { ref } from 'vue'

useHead({ title: 'Примеры компонентов' })

const dialogOpen = ref(false)
const sheetOpen = ref(false)
const activeTab = ref('buttons')
const currentPage = ref(1)
</script>

<template>
  <div class="container mx-auto py-10 space-y-10">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Примеры компонентов</h1>
      <p class="text-muted-foreground mt-1">shadcn-vue · button, dialog, sheet, tabs, table, pagination, sonner</p>
    </div>

    <UiTabs v-model="activeTab">
      <UiTabsList>
        <UiTabsTrigger value="buttons">Button</UiTabsTrigger>
        <UiTabsTrigger value="dialog">Dialog</UiTabsTrigger>
        <UiTabsTrigger value="sheet">Sheet</UiTabsTrigger>
        <UiTabsTrigger value="table">Table + Pagination</UiTabsTrigger>
        <UiTabsTrigger value="sonner">Sonner</UiTabsTrigger>
      </UiTabsList>

      <!-- Buttons -->
      <UiTabsContent value="buttons" class="space-y-4 pt-4">
        <h2 class="text-lg font-semibold">Button variants</h2>
        <div class="flex flex-wrap gap-3">
          <UiButton>Default</UiButton>
          <UiButton variant="secondary">Secondary</UiButton>
          <UiButton variant="outline">Outline</UiButton>
          <UiButton variant="ghost">Ghost</UiButton>
          <UiButton variant="link">Link</UiButton>
          <UiButton variant="destructive">Destructive</UiButton>
        </div>
        <h2 class="text-lg font-semibold">Button sizes</h2>
        <div class="flex flex-wrap items-center gap-3">
          <UiButton size="sm">Small</UiButton>
          <UiButton size="default">Default</UiButton>
          <UiButton size="lg">Large</UiButton>
        </div>
      </UiTabsContent>

      <!-- Dialog -->
      <UiTabsContent value="dialog" class="space-y-4 pt-4">
        <h2 class="text-lg font-semibold">Dialog</h2>
        <UiButton @click="dialogOpen = true">Открыть Dialog</UiButton>
        <UiDialog v-model:open="dialogOpen">
          <UiDialogContent>
            <UiDialogHeader>
              <UiDialogTitle>Пример Dialog</UiDialogTitle>
              <UiDialogDescription>
                Это модальное окно на базе UiDialog (shadcn-vue).
              </UiDialogDescription>
            </UiDialogHeader>
            <div class="py-4">Основной контент диалога.</div>
            <UiDialogFooter>
              <UiButton variant="outline" @click="dialogOpen = false">Отмена</UiButton>
              <UiButton @click="dialogOpen = false">Подтвердить</UiButton>
            </UiDialogFooter>
          </UiDialogContent>
        </UiDialog>
      </UiTabsContent>

      <!-- Sheet -->
      <UiTabsContent value="sheet" class="space-y-4 pt-4">
        <h2 class="text-lg font-semibold">Sheet (боковая панель)</h2>
        <UiButton @click="sheetOpen = true">Открыть Sheet</UiButton>
        <UiSheet v-model:open="sheetOpen">
          <UiSheetContent>
            <UiSheetHeader>
              <UiSheetTitle>Пример Sheet</UiSheetTitle>
              <UiSheetDescription>
                Боковая панель на базе UiSheet (shadcn-vue).
              </UiSheetDescription>
            </UiSheetHeader>
            <div class="py-4">Контент боковой панели.</div>
          </UiSheetContent>
        </UiSheet>
      </UiTabsContent>

      <!-- Table + Pagination -->
      <UiTabsContent value="table" class="space-y-4 pt-4">
        <h2 class="text-lg font-semibold">Table</h2>
        <UiTable>
          <UiTableHeader>
            <UiTableRow>
              <UiTableHead>Имя</UiTableHead>
              <UiTableHead>Email</UiTableHead>
              <UiTableHead>Роль</UiTableHead>
            </UiTableRow>
          </UiTableHeader>
          <UiTableBody>
            <UiTableRow v-for="i in 5" :key="i">
              <UiTableCell>Пользователь {{ i }}</UiTableCell>
              <UiTableCell>user{{ i }}@example.com</UiTableCell>
              <UiTableCell>Admin</UiTableCell>
            </UiTableRow>
          </UiTableBody>
        </UiTable>

        <h2 class="text-lg font-semibold">Pagination</h2>
        <UiPagination v-model:page="currentPage" :total="100" :items-per-page="10" :sibling-count="1">
          <UiPaginationContent>
            <UiPaginationItem>
              <UiPaginationFirst />
            </UiPaginationItem>
            <UiPaginationItem>
              <UiPaginationPrevious />
            </UiPaginationItem>
            <UiPaginationItem>
              <UiPaginationNext />
            </UiPaginationItem>
            <UiPaginationItem>
              <UiPaginationLast />
            </UiPaginationItem>
          </UiPaginationContent>
        </UiPagination>
        <p class="text-sm text-muted-foreground">Текущая страница: {{ currentPage }}</p>
      </UiTabsContent>

      <!-- Sonner -->
      <UiTabsContent value="sonner" class="space-y-4 pt-4">
        <h2 class="text-lg font-semibold">Sonner (уведомления)</h2>
        <div class="flex flex-wrap gap-3">
          <UiButton @click="toast('Обычное уведомление')">Default</UiButton>
          <UiButton variant="secondary" @click="toast.success('Успешно!')">Success</UiButton>
          <UiButton variant="destructive" @click="toast.error('Ошибка!')">Error</UiButton>
          <UiButton variant="outline" @click="toast.warning('Предупреждение!')">Warning</UiButton>
          <UiButton variant="outline" @click="toast.info('Информация')">Info</UiButton>
        </div>
      </UiTabsContent>
    </UiTabs>
  </div>
</template>
