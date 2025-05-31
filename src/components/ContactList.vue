<script setup lang="ts">
import { ref, computed } from 'vue'
import { GroupManager } from '../classes/GroupManager'
import { useToast } from '../composables/useToast'
import type { Contact } from '../classes/Contact'
import ConfirmModal from './ConfirmModal.vue'

const { showToast } = useToast()

const openGroups = ref<Set<string>>(new Set())

function toggleGroup(name: string) {
  if (openGroups.value.has(name)) {
    openGroups.value.delete(name)
  } else {
    openGroups.value.add(name)
  }
}

function isGroupOpen(name: string) {
  return openGroups.value.has(name)
}

const editingContactId = ref<string | null>(null)
const editingGroupName = ref<string | null>(null)

const editedName = ref('')
const editedPhone = ref('')

function startEditContact(groupName: string, contact: Contact) {
  editingContactId.value = contact.id
  editingGroupName.value = groupName
  editedName.value = contact.name
  editedPhone.value = contact.phone
}

function cancelEdit() {
  editingContactId.value = null
  editingGroupName.value = null
}

function saveEdit() {
  if (!editingGroupName.value || !editingContactId.value) return

  const success = GroupManager.updateContact(editingGroupName.value, editingContactId.value, editedName.value, editedPhone.value)
  if (success) {
    showToast('Контакт обновлён', 'success')
  } else {
    showToast('Ошибка обновления', 'error')
  }

  cancelEdit()
}

const isModalOpen = ref(false)
const contactToDelete = ref<{ groupName: string, contactId: string } | null>(null)

function requestDelete(groupName: string, contactId: string) {
  isModalOpen.value = true
  contactToDelete.value = { groupName, contactId }
}

function confirmDelete() {
  const { groupName, contactId } = contactToDelete.value!
  const success = GroupManager.removeContactByGroup(groupName, contactId)
  if (success) {
    showToast('Контакт удалён', 'success')
  } else {
    showToast('Ошибка удаления', 'error')
  }

  isModalOpen.value = false
  contactToDelete.value = null
}

const groupsWithContacts = computed(() =>
  GroupManager.groups.filter(group => group.contacts.length > 0)
)
</script>

<template>
  <div class="contact-list">
    <div v-if="groupsWithContacts.length === 0" class="empty-message">
      Список контактов пуст
    </div>
    <ul v-else class="group-list">
      <li v-for="group in groupsWithContacts" :key="group.name" class="group">
        <div class="group__header" @click="toggleGroup(group.name)">
          <h3 :style="isGroupOpen(group.name) ? 'color: var(--color-primary)' : ''">{{ group.name }}</h3>
          <span class="arrow" :class="{ open: isGroupOpen(group.name) }">▾</span>
        </div>
        <transition name="slide-down">
          <ul v-if="isGroupOpen(group.name)" class="contact-list__items">
            <li v-for="contact in group.contacts" :key="contact.id" class="contact-item">
              <div class="contact-item__info">
                <template v-if="editingContactId === contact.id">
                  <input v-model="editedName" />
                </template>
                <template v-else>
                  <span class="contact-name">{{ contact.name }}</span>
                </template>
              </div>
              <div class="contact-item__right">
                <template v-if="editingContactId === contact.id">
                  <input v-model="editedPhone" />
                  <button @click="saveEdit" class="btn btn--edit">☑</button>
                  <button @click="cancelEdit" class="btn btn--delete">☒</button>
                </template>
                <template v-else>
                  <span class="contact-phone">{{ contact.phone }}</span>
                  <button
                    @click="startEditContact(group.name, contact)"
                    class="btn btn--edit"
                    title="Редактировать"
                    :disabled="!!editingContactId"
                  >
                    ✎
                  </button>
                  <button
                    @click="requestDelete(group.name, contact.id)"
                    class="btn btn--delete"
                    title="Удалить"
                    :disabled="!!editingContactId"
                  >
                    🗑
                  </button>
                </template>
              </div>
            </li>
          </ul>
        </transition>
      </li>
    </ul>

    <ConfirmModal
      v-if="isModalOpen"
      @confirm="confirmDelete"
      @cancel="isModalOpen = false"
      type="contact"
    />
  </div>
</template>

<style scoped lang="scss">
.contact-list {
  max-width: 1160px;
  margin: 0 auto;
  padding: 1rem;
}

.group-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.group {
  background-color: #ffffff;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    cursor: pointer;
    font-weight: 600;
    border-bottom: 1px solid #e5e7eb;

    h3 {
      margin: 0;
      font-size: 1.1rem;
    }

    .arrow {
      transition: transform 0.3s ease;
      font-size: 1rem;
      color: #444;
      &.open {
        transform: rotate(180deg);
      }
    }
  }
}

.contact-list__items {
  list-style: none;
  padding: 0;
  margin: 0;

  .contact-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;

      .contact-item__info {
        width: 100%;
      }

      .contact-item__right {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 0.5rem;

        .contact-phone {
          flex: 1;
        }

        .btn {
          flex-shrink: 0;
        }
      }
    }

    &__info {
      flex: 1;

      .contact-name {
        font-weight: 500;
      }

      input {
        padding: 0.3rem 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 100%;
      }
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      input {
        padding: 0.3rem 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 100%;
      }

      .contact-phone {
        margin-right: 0.5rem;
        font-size: 0.95rem;
        color: #333;
      }

      .icon-btn {
        background: none;
        border: none;
        padding: 0.2rem;
        cursor: pointer;
        color: #555;
        transition: color 0.2s ease;

        &:hover {
          color: #000;
        }

        &.danger:hover {
          color: #e11d48;
        }
      }
    }
  }
}

.empty-message {
  display: flex;
  text-align: center;
  font-size: 14px;
  color: #666;
  align-items: center;
  justify-content: center;
}
</style>
