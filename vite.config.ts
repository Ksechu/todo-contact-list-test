import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const repoName = '/todo-contact-list-test/'

export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],
    base: mode === 'production' ? repoName : '/',
  }
})
