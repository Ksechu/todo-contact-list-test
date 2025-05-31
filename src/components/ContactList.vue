<script setup lang="ts">
import { ref, computed } from 'vue'
import { GroupManager } from '../classes/GroupManager'
import { useSidebar } from '../composables/useSidebar'
import { useToast } from '../composables/useToast'
import type { Contact } from '../classes/Contact'

const { openSidebar } = useSidebar()
const { showToast } = useToast()

const groups = computed(() => GroupManager.groups)
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

function editContact(groupName: string, contact: Contact) {
  showToast('Функция редактирования пока не реализована', 'info')
}

function deleteContact(groupName: string, contactId: string) {
  const confirmed = confirm('Удалить контакт?')
  if (!confirmed) return

  const success = GroupManager.removeContactByGroup(groupName, contactId)
  if (success) {
    showToast('Контакт удален', 'success')
  } else {
    showToast('Ошибка при удалении контакта', 'error')
  }
}

function deleteGroup(groupName: string) {
  const confirmed = confirm(`Удалить группу "${groupName}" и все её контакты?`)
  if (!confirmed) return

  GroupManager.removeGroup(groupName)
  showToast(`Группа "${groupName}" удалена`, 'success')
}
</script>

<template>
  <div class="contact-list">
    <ul class="group-list">
      <li v-for="group in groups" :key="group.name" class="group">
        <div class="group__header" @click="toggleGroup(group.name)">
          <h3>{{ group.name }}</h3>
          <span class="arrow" :class="{ open: isGroupOpen(group.name) }">&#9662;</span>
        </div>
        <transition name="slide-down">
          <ul v-if="isGroupOpen(group.name)" class="contact-list__items">
            <li v-for="contact in group.contacts" :key="contact.id" class="contact-item">
              <div class="contact-item__info">
                <span class="contact-name">{{ contact.name }}</span>
              </div>
              <div class="contact-item__right">
                <span class="contact-phone">{{ contact.phone }}</span>
                <button @click="editContact(group.name, contact)" class="icon-btn" title="Редактировать">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 0 1 0 2.828l-1.793 1.793-2.828-2.828 1.793-1.793a2 2 0 0 1 2.828 0zM2 14.586V18h3.414l9.793-9.793-2.828-2.828L2 14.586z"/></svg>
                </button>
                <button @click="deleteContact(group.name, contact.id)" class="icon-btn danger" title="Удалить">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M6 8v8h2V8H6zm3 0v8h2V8H9zm3 0v8h2V8h-2z"/><path d="M4 6h12v2H4V6zm5-3h2v2H9V3z"/></svg>
                </button>
              </div>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.contact-list {
  max-width: 800px;
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
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06); // 👉 мягкая тень снизу
  overflow: hidden;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    cursor: pointer;
    font-weight: 600;
    border-bottom: 1px solid #e5e7eb; // линия под заголовком

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

    &__info {
      flex: 1;
      .contact-name {
        font-weight: 500;
      }
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 0.5rem;

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

        svg {
          display: block;
        }
      }
    }
  }
}

// Анимация выезда
.slide-down-enter-active {
  max-height: 1000px;
  opacity: 1;
  transition: max-height 0.4s ease, opacity 0.3s ease;
}
.slide-down-leave-active {
  max-height: 0;
  opacity: 0;
  transition: max-height 0.3s ease, opacity 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

</style>
