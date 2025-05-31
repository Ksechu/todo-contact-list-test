<template>
  <div class="modal-backdrop">
    <div class="modal-content" @click.stop>
      <p>Вы действительно хотите удалить контакт?</p>
      <div class="modal-actions">
        <button class="btn btn--delete" @click="$emit('confirm')">Удалить</button>
        <button class="btn btn--edit" @click="$emit('cancel')">Отмена</button>
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
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  animation: bounceIn 0.3s ease;
}

.modal-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
