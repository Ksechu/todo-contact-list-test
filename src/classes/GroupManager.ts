import { Group } from './Group'
import { Contact } from './Contact'
import { StorageService } from './StorageService'
import { GROUPS_KEY } from '../constants/storageKeys'

export class GroupManager {
  private groups: Group[] = []

  constructor() {
    const raw = StorageService.load<Group[]>(GROUPS_KEY)
    if (raw) {
      this.groups = raw.map(g => {
        const group = new Group(g.name)
        group.contacts = g.contacts.map(c => Object.assign(new Contact('', ''), c))
        return group
      })
    }
  }

  getAll(): Group[] {
    return [...this.groups]
  }

  addGroup(name: string): boolean {
    const normalized = name.trim().toLowerCase()
    if (this.groups.some(g => g.name.trim().toLowerCase() === normalized)) return false
    this.groups.push(new Group(name))
    this.save()
    return true
  }

  removeGroup(name: string): void {
    this.groups = this.groups.filter(g => g.name !== name)
    this.save()
  }

  getAllGroup(): String[] {
    return [...this.groups.map(el => el.name)]
  }

  addContactToGroup(groupName: string, contact: Contact): boolean {
    const group = this.groups.find(g => g.name === groupName)
    if (!group) return false
    const success = group.addContact(contact)
    if (success) this.save()
    return success
  }

  removeContactByGroup(groupName: string, contact: Contact): boolean {
    const index = this.groups.findIndex(g => g.name === groupName)
    if (!this.groups[index]) return false
    this.groups[index].contacts = this.groups[index].removeContact(contact.id)
    this.save()
    return true
  }

  getContactsByGroup(groupName: string): Contact[] {
    const group = this.groups.find(g => g.name === groupName)
    return group ? [...group.contacts] : []
  }

  private save(): void {
    StorageService.save(GROUPS_KEY, this.groups)
  }
}
