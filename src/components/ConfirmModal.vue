<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ type: 'contact' | 'group' }>()

const title = computed(() => {
  if (props.type === 'contact') return 'Удалить контакт?'
  if (props.type === 'group') return 'Удалить группу?'
  return ''
})

const description = computed(() => {
  if (props.type === 'contact')
    return 'Вы действительно хотите удалить контакт?'
  if (props.type === 'group')
    return `Вы уверены, что хотите удалить эту группу?<br />Это приведет к удалению всех контактов, находящихся в этой группе.`
  return ''
})
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal-content" @click.stop>
      <h2 class="modal-title" v-html="title"></h2>
      <p v-html="description"></p>
      <div class="modal-actions">
        <button class="btn btn--primary" @click="$emit('confirm')">
          Да, удалить
        </button>
        <button class="btn btn--cancel" @click="$emit('cancel')">
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 90%;
  animation: bounceIn 0.3s ease;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.modal-actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}
</style>
