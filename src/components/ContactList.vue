<script setup lang="ts">
import { GroupManager } from '../classes/GroupManager'
import { ref, onMounted } from 'vue'

const groupManager = new GroupManager()
const groups = ref(groupManager.getAll())

onMounted(() => {
  groups.value = groupManager.getAll()
})
</script>

<template>
  <div class="p-4">
    <template v-if="groups.length === 0">
      <p class="text-center text-gray-500">Список контактов пуст</p>
    </template>

    <template v-for="group in groups" :key="group.name">
      <div v-if="group.contacts.length > 0">
        <h3 class="font-semibold mb-2">{{ group.name }}</h3>
        <ul class="mb-4">
          <li v-for="c in group.contacts" :key="c.id">
            {{ c.name }} — {{ c.phone }}
          </li>
        </ul>
      </div>
      <div v-else class="mb-4 text-gray-400">
        <h3 class="font-semibold">{{ group.name }}</h3>
        <p>Контакты в группе отсутствуют</p>
      </div>
    </template>
  </div>
</template>
