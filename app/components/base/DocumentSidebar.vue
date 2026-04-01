<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { Calendar, User, Hash, ImagePlus } from 'lucide-vue-next'
import type { DocumentStatus } from '~/types/document'
import { fetchDocumentById, updateDocument } from '~/composables/useMockDocuments'
import { formatDate } from '~/composables/useFormatDate'

const props = defineProps<{
  documentId: string
}>()

const queryClient = useQueryClient()

const { data: document } = useQuery({
  queryKey: computed(() => ['documents', props.documentId]),
  queryFn: () => fetchDocumentById(props.documentId),
})

const statusMutation = useMutation({
  mutationFn: (status: DocumentStatus) => updateDocument(props.documentId, { status }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['documents'] })
    toast.success('Статус оновлено')
  },
})


const activeSection = ref('description')

const sections = [
  { id: 'description', label: 'Опис' },
  { id: 'seo', label: 'SEO' },
  { id: 'faq', label: 'Часті запитання' },
  { id: 'related', label: 'Близькі за темою' },
  { id: 'settings', label: 'Налаштування' },
  { id: 'misc', label: 'Різне' },
  { id: 'history', label: 'Історія' },
]
</script>

<template>
  <div v-if="document" class="space-y-5">
    <!-- Статус публікації -->
    <div class="space-y-2">
      <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Статус публікації
      </span>
      <UiSelect
        :model-value="document.status"
        @update:model-value="(v: DocumentStatus) => statusMutation.mutate(v)"
      >
        <UiSelectTrigger class="cursor-pointer">
          <UiSelectValue />
        </UiSelectTrigger>
        <UiSelectContent>
          <UiSelectItem value="published" class="cursor-pointer">Опубліковано</UiSelectItem>
          <UiSelectItem value="hidden" class="cursor-pointer">Приховано</UiSelectItem>
          <UiSelectItem value="draft" class="cursor-pointer">Чернетка</UiSelectItem>
        </UiSelectContent>
      </UiSelect>
      <p class="text-xs text-muted-foreground">
        {{ document.status === 'published' ? 'Відображається на сайті та в пошуку' : document.status === 'hidden' ? 'Доступ тільки за прямим посиланням' : 'Не опубліковано' }}
      </p>
    </div>

    <UiSeparator />

    <!-- Розділи -->
    <div class="space-y-1">
      <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Розділи
      </span>
      <div class="space-y-0.5 pt-1">
        <button
          v-for="section in sections"
          :key="section.id"
          class="flex items-center w-full px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors"
          :class="activeSection === section.id
            ? 'bg-accent text-accent-foreground font-medium'
            : 'text-muted-foreground hover:bg-accent/50'"
          @click="activeSection = section.id"
        >
          {{ section.label }}
        </button>
      </div>
    </div>

    <UiSeparator />

    <!-- Планування -->
    <div class="space-y-2">
      <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Планування
      </span>
      <div class="space-y-1.5 text-sm">
        <div class="flex items-center gap-2">
          <Calendar class="size-3.5 text-muted-foreground" />
          <span class="text-muted-foreground">Публікація:</span>
          <span>{{ document.publishedAt ? formatDate(document.publishedAt) : '—' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Calendar class="size-3.5 text-muted-foreground" />
          <span class="text-muted-foreground">Оновлення:</span>
          <span>{{ formatDate(document.updatedAt) }}</span>
        </div>
      </div>
    </div>

    <UiSeparator />

    <!-- Обкладинка -->
    <div class="space-y-2">
      <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Обкладинка
      </span>
      <div class="border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 text-muted-foreground">
        <ImagePlus class="size-8" />
        <span class="text-xs">Завантажити зображення</span>
        <span class="text-xs">JPG, PNG, SVG до 2MB</span>
      </div>
    </div>

    <UiSeparator />

    <!-- Інформація -->
    <div class="space-y-2">
      <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Інформація
      </span>
      <div class="space-y-1.5 text-sm">
        <div class="flex items-center gap-2">
          <Hash class="size-3.5 text-muted-foreground" />
          <span class="text-muted-foreground">ID:</span>
          <span>{{ document.id }}</span>
        </div>
        <div class="flex items-center gap-2">
          <User class="size-3.5 text-muted-foreground" />
          <span class="text-muted-foreground">Автор:</span>
          <span>Admin</span>
        </div>
        <div class="flex items-center gap-2">
          <Calendar class="size-3.5 text-muted-foreground" />
          <span class="text-muted-foreground">Створено:</span>
          <span>{{ formatDate(document.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
