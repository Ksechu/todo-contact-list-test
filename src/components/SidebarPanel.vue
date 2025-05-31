<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSidebar } from '../composables/useSidebar'
import { GroupManager } from '../classes/GroupManager'
import { useToast } from '../composables/useToast'
import PhoneInput from './PhoneInput.vue'
import ConfirmModal from './ConfirmModal.vue'
import { Contact } from '../classes/Contact'

const { isOpen, panelType, closeSidebar } = useSidebar()
const { showToast } = useToast()

const contactName = ref('')
const contactPhone = ref('')
const contactGroup = ref('')

const contactNameError = ref('')
const contactPhoneError = ref('')
const contactGroupError = ref('')

const tempGroups = ref<string[]>([])
const hasUnsaved = ref(false)
const errors = ref<string[]>([])
const isModalOpen = ref(false)
const groupToDelete = ref<string | null>(null)

const title = computed(() => {
  if (panelType.value === 'group') return 'Группы контактов'
  if (panelType.value === 'contact') return 'Добавить контакт'
  return ''
})

const allGroups = computed(() => GroupManager.groups.map(g => g.name))

watch(isOpen, (open) => {
  if (open && panelType.value === 'group') {
    tempGroups.value = [...allGroups.value]
    hasUnsaved.value = false
    errors.value = []
  }
  if (open && panelType.value === 'contact') {
    contactName.value = ''
    contactPhone.value = ''
    contactGroup.value = ''
    contactNameError.value = ''
    contactPhoneError.value = ''
    contactGroupError.value = ''
  }
})

function addTempGroup() {
  if (hasUnsaved.value) return
  tempGroups.value.push('')
  hasUnsaved.value = true
}

function removeTempGroup(index: number) {
  if (hasUnsaved.value && index === tempGroups.value.length - 1 && tempGroups.value[index] === '') {
    tempGroups.value.pop()
    hasUnsaved.value = false
    return
  }
  isModalOpen.value = true
  groupToDelete.value = tempGroups.value[index]
}

function confirmDeleteGroup() {
  const name = groupToDelete.value
  const success = GroupManager.removeGroup(name!)
  if (success) {
    showToast(`Группа "${name}" и её контакты удалены`, 'success')
    tempGroups.value = tempGroups.value.filter(g => g !== name)
  } else {
    showToast('Ошибка при удалении группы', 'error')
  }
  groupToDelete.value = null
  isModalOpen.value = false
}

function saveGroups() {
  errors.value = []
  const last = tempGroups.value[tempGroups.value.length - 1]
  if (!last || last.trim() === '') {
    errors.value[tempGroups.value.length - 1] = 'Введите название группы'
    return
  }
  const added = GroupManager.addGroup(last.trim())
  if (!added) {
    errors.value[tempGroups.value.length - 1] = 'Группа уже существует'
    return
  }
  showToast(`Группа "${last}" добавлена`, 'success')
  hasUnsaved.value = false
  closeSidebar()
}

function validateContactFields() {
  contactNameError.value = contactName.value.trim() === '' ? 'Поле является обязательным' : ''
  contactPhoneError.value = contactPhone.value.trim() === '' ? 'Поле является обязательным' : ''
  contactGroupError.value = contactGroup.value === '' ? 'Поле является обязательным' : ''

  return !contactNameError.value && !contactPhoneError.value && !contactGroupError.value
}

function saveContact() {
  if (!validateContactFields()) return

  const name = contactName.value.trim()
  const phone = contactPhone.value.trim()
  const group = contactGroup.value

  const contact = new Contact(name, phone)
  const success = GroupManager.addContactToGroup(group, contact)

  if (!success) {
    showToast('Контакт уже существует или группа не найдена', 'error')
    return
  }

  showToast(`Контакт "${name}" добавлен в группу "${group}"`, 'success')
  closeSidebar()
}
</script>

