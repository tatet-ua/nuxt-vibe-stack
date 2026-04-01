<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import type { User } from '~/types/user'
import { createUser, updateUser } from '~/composables/useMockUsers'

const props = defineProps<{
  user: User | null
}>()

const open = defineModel<boolean>('open', { default: false })

const isEdit = computed(() => !!props.user)

const queryClient = useQueryClient()

const schema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Неверный формат email'),
  role: z.enum(['admin', 'manager', 'user'], { required_error: 'Выберите роль' }),
  status: z.enum(['active', 'inactive']),
  description: z.string().optional(),
})

const { handleSubmit, defineField, errors, resetForm, setValues } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    name: '',
    email: '',
    role: 'user' as const,
    status: 'active' as const,
    description: '',
  },
})

const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [role, roleAttrs] = defineField('role')
const [status] = defineField('status')
const [description, descriptionAttrs] = defineField('description')

// Заполняем форму при редактировании
watch(() => props.user, (u) => {
  if (u) {
    setValues({
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      description: u.description ?? '',
    })
  } else {
    resetForm()
  }
})

const createMutation = useMutation({
  mutationFn: (data: z.infer<typeof schema>) => createUser(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
    toast.success('Пользователь создан')
    open.value = false
  },
})

const updateMutation = useMutation({
  mutationFn: (data: z.infer<typeof schema>) => updateUser(props.user!.id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
    toast.success('Пользователь обновлён')
    open.value = false
  },
})

const isSubmitting = computed(() => createMutation.isPending.value || updateMutation.isPending.value)

const onSubmit = handleSubmit((values) => {
  if (isEdit.value) {
    updateMutation.mutate(values)
  } else {
    createMutation.mutate(values)
  }
})
</script>

<template>
  <UiSheet v-model:open="open">
    <UiSheetContent class="sm:max-w-md overflow-y-auto p-6">
      <UiSheetHeader>
        <UiSheetTitle>{{ isEdit ? 'Редактирование' : 'Создание' }} пользователя</UiSheetTitle>
        <UiSheetDescription>
          {{ isEdit ? 'Измените данные пользователя' : 'Заполните данные нового пользователя' }}
        </UiSheetDescription>
      </UiSheetHeader>

      <form class="space-y-6 pt-8" @submit.prevent="onSubmit">
        <!-- Имя -->
        <div class="space-y-2">
          <UiLabel for="name">Имя</UiLabel>
          <UiInput
            id="name"
            v-model="name"
            v-bind="nameAttrs"
            placeholder="Иван Иванов"
            :class="{ 'border-destructive': errors.name }"
          />
          <p v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div class="space-y-2">
          <UiLabel for="email">Email</UiLabel>
          <UiInput
            id="email"
            v-model="email"
            v-bind="emailAttrs"
            type="email"
            placeholder="ivan@example.com"
            :class="{ 'border-destructive': errors.email }"
          />
          <p v-if="errors.email" class="text-xs text-destructive">{{ errors.email }}</p>
        </div>

        <!-- Роль -->
        <div class="space-y-2">
          <UiLabel>Роль</UiLabel>
          <UiSelect v-model="role" v-bind="roleAttrs">
            <UiSelectTrigger class="cursor-pointer" :class="{ 'border-destructive': errors.role }">
              <UiSelectValue placeholder="Выберите роль" />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectItem value="admin" class="cursor-pointer">Админ</UiSelectItem>
              <UiSelectItem value="manager" class="cursor-pointer">Менеджер</UiSelectItem>
              <UiSelectItem value="user" class="cursor-pointer">Пользователь</UiSelectItem>
            </UiSelectContent>
          </UiSelect>
          <p v-if="errors.role" class="text-xs text-destructive">{{ errors.role }}</p>
        </div>

        <UiSeparator />

        <!-- Статус -->
        <div class="flex items-center justify-between">
          <UiLabel for="status">Активен</UiLabel>
          <UiSwitch
            id="status"
            class="cursor-pointer"
            :model-value="status === 'active'"
            @update:model-value="status = $event ? 'active' : 'inactive'"
          />
        </div>

        <UiSeparator />

        <!-- Описание -->
        <div class="space-y-2">
          <UiLabel for="description">Описание</UiLabel>
          <UiTextarea
            id="description"
            v-model="description"
            v-bind="descriptionAttrs"
            placeholder="Дополнительная информация..."
            rows="3"
          />
        </div>

        <!-- Кнопки -->
        <div class="flex justify-end gap-3 pt-6">
          <UiButton type="button" variant="outline" class="cursor-pointer" @click="open = false">
            Отмена
          </UiButton>
          <UiButton type="submit" class="cursor-pointer" :disabled="isSubmitting">
            {{ isSubmitting ? 'Сохранение...' : (isEdit ? 'Сохранить' : 'Создать') }}
          </UiButton>
        </div>
      </form>
    </UiSheetContent>
  </UiSheet>
</template>
