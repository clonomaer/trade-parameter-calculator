import _ from 'lodash'
import { from, ReplaySubject } from 'rxjs'
import { AsyncMapper, CacheService, StorageAPI, UnPromise } from 'types'
import { getSubjectValue } from 'utils/get-subject-value'
import { deepMapAsync } from '../utils/deep-map-async'
import { orderedAsyncChainMapFactory } from '../utils/ordered-async-chain-map'
import { MemoryCache } from './memory-cache'

export class LocalCache implements CacheService {
    private observablesMemoryCacheKey = 'localCacheObservables'

    constructor(
        private storage: StorageAPI,
        private serializers: AsyncMapper[],
        private deserializers: AsyncMapper[],
        private memoryCache: MemoryCache,
    ) {
        if (!this.memoryCache.has(this.observablesMemoryCacheKey)) {
            this.memoryCache.store(this.observablesMemoryCacheKey, {})
        }
    }

    private async deserialize<T = unknown>(
        item: string,
    ): Promise<T | UnPromise<T>> {
        return deepMapAsync(
            JSON.parse(item),
            orderedAsyncChainMapFactory(this.deserializers),
        ) as Promise<T | UnPromise<T>>
    }

    private async serialize(value: unknown): Promise<string> {
        return JSON.stringify(
            await deepMapAsync(
                value,
                orderedAsyncChainMapFactory(this.serializers),
            ),
        )
    }

    public async get<T = unknown>(key: string): Promise<T | UnPromise<T>> {
        const item = await this.storage.read(key)
        if (_.isNull(item) || item === 'undefined') {
            throw new Error(`key ${key} doesn't exist in LocalCache`)
        }
        return this.deserialize(item)
    }

    public async store(key: string, value: unknown): Promise<void> {
        this.storage.write(key, await this.serialize(value))
    }

    public async has(key: string): Promise<boolean> {
        return (await this.storage.getAllKeys()).includes(key)
    }

    public async getDefault<T = unknown>(
        key: string,
        initializer: T,
    ): Promise<T | UnPromise<T>> {
        if (await this.has(key)) {
            return this.get(key)
        }
        // no await
        this.store(key, initializer)
        return initializer
    }

    public async remove(key: string): Promise<void> {
        this.storage.delete(key)
    }

    public async getAllKeys(): Promise<string[]> {
        return this.storage.getAllKeys()
    }

    public observe<T>(
        key: string,
        initializer?: T,
    ): ReplaySubject<T | UnPromise<T>>

    public observe<E>(
        key: string,
        initializer: _.Dictionary<E>,
    ): ReplaySubject<_.Dictionary<E | UnPromise<E>>>

    public observe<E>(
        key: string,
        initializer: E[],
    ): ReplaySubject<(E | UnPromise<E>)[]>

    public observe<T = unknown>(
        key: string,
        initializer?: T,
    ): ReplaySubject<T | UnPromise<T>> {
        const observables = this.memoryCache.get<{
            [key: string]: ReplaySubject<T | UnPromise<T>>
        }>(this.observablesMemoryCacheKey)

        if (!(key in observables)) {
            observables[key] = new ReplaySubject<T | UnPromise<T>>(1)

            const skipNext = { read: false, write: false }

            const rawNext = observables[key]!.next.bind(observables[key]!)
            observables[key]!.next = (value: any) => {
                if (_.isEqual(value, getSubjectValue(observables[key]!))) {
                    return
                }
                rawNext(value)
            }

            const promise = (
                _.isUndefined(initializer)
                    ? this.get<T>(key)
                    : this.getDefault<T>(key, initializer)
            ).catch(() => {
                // ignore
            })
            from(promise).subscribe({
                next: val => val !== undefined && observables[key]!.next(val),
            })

            const rawObservable = this.storage.observe(key)

            observables[key]!.subscribe({
                next: async val => {
                    if (skipNext.write) {
                        skipNext.write = false
                        return
                    }
                    const res = await this.serialize(val)
                    skipNext.read = true
                    rawObservable.next(res)
                },
            })

            const rawSubscription = rawObservable.subscribe({
                next: async raw => {
                    if (skipNext.read) {
                        skipNext.read = false
                        return
                    }
                    if (raw === null) {
                        observables[key]!.error(
                            new Error(`key ${key} deleted from storage`),
                        )
                        rawSubscription.unsubscribe()
                        const _observables = this.memoryCache.get<{
                            [key: string]: ReplaySubject<T | UnPromise<T>>
                        }>(this.observablesMemoryCacheKey)
                        delete _observables[key]
                        this.memoryCache.store(
                            this.observablesMemoryCacheKey,
                            _observables,
                        )
                        return
                    }
                    const res = await this.deserialize<T>(raw)
                    skipNext.write = true
                    observables[key]!.next(res)
                },
            })

            this.memoryCache.store(this.observablesMemoryCacheKey, observables)
        }
        return observables[key]!
    }
}
