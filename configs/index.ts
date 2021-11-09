export type DisplayDictionaryItem<T = string> = {
    id: T
    name: string
}

export type PositionSubType = 'multi' | 'single'

const PositionSubTypes: (DisplayDictionaryItem<PositionSubType> & {
    fields: DisplayDictionaryItem[]
})[] = [
    {
        id: 'multi',
        name: 'Multi',
        fields: [
            { id: 'entry', name: 'Entry USDT' },
            { id: 'size', name: 'Size USDT' },
            { id: 'margin', name: 'Margin' },
            { id: 'risk', name: '% Risk' },
            { id: 'fee', name: '% Fee' },
        ],
    },
    {
        id: 'single',
        name: 'Single',
        fields: [
            { id: 'entry', name: 'Entry USDT' },
            { id: 'size', name: 'Size' },
            { id: 'margin', name: 'Margin' },
            { id: 'risk', name: '% Risk' },
            { id: 'fee', name: '% Fee' },
        ],
    },
]

export const config = {
    Delays: {
        min: 1000,
        timeout: 20000,
        suggestRefresh: 8000,
        fastLeave: {
            window: 50,
            minDelay: 500,
        },
    },
    PositionSubTypes,
}
