<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

const { breadcrumbs } = useBreadcrumbs()
</script>

<template>
  <nav v-if="breadcrumbs.length > 1" class="flex items-center gap-1 text-sm">
    <template v-for="(item, i) in breadcrumbs" :key="i">
      <ChevronRight v-if="i > 0" class="size-3 text-muted-foreground shrink-0" />
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        {{ item.label }}
      </NuxtLink>
      <span v-else class="text-foreground font-medium">
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>
