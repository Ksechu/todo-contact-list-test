export class Contact {
  id: string
  name: string
  phone: string

  constructor(name: string, phone: string) {
    this.id = crypto.randomUUID()
    this.name = name
    this.phone = phone
  }
}
