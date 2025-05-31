export class ContactValidator {
  static isPhoneValid(phone: string): boolean {
    const phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/
    return phoneRegex.test(phone)
  }
}
