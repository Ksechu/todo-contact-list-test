# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# 📱 Контактная книга (Vue 3 + TypeScript)

Интерактивное SPA-приложение для управления контактами и группами. Полностью отзывчивое, с локальным хранилищем и кастомной логикой.
live demo - https://ksechu.github.io/todo-contact-list-test/

## Технологии

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [SCSS](https://sass-lang.com/)
- [IMask.js](https://imask.js.org/)
- [CSS Variables, BEM, animations]

## 📦 Функциональность

- Создание, редактирование, удаление контактов
- Управление группами контактов
- Валидация дубликатов (по номеру и названию)
- Маска ввода номера `+7 (___) ___-__-__`
- Сохранение в `localStorage`
- Тостеры при действиях
- Попап при удалении группы
- Адаптивный интерфейс (мобильный + десктоп)

## Установка и запуск

```bash
# Клонируй репозиторий
git clone  https://ksechu.github.io/todo-contact-list-test.git
cd todo-contact-list-test

# Установка зависимостей
npm install

# Запуск разработки
npm run dev

# Сборка
npm run build

# Деплой на GitHub Pages
npm run deploy
