<script setup lang="ts">

defineProps<{
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}>()

const emit = defineEmits(['close'])

setTimeout(() => {
  emit('close')
}, 2000)

</script>

<template>
  <div class="toast" @click="emit('close')">
    <span>{{ type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️') }}</span>&nbsp
    <span>{{ message }}</span>
  </div>
</template>

<style scoped lang="scss">

.toast {
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: var(--border-radius);
  color: black;
  font-weight: 700;
  cursor: pointer;
  min-width: 250px;
  max-width: 300px;
  transition: all 0.3s ease;
  animation: slide-in 0.3s ease forwards;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
