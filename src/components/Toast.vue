<script setup lang="ts">
defineProps<{
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}>()

const emit = defineEmits(['close'])

setTimeout(() => {
  emit('close')
}, 4000)
</script>

<template>
  <div :class="['toast', `toast--${type}`]" @click="emit('close')">
    {{ message }}
  </div>
</template>

<style scoped lang="scss">
@import '../styles/variables';

.toast {
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: var(--border-radius);
  color: white;
  cursor: pointer;
  min-width: 250px;
  max-width: 300px;
  transition: all 0.3s ease;
  animation: slide-in 0.3s ease forwards;

  &--success {
    background-color: #16a34a;
  }

  &--error {
    background-color: #dc2626;
  }

  &--info {
    background-color: #3b82f6;
  }
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
