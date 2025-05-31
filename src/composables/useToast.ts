import { ref } from 'vue'

type Toast = {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const toasts = ref<Toast[]>([])

let idCounter = 0

export function useToast() {
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = idCounter++
    toasts.value.push({ id, message, type })

    setTimeout(() => {
      removeToast(id)
    }, 2000)
  }

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast,
  }
}
