<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { Plus } from 'lucide-vue-next'
import { fetchDocuments, deleteDocument, buildDocumentTree } from '~/composables/useMockDocuments'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Документи' })

const appStore = useAppStore()
const documentStore = useDocumentStore()
const queryClient = useQueryClient()

const { data: documents, isLoading } = useQuery({
  queryKey: ['documents'],
  queryFn: fetchDocuments,
})

const treeRows = computed(() => {
  if (!documents.value) return []
  return buildDocumentTree(documents.value, documentStore.expandedIds)
})

const searchQuery = ref('')
const filteredRows = computed(() => {
  if (!searchQuery.value) return treeRows.value
  const q = searchQuery.value.toLowerCase()
  return treeRows.value.filter(row =>
    row.title.toLowerCase().includes(q) || row.alias.toLowerCase().includes(q),
  )
})

// Коли документ вибрано — сховати sidebar, показати aside
const sidebarWasOpen = ref(appStore.sidebarOpen)

watch(() => documentStore.isEditing, (editing) => {
  if (editing) {
    sidebarWasOpen.value = appStore.sidebarOpen
    appStore.sidebarOpen = false
    appStore.asideOpen = true
  } else {
    appStore.sidebarOpen = sidebarWasOpen.value
    appStore.asideOpen = false
  }
})

// При виході зі сторінки — скинути стан
onUnmounted(() => {
  if (documentStore.isEditing) {
    documentStore.selectDocument(null)
    appStore.sidebarOpen = sidebarWasOpen.value
    appStore.asideOpen = false
  }
})

const deleteDialogOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const deleteTargetTitle = ref('')

const deleteMutation = useMutation({
  mutationFn: deleteDocument,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['documents'] })
    toast.success('Документ видалено')
  },
})

function confirmDelete(id: string) {
  const doc = documents.value?.find(d => d.id === id)
  if (doc) {
    deleteTargetId.value = id
    deleteTargetTitle.value = doc.title
    deleteDialogOpen.value = true
  }
}

function executeDelete() {
  if (deleteTargetId.value) {
    deleteMutation.mutate(deleteTargetId.value)
    if (documentStore.selectedDocumentId === deleteTargetId.value) {
      documentStore.selectDocument(null)
      appStore.asideOpen = false
    }
  }
  deleteDialogOpen.value = false
}

function handleSelect(id: string) {
  documentStore.selectDocument(id)
}

function handleClose() {
  documentStore.selectDocument(null)
  appStore.asideOpen = false
}

function handleToggleExpand(id: string) {
  documentStore.toggleExpanded(id)
}
</script>

<template>
  <div class="h-full">
    <!-- Режим списка -->
    <div v-if="!documentStore.isEditing" class="p-6 space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold tracking-tight">Документи</h1>
          <UiBadge v-if="documents" variant="secondary">
            {{ documents.length }}
          </UiBadge>
        </div>
        <UiButton class="cursor-pointer" @click="toast.info('Створення документа — у розробці')">
          <Plus class="size-4 mr-2" />
          Додати
        </UiButton>
      </div>

      <BaseDocumentTreeTable
        :rows="filteredRows"
        :is-loading="isLoading"
        v-model:search="searchQuery"
        @select="handleSelect"
        @toggle-expand="handleToggleExpand"
        @delete="confirmDelete"
      />
    </div>

    <!-- Режим редагування: дерево + редактор + aside (всередині сторінки) -->
    <div v-else class="h-full flex">
      <!-- Дерево навігації -->
      <div class="w-[220px] shrink-0">
        <BaseDocumentTreeNav
          :rows="treeRows"
          :selected-id="documentStore.selectedDocumentId"
          @select="handleSelect"
          @toggle-expand="handleToggleExpand"
        />
      </div>

      <!-- Редактор -->
      <div class="flex-1 overflow-auto border-l">
        <BaseDocumentEditor
          :document-id="documentStore.selectedDocumentId!"
          @close="handleClose"
        />
      </div>

      <!-- Aside метадані (всередині сторінки, не в layout slot) -->
      <div class="w-[280px] shrink-0 border-l bg-muted/30 overflow-auto p-3">
        <BaseDocumentSidebar
          v-if="documentStore.selectedDocumentId"
          :document-id="documentStore.selectedDocumentId"
        />
      </div>
    </div>

    <!-- Діалог видалення -->
    <UiAlertDialog v-if="deleteDialogOpen" v-model:open="deleteDialogOpen">
      <UiAlertDialogContent>
        <UiAlertDialogHeader>
          <UiAlertDialogTitle>Видалити документ?</UiAlertDialogTitle>
          <UiAlertDialogDescription>
            Документ «{{ deleteTargetTitle }}» буде видалено. Цю дію не можна скасувати.
          </UiAlertDialogDescription>
        </UiAlertDialogHeader>
        <UiAlertDialogFooter>
          <UiAlertDialogCancel class="cursor-pointer">Скасувати</UiAlertDialogCancel>
          <UiAlertDialogAction class="cursor-pointer" @click="executeDelete">
            Видалити
          </UiAlertDialogAction>
        </UiAlertDialogFooter>
      </UiAlertDialogContent>
    </UiAlertDialog>
  </div>
</template>
