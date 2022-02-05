import { localCache } from './local-cache'

export const showChart$ = localCache.observe<boolean>('show-chart', true)
