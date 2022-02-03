class TP {
    static weightSum() {
        return TP.sourceArray.reduce((acc, curr) => acc + curr.weight, 0)
    }
    static entryPrice
    static entryBaseVolume = 0
    static entryQuoteVolume = 0
    static stopLossPrice = 0
    static sourceArray = []

    static initialize(
        entryPrice,
        entryBaseVolume,
        entryQuoteVolume,
        stopLossPrice,
        sourceArray,
    ) {
        this.entryPrice = entryPrice
        this.entryBaseVolume = entryBaseVolume
        this.entryQuoteVolume = entryQuoteVolume
        this.stopLossPrice = stopLossPrice
        this.sourceArray = sourceArray
    }

    weight
    price
    constructor(price, weight) {
        this.price = price
        this.weight = weight ?? 1
    }
    index() {
        return TP.sourceArray.findIndex(x => x.price === this.price)
    }

    relativeWeight() {
        return this.weight / TP.weightSum()
    }

    baseVolume() {
        return TP.entryBaseVolume * this.relativeWeight()
    }

    realizedPnl() {
        return (
            (TP.sourceArray[this.index() - 1]?.realizedPnl() ?? 0) +
            this.baseVolume() * Math.abs(this.price - TP.entryPrice)
        )
    }

    remainingBaseVolume() {
        return (
            TP.entryBaseVolume -
            TP.sourceArray
                .slice(0, this.index() + 1)
                .reduce((acc, tp) => acc + tp.baseVolume(), 0)
        )
    }

    unrealizedQuoteVolume() {
        return this.remainingBaseVolume() * Math.abs(this.price - TP.entryPrice)
    }

    finalRealizedQuoteVolume() {
        return (
            this.realizedPnl() -
            this.remainingBaseVolume() *
                Math.abs(TP.entryPrice - TP.stopLossPrice)
        )
    }

    finalRealizedQuoteVolumeManaged() {
        return (
            this.realizedPnl() +
            this.remainingBaseVolume() *
                (this.index() === 0 ? -1 : 1) *
                Math.abs(
                    TP.entryPrice -
                        (TP.sourceArray[this.index() - 1]?.price ??
                            TP.stopLossPrice),
                )
        )
    }
}
module.exports = TP
