<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSidebar } from '../composables/useSidebar'
import { GroupManager } from '../classes/GroupManager'
import { useToast } from '../composables/useToast'
import PhoneInput from './PhoneInput.vue'
import { Contact } from '../classes/Contact'

const { isOpen, panelType, closeSidebar } = useSidebar()
const { showToast } = useToast()

const groupName = ref('')
const contactName = ref('')
const contactPhone = ref('')
const contactGroup = ref('')

// Для редактирования (пока без реализации редактирования, можно добавить позже)
const editingContact = ref<Contact | null>(null)
const editingGroupName = ref<string | null>(null)

const title = computed(() => {
  if (panelType.value === 'group') return 'Группы контактов'
  if (panelType.value === 'contact') return editingContact.value ? 'Редактировать контакт' : 'Добавить контакт'
  return ''
})

// Реактивно отслеживаем группы из GroupManager
const allGroups = computed(() => GroupManager.groups.map(g => g.name))

watch(isOpen, (open) => {
  if (open) {
    // Сброс при открытии
    groupName.value = ''
    contactName.value = ''
    contactPhone.value = ''
    contactGroup.value = ''
    editingContact.value = null
  }
})

function handleAddGroup() {
  const name = groupName.value.trim()
  if (!name) {
    showToast('Введите название группы', 'error')
    return
  }

  const added = GroupManager.addGroup(name)
  if (!added) {
    showToast('Группа с таким названием уже существует', 'error')
    return
  }

  showToast(`Группа "${name}" добавлена`, 'success')
  groupName.value = ''
  closeSidebar()
}

function saveContact() {
  const name = contactName.value.trim()
  const phone = contactPhone.value.trim()
  const group = contactGroup.value

  if (!name || !phone || !group) {
    showToast('Заполните все поля', 'error')
    return
  }

  const contact = new Contact(name, phone)
  const success = GroupManager.addContactToGroup(group, contact)

  if (!success) {
    showToast('Контакт уже существует или группа не найдена', 'error')
    return
  }

  showToast(`Контакт "${name}" добавлен в группу "${group}"`, 'success')
  contactName.value = ''
  contactPhone.value = ''
  contactGroup.value = ''
  closeSidebar()
}


</script>

<template>
  <transition name="fade">
    <div v-if="isOpen" class="sidebar">
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

        <div v-else-if="panelType === 'contact'" class="form">
          <div class="form__group">
            <label class="form__label">Имя</label>
            <input
              type="text"
              v-model="contactName"
              class="form__input"
              placeholder="Введите имя"
            />
          </div>

          <div class="form__group">
            <label class="form__label">Телефон</label>
            <PhoneInput v-model="contactPhone" />
          </div>

          <div class="form__group">
            <label class="form__label">Группа</label>
            <select v-model="contactGroup" class="form__input">
              <option disabled value="">Выберите группу</option>
              <option v-for="group in GroupManager.getAll()" :key="group.name" :value="group.name">
                {{ group.name }}
              </option>
            </select>
          </div>

          <div class="form__actions">
            <button type="button" class="form__button form__button--primary" @click="saveContact">
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
