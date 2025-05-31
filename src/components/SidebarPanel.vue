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

const groupName = ref('')
const contactName = ref('')
const contactPhone = ref('')
const contactGroup = ref('')

const tempGroups = ref<string[]>([])
const isSaving = ref(false)
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
              <li v-for="(group, index) in tempGroups" :key="index" class="group-item">
                <input v-model="tempGroups[index]" :disabled="!hasUnsaved || index !== tempGroups.length - 1" class="group-input" :class="{ 'error': errors[index] }" />
                <button class="btn btn--delete" @click="removeTempGroup(index)" :disabled="hasUnsaved && index !== tempGroups.length - 1">
                  🗑
                </button>
                <p v-if="errors[index]" class="error-text">{{ errors[index] }}</p>
              </li>
            </ul>
            <div class="group-actions">
              <button class="form__button" @click="addTempGroup" :disabled="hasUnsaved">Добавить</button>
              <button class="form__button form__button--primary" @click="saveGroups" :disabled="!hasUnsaved">Сохранить</button>
            </div>
          </div>

          <div v-else-if="panelType === 'contact'" class="form">
            <div class="form__group">
              <label class="form__label">Имя</label>
              <input type="text" v-model="contactName" class="form__input" placeholder="Введите имя" />
            </div>
            <div class="form__group">
              <label class="form__label">Телефон</label>
              <PhoneInput v-model="contactPhone" />
            </div>
            <div class="form__group">
              <label class="form__label">Группа</label>
              <select v-model="contactGroup" class="form__input">
                <option disabled value="">Выберите группу</option>
                <option v-for="group in allGroups" :key="group" :value="group">{{ group }}</option>
              </select>
            </div>
            <div class="form__actions">
              <button type="button" class="form__button form__button--primary" @click="saveContact">Сохранить</button>
            </div>
          </div>
        </div>

        <ConfirmModal
          v-if="isModalOpen"
          @confirm="confirmDeleteGroup"
          @cancel="isModalOpen = false"
        >
          <template #default>
            <p>Вы уверены, что хотите удалить эту группу?<br />Это приведет к удалению всех контактов, находящихся в этой группе.</p>
          </template>
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
  height: 100%;
  background: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  z-index: 100;
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

.error-text {
  color: #e11d48;
  font-size: 0.8rem;
  margin-top: -0.25rem;
}

.group-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: flex-end;
}

.btn--delete {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #e11d48;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