<template>
  <transition name="fade">
    <div v-if="isOpen">
      <div class="overlay" @click="closeSidebar"></div>
      <div class="sidebar">
        <div class="sidebar__header">
          <h2 class="sidebar__title">{{ title }}</h2>
          <button @click="closeSidebar" class="sidebar__close">✕</button>
        </div>

        <div class="sidebar__content">
          <div v-if="panelType === 'group'">
            <ul class="group-list">
              <li v-for="(_, index) in tempGroups" :key="index" class="group-item">
                <input
                  v-model="tempGroups[index]"
                  :disabled="!hasUnsaved || index !== tempGroups.length - 1"
                  class="group-input"
                  placeholder="Введите название"
                />
                <button
                  class="btn btn--delete"
                  @click="removeTempGroup(index)"
                  :disabled="hasUnsaved && index !== tempGroups.length - 1"
                >
                  🗑
                </button>
                <p v-if="errors[index]" class="error-text">{{ errors[index] }}</p>
              </li>
            </ul>
          </div>

          <div v-else-if="panelType === 'contact'" class="form">
            <div class="form__group">
              <label class="form__label">Имя</label>
              <input
                type="text"
                v-model="contactName"
                class="group-input"
                @blur="contactNameError = contactName.trim() ? '' : 'Поле является обязательным'"
                :class="contactNameError ? 'outline' : ''"
                placeholder="Введите имя"
              />
              <span v-if="contactNameError" class="error-text">{{ contactNameError }}</span>
            </div>

            <div class="form__group">
              <label class="form__label">Телефон</label>
              <PhoneInput
                v-model="contactPhone"
                class="group-input phone-wrapper"
                :class="contactPhoneError ? 'outline' : ''"
                @blur="contactPhoneError = contactPhone.trim() ? '' : 'Поле является обязательным'"
              />
              <span v-if="contactPhoneError" class="error-text">{{ contactPhoneError }}</span>
            </div>

            <div class="form__group">
              <label class="form__label">Группа</label>
              <select
                v-model="contactGroup"
                class="group-input"
                :class="contactGroupError ? 'outline' : ''"
                @blur="contactGroupError = contactGroup ? '' : 'Поле является обязательным'"
              >
                <option disabled value="">Выберите группу</option>
                <option v-for="group in allGroups" :key="group" :value="group">{{ group }}</option>
              </select>
              <span v-if="contactGroupError" class="error-text">{{ contactGroupError }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar__actions" v-if="panelType === 'group'">
          <button class="btn btn--cancel" @click="addTempGroup" :disabled="hasUnsaved">Добавить</button>
          <button class="btn btn--primary" @click="saveGroups" :disabled="!hasUnsaved">Сохранить</button>
        </div>

        <div class="sidebar__actions" v-else-if="panelType === 'contact'">
          <button type="button" class="btn btn--primary" @click="saveContact">Сохранить</button>
        </div>

        <ConfirmModal
          v-if="isModalOpen"
          @confirm="confirmDeleteGroup"
          @cancel="isModalOpen = false"
          type="group"
        >
        </ConfirmModal>
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
  height: calc(100% - 1.5rem);
  background: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  z-index: 100;

  @media (max-width: 768px) {
    left: auto;
    right: 0;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 99;
}

.sidebar__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.sidebar__title {
  font-size: 1.2rem;
  font-weight: bold;
}

.sidebar__close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.sidebar__content {
  flex: 1;
  overflow-y: auto;
}

.sidebar__actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.group-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.group-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.group-input {
  flex: 1;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

select.group-input {
  appearance: none;
  background-color: white;
  background-image: url("data:image/svg+xml,%3Csvg fill='gray' height='10' viewBox='0 0 10 6' width='10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l5 6 5-6z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 0.75rem auto;
  padding-right: 1.5rem;
}

.form__group {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
}

.form__label {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: #333;
}

.phone-wrapper {
  display: flex;
  align-items: center;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.error-text {
  color: #e11d48;
  font-size: 0.8rem;
  min-height: 1em;
  margin-top: 0.25rem;
}

.outline {
  outline: 2px solid var(--color-error);
}
</style>
