export class Contact {
  id: string
  name: string
  phone: string
  group: string

  constructor(name: string, phone: string, group: string) {
    this.id = crypto.randomUUID()
    this.name = name
    this.phone = phone
    this.group = group
  }
}
