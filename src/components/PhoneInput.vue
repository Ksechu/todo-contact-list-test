<script setup lang="ts">
import { onMounted, ref } from 'vue'
import IMask from 'imask'

const phoneRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (phoneRef.value) {
    IMask(phoneRef.value, {
      mask: '+{7}(000)000-00-00',
    })
  }
})
</script>

<template>
  <input
    ref="phoneRef"
    type="text"
    class="form__input"
    placeholder="+7(___)___-__-__"
  />
</template>

<style scoped lang="scss">
.form__input {
  padding: 0.5rem;
  border: none;
  background-color: #e5e7eb;
  border-radius: var(--border-radius);
  transition: all 0.2s ease;

  &:focus {
    outline: 2px solid var(--color-primary);
  }

  &:hover:not(:focus) {
    outline: 2px solid var(--color-hover);
  }
}
</style>
