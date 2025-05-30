<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSidebar } from '../composables/useSidebar'
import { GroupManager } from '../classes/GroupManager'
import { useToast } from '../composables/useToast'
import type { Contact } from '../classes/Contact'

const { isOpen, panelType, closeSidebar } = useSidebar()
const { showToast } = useToast()

const groupManager = new GroupManager()

const groupName = ref('')
const contactName = ref('')
const contactPhone = ref('')
const contactGroup = ref('')

// Динамический заголовок панели
const title = computed(() => {
  if (panelType.value === 'group') return 'Группы контактов'
  if (panelType.value === 'contact') return 'Добавить контакт'
  return ''
})

const isMobile = computed(() => {
  if (window) {
    return window.innerWidth <= 768;
  }
  return false;
});

const allGroups = computed(() => {
  return groupManager.getAll;
});

// Сброс данных при открытии панели
onMounted(() => {
  groupName.value = ''
})

function handleAddGroup() {
  const name = groupName.value.trim()
  if (!name) {
    showToast('Введите название группы', 'error')
    return
  }

  const added = groupManager.addGroup(name)
  if (!added) {
    showToast('Группа с таким названием уже существует', 'error')
    return
  }

  showToast(`Группа "${name}" добавлена`, 'success')
  groupName.value = ''
  closeSidebar()
}

// Сохранение нового контакта
function saveContact() {
  const name = contactName.value.trim()
  const phone = contactPhone.value.trim()
  const group = contactGroup.value

  if (!name || !phone || !group) return

  // const contact = { name, phone }

  // const success = groupManager.addContactToGroup(group, contact);
  // if (!success) {
  //   showToast('Контакт с таким номером уже существует или группа не найдена', 'error')
  //   return
  // }

  contactName.value = ''
  contactPhone.value = ''
  contactGroup.value = ''
  closeSidebar()
}
</script>

<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="sidebar"
      :class="{ 'sidebar--mobile': isMobile }"
    >
      <div class="sidebar__header">
        <h2 class="sidebar__title">{{ title }}</h2>
        <button @click="closeSidebar" class="sidebar__close">✕</button>
      </div>

      <div class="sidebar__content">
        <form v-if="panelType === 'group'" class="form" @submit.prevent="handleAddGroup">
          <div class="form__group">
            <label class="form__label" for="group-name">Название группы</label>
            <input
              id="group-name"
              v-model="groupName"
              type="text"
              class="form__input"
              placeholder="Введите название"
            />
          </div>
          <div class="form__actions">
            <button type="submit" class="form__button form__button--primary">Сохранить</button>
          </div>
        </form>

        <div v-else-if="panelType === 'contact'" class="sidebar__form">
          <!-- <label class="sidebar__label">Имя</label>
          <input
            type="text"
            v-model="contactName"
            class="sidebar__input"
            placeholder="Введите имя"
          />

          <label class="sidebar__label">Телефон</label>
          <input
            type="text"
            v-model="contactPhone"
            class="sidebar__input"
            placeholder="+7 (___) ___-__-__"
          />

          <label class="sidebar__label">Группа</label>
          <select v-model="contactGroup" class="sidebar__input">
            <option disabled value="">Выберите группу</option>
            <option v-for="group in groupManager.groups" :key="group.name" :value="group.name">
              {{ group.name }}
            </option>
          </select>

          <button class="sidebar__submit sidebar__submit--add" @click="saveContact">Добавить</button> -->
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
@import '../styles/variables';

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  height: 100%;
  background: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 50;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  transform: translateX(0);

  &--mobile {
    left: auto;
    right: 0;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 1.2rem;
    font-weight: bold;
  }

  &__close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
  }
}

.form {
  &__group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  &__label {
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  &__input {
    padding: 0.5rem;
    border: none;
    background-color: #e5e7eb;
    border-radius: var(--border-radius);
    transition: outline 0.2s ease;

    &:focus {
      outline: 2px solid var(--color-primary);
    }

    &:hover:not(:focus) {
      outline: 2px solid var(--color-hover);
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  &__button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;

    &--primary {
      background-color: var(--color-primary);
      color: white;

      // &:hover {
      //   background-color: darken(var(--color-primary), 10%);
      // }
    }
  }
}
</style>
