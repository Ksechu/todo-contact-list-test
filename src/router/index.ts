import { createRouter, createWebHistory } from 'vue-router';
import TestView from '../views/TestView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: TestView }
  ]
})
