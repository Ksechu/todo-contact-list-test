<script setup lang="ts">
import Toast from './components/Toast.vue'
import { useToast } from './composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<template>
  <router-view />

  <div class="toast-container">
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :id="toast.id"
      :message="toast.message"
      :type="toast.type"
      @close="removeToast(toast.id)"
    />
  </div>
</template>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>
