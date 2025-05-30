export class StorageService {
  static save<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data))
  }

  static load<T>(key: string): T | null {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }

  static remove(key: string): void {
    localStorage.removeItem(key)
  }
}
