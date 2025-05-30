<template>
  <div>
    <h2>Тест классов</h2>
    <button @click="createTestContact">Создать контакт</button>
    <ul>
      <li v-for="contact in contacts" :key="contact.id">
        {{ contact.name }} — {{ contact.phone }} ({{ contact.group }})
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Contact } from '../classes/Contact';
import { StorageService } from '../classes/StorageService';

export default defineComponent({
  name: 'ContactList',
  components: {},
  data() {
    return {
      CONTACTS_KEY: 'test-contacts',
      contacts: [] as Contact[],
    };
  },
  
  mounted() {
    const stored = StorageService.load<Contact[]>(this.CONTACTS_KEY);
    this.contacts = stored || [];
  },
  
  methods: {
    createTestContact() {
      const newContact = new Contact('Иван Иванов', '+7 (999) 123-45-67', 'Друзья');
      this.contacts.push(newContact);
      StorageService.save(this.CONTACTS_KEY, this.contacts);
    },
  },
});
</script>