# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# 📱 Contact book (Vue 3 + TypeScript)

An interactive SPA app for managing contacts and groups. Fully responsive, with local storage and custom logic.
live demo - https://ksechu.github.io/todo-contact-list-test/

## Technologies

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [SCSS](https://sass-lang.com/)
- [IMask.js](https://imask.js.org/)
- [CSS Variables, BEM, animations]

## 📦 Functionality

- Create, edit, and delete contacts
- Manage contact groups
- Duplicate validation (by number and name)
- Number input mask: `+7 (___) ___-__-__`
- Save to `localStorage`
- Toasters on actions
- Pop-up when deleting a group
- Responsive interface (mobile + desktop)

## Installation and launch

```bash
# Clone the repository
git clone  https://ksechu.github.io/todo-contact-list-test.git
cd todo-contact-list-test

# Installing dependencies
npm install

# Start of development
npm run dev

# Сборка
npm run build

# Деплой на GitHub Pages
npm run deploy
