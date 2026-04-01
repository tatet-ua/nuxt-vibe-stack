<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import type { DocumentTreeRow } from '~/types/document'
import { getDocumentIcon } from '~/composables/useDocumentIcon'

defineProps<{
  rows: DocumentTreeRow[]
  selectedId: string | null
}>()

const emit = defineEmits<{
  select: [id: string]
  toggleExpand: [id: string]
}>()

</script>

<template>
  <div class="h-full flex flex-col border-r">
    <div class="p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b">
      Дерево сторінок
    </div>
    <div class="flex-1 overflow-auto py-1">
      <div
        v-for="row in rows"
        :key="row.id"
        class="flex items-center gap-1 px-2 py-1.5 text-sm cursor-pointer transition-colors"
        :class="row.id === selectedId
          ? 'bg-accent text-accent-foreground font-medium'
          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'"
        :style="{ paddingLeft: `${row.depth * 16 + 8}px` }"
        @click="emit('select', row.id)"
      >
        <!-- Expand/collapse -->
        <button
          v-if="row.hasChildren"
          class="size-4 flex items-center justify-center rounded hover:bg-accent cursor-pointer shrink-0"
          @click.stop="emit('toggleExpand', row.id)"
        >
          <ChevronRight
            class="size-3 transition-transform duration-150"
            :class="{ 'rotate-90': row.isExpanded }"
          />
        </button>
        <div v-else class="size-4 shrink-0" />

        <component :is="getDocumentIcon(row)" class="size-3.5 shrink-0" />
        <span class="truncate">{{ row.title }}</span>
        <span class="ml-auto text-xs text-muted-foreground truncate">{{ row.alias }}</span>
      </div>
    </div>
  </div>
</template>
