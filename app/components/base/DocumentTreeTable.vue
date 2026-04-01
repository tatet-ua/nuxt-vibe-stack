<script setup lang="ts">
import { ChevronRight, MoreHorizontal, Pencil, Trash2, Search } from 'lucide-vue-next'
import type { DocumentTreeRow } from '~/types/document'
import { DOCUMENT_STATUS_LABELS, DOCUMENT_STATUS_VARIANTS, DOCUMENT_STATUS_COLORS } from '~/types/document'
import { getDocumentIcon } from '~/composables/useDocumentIcon'
import { formatDate } from '~/composables/useFormatDate'

const props = defineProps<{
  rows: DocumentTreeRow[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
  toggleExpand: [id: string]
  delete: [id: string]
}>()

const search = defineModel<string>('search', { default: '' })

</script>

<template>
  <div class="space-y-4">
    <!-- Поиск -->
    <div class="relative max-w-sm">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <UiInput
        v-model="search"
        placeholder="Пошук сторінок..."
        class="pl-9"
      />
    </div>

    <!-- Таблица -->
    <div class="rounded-md border">
      <UiTable>
        <UiTableHeader>
          <UiTableRow>
            <UiTableHead class="min-w-[280px]">Структура</UiTableHead>
            <UiTableHead>Alias</UiTableHead>
            <UiTableHead class="w-16 text-center">Сорт.</UiTableHead>
            <UiTableHead>Створено</UiTableHead>
            <UiTableHead>Оновлено</UiTableHead>
            <UiTableHead class="w-20 text-center">Robots</UiTableHead>
            <UiTableHead>Статус</UiTableHead>
            <UiTableHead class="w-10" />
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody>
          <!-- Loading skeleton -->
          <template v-if="isLoading">
            <UiTableRow v-for="i in 8" :key="i">
              <UiTableCell v-for="j in 8" :key="j">
                <div class="h-4 bg-muted animate-pulse rounded" />
              </UiTableCell>
            </UiTableRow>
          </template>

          <!-- Data -->
          <template v-else-if="rows.length">
            <UiTableRow
              v-for="row in rows"
              :key="row.id"
              class="cursor-pointer hover:bg-muted/50"
              @click="emit('select', row.id)"
            >
              <!-- Структура (icon + indent + name) -->
              <UiTableCell>
                <div class="flex items-center gap-1.5" :style="{ paddingLeft: `${row.depth * 24}px` }">
                  <!-- Expand/collapse -->
                  <button
                    v-if="row.hasChildren"
                    class="size-5 flex items-center justify-center rounded hover:bg-accent cursor-pointer"
                    @click.stop="emit('toggleExpand', row.id)"
                  >
                    <ChevronRight
                      class="size-3.5 transition-transform duration-150"
                      :class="{ 'rotate-90': row.isExpanded }"
                    />
                  </button>
                  <div v-else class="size-5" />

                  <!-- Icon -->
                  <component :is="getDocumentIcon(row)" class="size-4 shrink-0 text-muted-foreground" />

                  <!-- Title -->
                  <span class="font-medium truncate">{{ row.title }}</span>
                </div>
              </UiTableCell>

              <!-- Alias -->
              <UiTableCell class="text-muted-foreground text-sm">
                {{ row.alias }}
              </UiTableCell>

              <!-- Sort -->
              <UiTableCell class="text-center text-muted-foreground text-sm">
                {{ row.sort }}
              </UiTableCell>

              <!-- Created -->
              <UiTableCell class="text-muted-foreground text-sm">
                {{ formatDate(row.createdAt) }}
              </UiTableCell>

              <!-- Updated -->
              <UiTableCell class="text-muted-foreground text-sm">
                {{ formatDate(row.updatedAt) }}
              </UiTableCell>

              <!-- Robots -->
              <UiTableCell class="text-center">
                <span :class="row.robots ? 'text-green-600' : 'text-muted-foreground'">
                  {{ row.robots ? '✓' : '—' }}
                </span>
              </UiTableCell>

              <!-- Status -->
              <UiTableCell>
                <div class="flex items-center gap-2">
                  <span class="size-2 rounded-full shrink-0" :class="DOCUMENT_STATUS_COLORS[row.status]" />
                  <UiBadge :variant="DOCUMENT_STATUS_VARIANTS[row.status]">
                    {{ DOCUMENT_STATUS_LABELS[row.status] }}
                  </UiBadge>
                </div>
              </UiTableCell>

              <!-- Actions -->
              <UiTableCell>
                <UiDropdownMenu>
                  <UiDropdownMenuTrigger as-child>
                    <UiButton variant="ghost" size="sm" class="size-8 p-0 cursor-pointer" @click.stop>
                      <MoreHorizontal class="size-4" />
                    </UiButton>
                  </UiDropdownMenuTrigger>
                  <UiDropdownMenuContent align="end">
                    <UiDropdownMenuItem class="cursor-pointer" @click.stop="emit('select', row.id)">
                      <Pencil class="size-4 mr-2" />
                      Редагувати
                    </UiDropdownMenuItem>
                    <UiDropdownMenuSeparator />
                    <UiDropdownMenuItem class="text-destructive cursor-pointer" @click.stop="emit('delete', row.id)">
                      <Trash2 class="size-4 mr-2" />
                      Видалити
                    </UiDropdownMenuItem>
                  </UiDropdownMenuContent>
                </UiDropdownMenu>
              </UiTableCell>
            </UiTableRow>
          </template>

          <!-- Empty -->
          <template v-else>
            <UiTableRow>
              <UiTableCell :colspan="8" class="h-24 text-center text-muted-foreground">
                Немає документів
              </UiTableCell>
            </UiTableRow>
          </template>
        </UiTableBody>
      </UiTable>
    </div>
  </div>
</template>
