<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Sonner — глобальный контейнер уведомлений -->
    <!-- Использование: import { toast } from 'vue-sonner' → toast('Сообщение') -->
    <UiToaster rich-colors position="bottom-right" />
  </div>
</template>
