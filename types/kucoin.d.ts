export type KCSAPITickerInfo = {
    code: string
    data: {
        sequence: number
        symbol: string
        side: 'buy' | 'sell'
        size: number
        price: string
        bestBidSize: number
        bestBidPrice: string
        bestAskPrice: string
        tradeId: string
        ts: number
        bestAskSize: number
    }
}

type KCSContractInfo = {
    symbol: string
    rootSymbol: string
    type: string
    firstOpenDate: number
    expireDate: null //?
    settleDate: null //?
    baseCurrency: string
    quoteCurrency: string
    settleCurrency: string
    maxOrderQty: number
    maxPrice: number
    lotSize: number
    tickSize: number
    indexPriceTickSize: number
    multiplier: number
    initialMargin: number
    maintainMargin: number
    maxRiskLimit: number
    minRiskLimit: number
    riskStep: number
    makerFeeRate: number
    takerFeeRate: number
    takerFixFee: number
    makerFixFee: number
    settlementFee: null //?
    isDeleverage: boolean
    isQuanto: boolean
    isInverse: boolean
    markMethod: string
    fairMethod: string
    fundingBaseSymbol: string
    fundingQuoteSymbol: string
    fundingRateSymbol: string
    indexSymbol: string
    settlementSymbol: string
    status: string
    fundingFeeRate: number
    predictedFundingFeeRate: number
    openInterest: string
    turnoverOf24h: number
    volumeOf24h: number
    markPrice: number
    indexPrice: number
    lastTradePrice: number
    nextFundingRateTime: number
    maxLeverage: number
    sourceExchanges: string[]
    premiumsSymbol1M: string
    premiumsSymbol8H: string
    fundingBaseSymbol1M: string
    fundingQuoteSymbol1M: string
    lowPrice: number
    highPrice: number
    priceChgPct: number
    priceChg: number
}

export type KCSAPIContractInfo = {
    code: string
    data: KCSContractInfo
}

export type KCSAPIActiveContracts = {
    code: string
    data: KCSContractInfo[]
}
