import { reactive, readonly } from 'vue'
import { Group } from './Group'
import { Contact } from './Contact'
import { StorageService } from './StorageService'
import { GROUPS_KEY } from '../constants/storageKeys'

class GroupManagerClass {
  private state = reactive<{ groups: Group[] }>({ groups: [] })
  Contact: any

  constructor() {
    const raw = StorageService.load<Group[]>(GROUPS_KEY)
    if (raw) {
      this.state.groups = raw.map(g => {
        const group = new Group(g.name)
        group.contacts = g.contacts.map(c => Object.assign(new Contact('', ''), c))
        return group
      })
    }
  }

  get groups() {
    return readonly(this.state.groups)
  }

  getAll(): Group[] {
    return [...this.state.groups]
  }

  addGroup(name: string): boolean {
    const normalized = name.trim().toLowerCase()
    if (this.state.groups.some(g => g.name.trim().toLowerCase() === normalized)) return false
    this.state.groups.push(new Group(name))
    this.save()
    return true
  }

  removeGroup(name: string): boolean {
    this.state.groups = this.state.groups.filter(g => g.name !== name)
    this.save()
    return true
  }

  addContactToGroup(groupName: string, contact: Contact): boolean {
    const group = this.state.groups.find(g => g.name === groupName)
    if (!group) return false
    const success = group.addContact(contact)
    if (success) this.save()
    return success
  }

  removeContactByGroup(groupName: string, contactId: string): boolean {
    const group = this.state.groups.find(g => g.name === groupName)
    if (!group) return false
    group.removeContact(contactId)
    this.save()
    return true
  }

  updateContact(groupName: string, contactId: string, newName: string, newPhone: string): boolean {
    const group = this.state.groups.find(g => g.name === groupName)
    if (!group) return false

    const success = group.updateContact({ id: contactId, name: newName, phone: newPhone })
    if (success) this.save()
    return success
  }


  save(): void {
    StorageService.save(GROUPS_KEY, this.state.groups)
  }
}

// Создаем синглтон
export const GroupManager = new GroupManagerClass()
