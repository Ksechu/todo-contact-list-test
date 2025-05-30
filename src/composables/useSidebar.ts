import { ref } from 'vue'

type PanelType = 'group' | 'contact' | null

const isOpen = ref(false)
const panelType = ref<PanelType>(null)

function openSidebar(type: PanelType) {
  isOpen.value = true
  panelType.value = type
}

function closeSidebar() {
  isOpen.value = false
  panelType.value = null
}

export function useSidebar() {
  return { isOpen, panelType, openSidebar, closeSidebar }
}
