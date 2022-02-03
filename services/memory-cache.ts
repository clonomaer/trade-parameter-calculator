export class MemoryCache {
    private storage: { [key: string]: unknown } = {}

    constructor() {
        //
    }

    public store(key: string, value: unknown): void {
        this.storage[key] = value
    }

    public get<T>(key: string): T {
        if (!this.has(key)) {
            throw new Error(`key ${key} doesn't exist in MemoryCache`)
        }

        return this.storage[key] as T
    }

    public getDefault<T>(key: string, init: T): T {
        if (this.has(key)) {
            return this.storage[key] as T
        }

        this.store(key, init)
        return init
    }

    public remove(key: string): void {
        delete this.storage[key]
    }

    public has(key: string): boolean {
        return key in this.storage
    }
}
