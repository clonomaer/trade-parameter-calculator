import _ from 'lodash'
import { from, fromEvent, ReplaySubject } from 'rxjs'
import { filter, mergeMap } from 'rxjs/operators'
import {
    StorageAPI,
    StorageAPIWriteOptions,
    WindowLocalStorageEvent,
} from 'types'
import { MemoryCache } from './memory-cache'
import { config } from '../configs'
import { Window$ } from 'observables/window'

type ObservablesCache = { [key: string]: ReplaySubject<string | null> }

export class BrowserLocalStorageAPI implements StorageAPI {
    private observablesMemoryCacheKey = 'browserLocalStorageObservables'
    constructor(private memoryCache: MemoryCache) {
        if (!this.memoryCache.has(this.observablesMemoryCacheKey)) {
            this.memoryCache.store(this.observablesMemoryCacheKey, {})
        }
    }
    public async write(
        key: string,
        value: string,
        { silent }: StorageAPIWriteOptions = {},
    ): Promise<void> {
        if (!silent) {
            const observables = this.memoryCache.get<ObservablesCache>(
                this.observablesMemoryCacheKey,
            )
            if (key in observables) {
                observables[key]!.next(value)
                return
            }
        }
        localStorage.setItem(
            config.BrowserLocalStorageCacheKey.concat(key),
            value,
        )
    }

    public async read(key: string): Promise<string | null> {
        return localStorage.getItem(
            config.BrowserLocalStorageCacheKey.concat(key),
        )
    }

    public async delete(key: string): Promise<void> {
        localStorage.removeItem(key)
    }

    public async getAllKeys(): Promise<string[]> {
        return Object.keys(localStorage).map(key =>
            key.replace(config.BrowserLocalStorageCacheKey, ''),
        )
    }

    public observe(key: string): ReplaySubject<string | null> {
        const observables = this.memoryCache.get<ObservablesCache>(
            this.observablesMemoryCacheKey,
        )
        if (!(key in observables)) {
            observables[key] = new ReplaySubject<string | null>(1)

            const rawNext = observables[key]!.next.bind(observables[key]!)
            observables[key]!.next = (value: string) => {
                let current
                const sub = observables[key]!.subscribe({
                    next: val => {
                        current = val
                    },
                })
                sub.unsubscribe()
                if (_.isEqual(value, current)) {
                    return
                }
                rawNext(value)
            }

            observables[key]!.subscribe({
                next: value => {
                    if (value === null) {
                        return this.delete(key)
                    }
                    return this.write(key, value, { silent: true })
                },
            })

            this.getAllKeys().then(keys => {
                if (keys.includes(key)) {
                    from(this.read(key)).subscribe({
                        next: val => observables[key]!.next(val),
                    })
                }
            })

            Window$.pipe(
                mergeMap(win =>
                    fromEvent<WindowLocalStorageEvent>(win, 'storage'),
                ),
                filter(
                    ev =>
                        ev.key ===
                        config.BrowserLocalStorageCacheKey.concat(key),
                ),
                mergeMap(ev => this.read(ev.key)),
            ).subscribe({
                next: val => observables[key]!.next(val),
            })

            this.memoryCache.store(this.observablesMemoryCacheKey, observables)
        }
        return observables[key]!
    }
}
