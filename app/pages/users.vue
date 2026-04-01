<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { fetchUsers, deleteUser } from '~/composables/useMockUsers'
import { Pencil, Trash2, Plus, Search } from 'lucide-vue-next'
import type { User } from '~/types/user'
import { USER_ROLE_LABELS } from '~/types/user'
import { formatDate } from '~/composables/useFormatDate'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Пользователи' })

const queryClient = useQueryClient()

const { data: users, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
})

const deleteMutation = useMutation({
  mutationFn: deleteUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
    toast.success('Пользователь удалён')
  },
})

const searchQuery = ref('')
const filteredUsers = computed(() => {
  const list = users.value ?? []
  if (!searchQuery.value) return list
  const q = searchQuery.value.toLowerCase()
  return list.filter(u =>
    u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
  )
})

const formOpen = ref(false)
const editingUser = ref<User | null>(null)
const deleteDialogOpen = ref(false)
const userToDelete = ref<User | null>(null)


function openCreateForm() {
  editingUser.value = null
  formOpen.value = true
}

function openEditForm(user: User) {
  editingUser.value = user
  formOpen.value = true
}

function confirmDelete(user: User) {
  userToDelete.value = user
  deleteDialogOpen.value = true
}

function executeDelete() {
  if (userToDelete.value) {
    deleteMutation.mutate(userToDelete.value.id)
  }
  deleteDialogOpen.value = false
  userToDelete.value = null
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2)
}

// Виділення та batch selection
const selectedIds = ref<Set<string>>(new Set())

const allSelected = computed(() => {
  const list = filteredUsers.value
  return list.length > 0 && list.every(u => selectedIds.value.has(u.id))
})

function toggleSelectAll() {
  if (allSelected.value) {
    selectedIds.value = new Set()
  } else {
    selectedIds.value = new Set(filteredUsers.value.map(u => u.id))
  }
}

function toggleSelect(id: string) {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}

function batchDelete() {
  const count = selectedIds.value.size
  for (const id of selectedIds.value) {
    deleteMutation.mutate(id)
  }
  selectedIds.value = new Set()
  toast.success(`Видалено ${count} записів`)
}

// Hot keys
const searchInput = ref<HTMLInputElement | null>(null)

useHotKeys([
  { key: 'k', ctrl: true, handler: () => searchInput.value?.focus() },
  { key: 'n', ctrl: true, handler: () => openCreateForm() },
  { key: 'Escape', handler: () => {
    if (formOpen.value) formOpen.value = false
    else if (deleteDialogOpen.value) deleteDialogOpen.value = false
  }},
])
</script>

<template>
  <div class="p-6 space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Пользователи</h1>
        <p class="text-sm text-muted-foreground">Управление пользователями системы</p>
      </div>
      <UiButton class="cursor-pointer" @click="openCreateForm">
        <Plus class="size-4 mr-2" /> Создать
        <kbd class="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground hidden sm:inline">Ctrl+N</kbd>
      </UiButton>
    </div>

    <div class="relative max-w-sm">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <UiInput ref="searchInput" v-model="searchQuery" placeholder="Поиск по имени или email... (Ctrl+K)" class="pl-9" />
    </div>

    <!-- Batch actions -->
    <div
      v-if="selectedIds.size > 0"
      class="flex items-center gap-3 px-4 py-2 bg-muted/50 border rounded-md"
    >
      <span class="text-sm font-medium">Выбрано: {{ selectedIds.size }}</span>
      <UiButton variant="destructive" size="sm" class="cursor-pointer" @click="batchDelete">
        <Trash2 class="size-3.5 mr-1.5" /> Удалить
      </UiButton>
      <UiButton variant="ghost" size="sm" class="cursor-pointer" @click="selectedIds = new Set()">
        Снять выделение
      </UiButton>
    </div>

    <div class="rounded-md border">
      <UiTable>
        <UiTableHeader>
          <UiTableRow>
            <UiTableHead class="w-10">
              <UiCheckbox
                :model-value="allSelected"
                class="cursor-pointer"
                @update:model-value="toggleSelectAll"
              />
            </UiTableHead>
            <UiTableHead class="min-w-[250px]">Имя</UiTableHead>
            <UiTableHead>Роль</UiTableHead>
            <UiTableHead>Статус</UiTableHead>
            <UiTableHead>Создан</UiTableHead>
            <UiTableHead class="w-20" />
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody>
          <template v-if="isLoading">
            <UiTableRow v-for="i in 5" :key="i">
              <UiTableCell v-for="j in 6" :key="j">
                <div class="h-4 bg-muted animate-pulse rounded" />
              </UiTableCell>
            </UiTableRow>
          </template>
          <template v-else>
            <UiTableRow
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-muted/50"
              :class="{ 'bg-accent/50': selectedIds.has(user.id) }"
            >
              <UiTableCell @click.stop>
                <UiCheckbox
                  :model-value="selectedIds.has(user.id)"
                  class="cursor-pointer"
                  @update:model-value="toggleSelect(user.id)"
                />
              </UiTableCell>
              <UiTableCell>
                <div class="flex items-center gap-3">
                  <div class="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    {{ getInitials(user.name) }}
                  </div>
                  <div>
                    <div class="font-medium">{{ user.name }}</div>
                    <div class="text-xs text-muted-foreground">{{ user.email }}</div>
                  </div>
                </div>
              </UiTableCell>
              <UiTableCell>{{ USER_ROLE_LABELS[user.role] }}</UiTableCell>
              <UiTableCell>
                <UiBadge :variant="user.status === 'active' ? 'default' : 'secondary'">
                  {{ user.status === 'active' ? 'Активен' : 'Неактивен' }}
                </UiBadge>
              </UiTableCell>
              <UiTableCell class="text-muted-foreground">
                {{ formatDate(user.createdAt) }}
              </UiTableCell>
              <UiTableCell>
                <div class="flex items-center gap-1">
                  <button class="size-7 inline-flex items-center justify-center rounded-md hover:bg-accent cursor-pointer" @click="openEditForm(user)">
                    <Pencil class="size-3.5 text-muted-foreground" />
                  </button>
                  <button class="size-7 inline-flex items-center justify-center rounded-md hover:bg-destructive/10 cursor-pointer" @click="confirmDelete(user)">
                    <Trash2 class="size-3.5 text-destructive" />
                  </button>
                </div>
              </UiTableCell>
            </UiTableRow>
          </template>
        </UiTableBody>
      </UiTable>
    </div>

    <UiAlertDialog v-if="deleteDialogOpen" v-model:open="deleteDialogOpen">
      <UiAlertDialogContent>
        <UiAlertDialogHeader>
          <UiAlertDialogTitle>Удалить пользователя?</UiAlertDialogTitle>
          <UiAlertDialogDescription>
            Пользователь «{{ userToDelete?.name }}» будет удалён.
          </UiAlertDialogDescription>
        </UiAlertDialogHeader>
        <UiAlertDialogFooter>
          <UiAlertDialogCancel class="cursor-pointer">Отмена</UiAlertDialogCancel>
          <UiAlertDialogAction class="cursor-pointer" @click="executeDelete">Удалить</UiAlertDialogAction>
        </UiAlertDialogFooter>
      </UiAlertDialogContent>
    </UiAlertDialog>

    <BaseUserFormSheet v-if="formOpen" v-model:open="formOpen" :user="editingUser" />
  </div>
</template>
