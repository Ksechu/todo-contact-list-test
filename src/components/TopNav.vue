<script setup lang="ts">
import { useSidebar } from '../composables/useSidebar'
const { openSidebar } = useSidebar()
</script>

<template>
  <div class="flex gap-2 p-4 border-b shadow-sm">
    <button @click="openSidebar('contact')" class="px-4 py-2 bg-pink-300 text-white rounded">Добавить контакт</button>
    <button @click="openSidebar('group')" class="px-4 py-2 bg-gray-200 rounded">Группы</button>
  </div>
</template>
