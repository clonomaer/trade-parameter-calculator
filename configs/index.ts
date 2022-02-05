export type DisplayDictionaryItem<T = string> = {
    id: T
    name: string
    type?: 'number' | 'string'
}

export type PositionSubType = 'kucoin-usdtm'

const PositionSubTypes: (DisplayDictionaryItem<PositionSubType> & {
    fields: DisplayDictionaryItem[]
})[] = [
    {
        id: 'kucoin-usdtm',
        name: 'Kucoin USDTM',
        fields: [
            { id: 'symbol', name: 'symbol', type: 'string' },
            { id: 'stop', name: 'stop', type: 'number' },
            { id: 'entry', name: 'entry', type: 'number' },
            { id: 'tps', name: 'tps', type: 'string' },
            { id: 'account', name: 'account size', type: 'number' },
            { id: 'risk', name: 'risk percent', type: 'number' },
            { id: 'leverage', name: 'leverage', type: 'number' },
            { id: 'tpWeights', name: 'tp weights', type: 'string' },
        ],
    },
]

const PositionSettings = {
    baseURL: 'https://evening-sands-29070.herokuapp.com/proxy/api/v1',
}

export const config = {
    Delays: {
        min: 300,
        timeout: 20000,
        suggestRefresh: 8000,
        fastLeave: {
            window: 50,
            minDelay: 500,
        },
    },
    PositionSubTypes,
    PositionSettings,
    BrowserLocalStorageCacheKey: 'browser-local-storage-',
}
