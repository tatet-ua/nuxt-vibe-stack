<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { X, ChevronDown, Save } from 'lucide-vue-next'
import { fetchDocumentById, updateDocument } from '~/composables/useMockDocuments'

const props = defineProps<{
  documentId: string
}>()

const emit = defineEmits<{
  close: []
}>()

const queryClient = useQueryClient()

const { data: document, isLoading } = useQuery({
  queryKey: computed(() => ['documents', props.documentId]),
  queryFn: () => fetchDocumentById(props.documentId),
})

const schema = z.object({
  title: z.string().min(1, 'Обов\'язкове поле'),
  alias: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Лише латиниця, цифри, дефіс'),
  h1: z.string().optional().default(''),
  intro: z.string().optional().default(''),
  content: z.string().optional().default(''),
})

const { handleSubmit, defineField, errors, setValues } = useForm({
  validationSchema: toTypedSchema(schema),
})

const [title, titleAttrs] = defineField('title')
const [alias, aliasAttrs] = defineField('alias')
const [h1, h1Attrs] = defineField('h1')
const [intro, introAttrs] = defineField('intro')
const [content, contentAttrs] = defineField('content')

// Заполняем форму при загрузке документа
watch(document, (doc) => {
  if (doc) {
    setValues({
      title: doc.title,
      alias: doc.alias,
      h1: doc.h1 || '',
      intro: doc.intro || '',
      content: doc.content || '',
    })
  }
}, { immediate: true })

const updateMutation = useMutation({
  mutationFn: (data: z.infer<typeof schema>) => updateDocument(props.documentId, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['documents'] })
    toast.success('Документ збережено')
  },
  onError: () => {
    toast.error('Помилка збереження')
  },
})

const onSubmit = handleSubmit((values) => {
  updateMutation.mutate(values)
})

const sectionOpen = ref(true)

useHotKeys([
  { key: 's', ctrl: true, handler: () => onSubmit() },
  { key: 'Escape', handler: () => emit('close') },
])
const contentTab = ref<'richtext' | 'code'>('richtext')
</script>

<template>
  <div v-if="isLoading" class="p-6 space-y-4">
    <div class="h-6 w-48 bg-muted animate-pulse rounded" />
    <div class="h-10 bg-muted animate-pulse rounded" />
    <div class="h-10 bg-muted animate-pulse rounded" />
    <div class="h-40 bg-muted animate-pulse rounded" />
  </div>

  <div v-else-if="document" class="h-full flex flex-col">
    <!-- Хедер редактора -->
    <div class="flex items-center justify-between px-4 py-2 border-b bg-background shrink-0">
      <div class="flex items-center gap-2 min-w-0">
        <span class="font-medium text-sm truncate">{{ document.title }}</span>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <UiButton
          size="sm"
          class="cursor-pointer"
          :disabled="updateMutation.isPending.value"
          @click="onSubmit"
        >
          <Save class="size-3.5 mr-1.5" />
          {{ updateMutation.isPending.value ? 'Збереження...' : 'Зберегти' }}
        </UiButton>
        <UiButton variant="ghost" size="sm" class="cursor-pointer" @click="emit('close')">
          <X class="size-4" />
        </UiButton>
      </div>
    </div>

    <!-- Форма -->
    <div class="flex-1 overflow-auto">
      <form class="max-w-3xl mx-auto p-6 space-y-6" @submit.prevent="onSubmit">
        <!-- Секция: Заголовок та опис (сворачиваемая) -->
        <div class="border rounded-lg">
          <button
            type="button"
            class="flex items-center justify-between w-full px-4 py-3 text-sm font-medium cursor-pointer hover:bg-muted/50 transition-colors"
            @click="sectionOpen = !sectionOpen"
          >
            Заголовок та опис
            <ChevronDown
              class="size-4 transition-transform duration-200"
              :class="{ '-rotate-180': !sectionOpen }"
            />
          </button>

          <div v-show="sectionOpen" class="px-4 pb-4 space-y-4 border-t">
            <!-- Title -->
            <div class="space-y-2 pt-4">
              <UiLabel for="doc-title">Назва сторінки</UiLabel>
              <UiInput
                id="doc-title"
                v-model="title"
                v-bind="titleAttrs"
                placeholder="Назва документа"
                :class="{ 'border-destructive': errors.title }"
              />
              <p v-if="errors.title" class="text-xs text-destructive">{{ errors.title }}</p>
            </div>

            <!-- Alias -->
            <div class="space-y-2">
              <UiLabel for="doc-alias">Alias (URL)</UiLabel>
              <UiInput
                id="doc-alias"
                v-model="alias"
                v-bind="aliasAttrs"
                placeholder="page-alias"
                :class="{ 'border-destructive': errors.alias }"
              />
              <p v-if="errors.alias" class="text-xs text-destructive">{{ errors.alias }}</p>
            </div>

            <!-- H1 -->
            <div class="space-y-2">
              <UiLabel for="doc-h1">Заголовок (H1)</UiLabel>
              <UiInput
                id="doc-h1"
                v-model="h1"
                v-bind="h1Attrs"
                placeholder="Заголовок статті..."
              />
            </div>

            <!-- Intro -->
            <div class="space-y-2">
              <UiLabel for="doc-intro">Анонс (Інтро)</UiLabel>
              <UiTextarea
                id="doc-intro"
                v-model="intro"
                v-bind="introAttrs"
                placeholder="Короткий опис статті для списків..."
                rows="3"
              />
            </div>
          </div>
        </div>

        <!-- Секция: Вміст -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Вміст (основний текст)</span>
            <div class="flex border rounded-md overflow-hidden">
              <button
                type="button"
                class="px-3 py-1 text-xs cursor-pointer transition-colors"
                :class="contentTab === 'richtext' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
                @click="contentTab = 'richtext'"
              >
                RichText
              </button>
              <button
                type="button"
                class="px-3 py-1 text-xs cursor-pointer transition-colors"
                :class="contentTab === 'code' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
                @click="contentTab = 'code'"
              >
                Code
              </button>
            </div>
          </div>
          <UiTextarea
            v-model="content"
            v-bind="contentAttrs"
            :placeholder="contentTab === 'richtext' ? 'Введіть текст...' : '<p>HTML-код...</p>'"
            rows="12"
            class="font-mono text-sm"
          />
        </div>
      </form>
    </div>
  </div>
</template>
