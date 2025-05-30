import { Contact } from './Contact'

export class Group {
  name: string
  contacts: Contact[] = []

  constructor(name: string) {
    this.name = name
  }

  addContact(contact: Contact): boolean {
    const exists = this.contacts.some(c => c.phone === contact.phone)
    if (exists) return false
    this.contacts.push(contact)
    return true
  }

  removeContact(id: string): Contact[] {
    return this.contacts = this.contacts.filter(c => c.id !== id)
  }

  updateContact(updated: Contact): boolean {
    const index = this.contacts.findIndex(c => c.id === updated.id)
    if (index === -1) return false
    this.contacts[index] = updated
    return true
  }
}
