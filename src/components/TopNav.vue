<script setup lang="ts">
import { useSidebar } from '../composables/useSidebar'
const { openSidebar } = useSidebar()
</script>

<template>
  <div class="topnav-wrapper">
    <div class="panel">
      <div class="panel__left">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 14a4 4 0 01-8 0m8 0V8a4 4 0 10-8 0v6m8 0H8" />
        </svg>
        <span class="panel__title">Список контактов</span>
        <button @click="openSidebar('group')" class="btn btn--primary mobile-only">Группы</button>
      </div>
      <div class="panel__right">
        <button @click="openSidebar('contact')" class="btn btn--pink">Добавить контакт +</button>
        <button @click="openSidebar('group')" class="btn btn--primary desktop-only">Группы</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.topnav-wrapper {
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 1160px;
  padding: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .icon {
      width: 24px;
      height: 24px;
      color: #3b82f6;
    }

    .panel__title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .btn--primary.mobile-only {
      @media (min-width: 769px) {
        display: none;
      }
    }

    @media (max-width: 768px) {
      width: 100%;
      justify-content: space-between;
    }
  }

  &__right {
    display: flex;
    gap: 0.5rem;

    .btn--pink {
      order: 1;
    }

    .btn--primary.desktop-only {
      order: 2;
      @media (max-width: 768px) {
        display: none;
      }
    }

    @media (max-width: 768px) {
      width: 100%;
      flex-direction: column;

      .btn--pink {
        width: 100%;
      }
    }
  }
}
</style>
