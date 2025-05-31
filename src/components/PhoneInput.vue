<script setup lang="ts">
import { onMounted, ref } from 'vue'
import IMask from 'imask'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue'])

const phoneRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (phoneRef.value) {
    const mask = IMask(phoneRef.value, {
      mask: '+{7}(000)000-00-00',
    })

    mask.on('accept', () => {
      emit('update:modelValue', mask.value)
    })
  }
})

</script>

<template>
  <input
    ref="phoneRef"
    type="text"
    class="form__input"
    :value="modelValue"
    placeholder="+7(___)___-__-__"
  />
</template>

<style scoped lang="scss">
</style>
