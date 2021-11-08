export type DisplayDictionaryItem = {
    id: string
    name: string
}

const PositionSubTypes: (DisplayDictionaryItem & {
    fields: DisplayDictionaryItem[]
})[] = [
    {
        id: 'multi',
        name: 'Multi',
        fields: [
            { id: 'id1', name: 'ID 1' },
            { id: 'id2', name: 'some ID2' },
            { id: 'id3', name: 'ID3' },
            { id: 'id4', name: 'ID4' },
        ],
    },
    {
        id: 'single',
        name: 'Single',
        fields: [
            { id: 'id1', name: 'ID1' },
            { id: 'id2', name: 'ID2' },
            { id: 'id3', name: 'ID3' },
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
