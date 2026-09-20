/**
 * Minimaler Storage-Polyfill fuer die Vitest-Node-Umgebung (kein jsdom). Die App prueft
 * `typeof window === 'undefined'`, deshalb reicht ein Objekt mit `sessionStorage`/`localStorage`
 * unter dem Namen `window` sowie den globalen Bindings selbst.
 */
class MemoryStorage implements Storage {
  private map = new Map<string, string>()
  get length(): number {
    return this.map.size
  }
  clear(): void {
    this.map.clear()
  }
  getItem(key: string): string | null {
    return this.map.has(key) ? this.map.get(key)! : null
  }
  key(index: number): string | null {
    return Array.from(this.map.keys())[index] ?? null
  }
  removeItem(key: string): void {
    this.map.delete(key)
  }
  setItem(key: string, value: string): void {
    this.map.set(key, String(value))
  }
}

/** Installiert frische localStorage/sessionStorage-Objekte und gibt sie zum direkten Zugriff zurueck. */
export function installMemoryStorage(): { localStorage: Storage; sessionStorage: Storage } {
  const localStorage = new MemoryStorage()
  const sessionStorage = new MemoryStorage()
  const g = globalThis as unknown as { window: unknown; localStorage: Storage; sessionStorage: Storage }
  g.window = globalThis
  g.localStorage = localStorage
  g.sessionStorage = sessionStorage
  return { localStorage, sessionStorage }
}
