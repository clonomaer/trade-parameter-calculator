import { PositionSubType, config } from 'configs'
import TP from '../services/tp'
import { combineLatest, from, Observable, timer } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import {
    debounceTime,
    distinctUntilChanged,
    distinctUntilKeyChanged,
    filter,
    map,
    mergeMap,
    catchError,
    switchMap,
} from 'rxjs/operators'
import { KCSAPIActiveContracts, KCSAPITickerInfo } from 'types/kucoin'
import _ from 'lodash'

const activeSymbols = ajax<KCSAPIActiveContracts>(
    `${config.PositionSettings.baseURL}/contracts/active`,
).pipe(map(({ response }) => response.data))

function marketPriceOf(symbol: string): Observable<number> {
    return timer(0, 1000).pipe(
        mergeMap(() =>
            ajax.getJSON<KCSAPITickerInfo>(
                `${
                    config.PositionSettings.baseURL
                }/ticker?symbol=${symbol!.toUpperCase()}USDTM`,
            ),
        ),
        map(({ data }) => data.price),
        map(Number),
        catchError(() => [0]),
    )
}

function lotSizeOf(symbol: string) {
    return activeSymbols.pipe(
        map(symbols =>
            symbols.find(e => e.symbol === `${symbol.toUpperCase()}USDTM`),
        ),
        filter(e => e !== undefined),
        map(symbol => symbol!.lotSize * symbol!.multiplier),
    )
}

type InputFields = Record<string, string>

export function calculatePosition(props: {
    positionSubType: Observable<PositionSubType>
    fields: Observable<InputFields>
}): Observable<Record<string, string | Record<string, string>>> {
    const stopLossPrice = props.fields.pipe(
        map(({ stop }) => Number(stop)),
        distinctUntilChanged(),
    )

    // const entryPrice = new ReplaySubject<number>(1)
    const entryPrice = props.fields.pipe(
        map(({ entry, symbol }) => ({ entry: Number(entry), symbol })),
        filter(({ symbol }) => !_.isEmpty(symbol)),
        distinctUntilChanged(_.isEqual),
        debounceTime(500),
        switchMap(({ entry, symbol }) =>
            entry === 0 || _.isNaN(entry)
                ? marketPriceOf(symbol)
                : from([entry]),
        ),
    )
    // .subscribe(entryPrice)

    const lotSize = props.fields.pipe(
        map(({ symbol }) => symbol),
        filter(_.negate(_.isEmpty)),
        distinctUntilChanged(),
        mergeMap(symbol => lotSizeOf(symbol)),
    )

    const rawTpPrices = props.fields.pipe(
        distinctUntilKeyChanged('tps'),
        map(({ tps }) =>
            tps
                ?.split(',')
                .map(Number)
                .filter(x => x != 0 && !_.isNaN(x))
                .sort(),
        ),
    )

    const tps = combineLatest({ entryPrice, rawTpPrices, stopLossPrice }).pipe(
        map(({ entryPrice, rawTpPrices, stopLossPrice }) =>
            entryPrice < stopLossPrice ? rawTpPrices?.reverse() : rawTpPrices,
        ),
        map(prices =>
            prices?.map(
                (price, index) =>
                    new TP(price, config.PositionSettings.tpWeight[index]),
            ),
        ),
    )

    const entryBaseLotVolume = combineLatest({
        entryPrice,
        lotSize,
        stopLossPrice,
    }).pipe(
        map(({ entryPrice, lotSize, stopLossPrice }) =>
            Math.floor(
                (config.PositionSettings.accountSize *
                    config.PositionSettings.risk) /
                    Math.abs(entryPrice - stopLossPrice) /
                    lotSize,
            ),
        ),
    )

    const res = combineLatest({
        entryBaseLotVolume,
        lotSize,
        entryPrice,
        tps,
        stopLossPrice,
    }).pipe(
        map(
            ({
                entryBaseLotVolume,
                lotSize,
                entryPrice,
                tps,
                stopLossPrice,
            }) => {
                const res: Record<string, string | Record<string, string>> = {}
                res['amount'] = String(entryBaseLotVolume)
                const entryBaseVolume = entryBaseLotVolume * lotSize
                const entryQuoteVolume = Math.round(
                    entryBaseVolume * entryPrice,
                )
                res['value'] = `$${entryQuoteVolume}`
                res['margin'] = `$${Math.round(
                    entryQuoteVolume / config.PositionSettings.leverage,
                )}`

                res['risk'] = `$${Math.abs(
                    entryQuoteVolume - stopLossPrice * entryBaseVolume,
                ).toLocaleString()}`

                TP.initialize(
                    entryPrice,
                    entryBaseVolume,
                    entryQuoteVolume,
                    stopLossPrice,
                    tps,
                )

                tps?.forEach((tp, index) => {
                    res[`tp${index + 1}`] = {
                        price: `${tp.price}`,
                        amount: `${Math.round(tp.baseVolume() / lotSize)}`,
                        ...(index !== tps.length - 1
                            ? {
                                  PNL: `$${Math.round(
                                      tp.unrealizedQuoteVolume(),
                                  )}`,
                                  RPNL: `$${Math.round(tp.realizedPnl())}`,
                              }
                            : {}),
                        FPNL: `${
                            tp.finalRealizedQuoteVolume() < 0 ? '-' : ''
                        }$${Math.abs(
                            Math.round(tp.finalRealizedQuoteVolume()),
                        )}`,
                        ...(index !== tps.length - 1
                            ? {
                                  'FPNL Managed': `${
                                      tp.finalRealizedQuoteVolumeManaged() < 0
                                          ? '-'
                                          : ''
                                  }$${Math.abs(
                                      Math.round(
                                          tp.finalRealizedQuoteVolumeManaged(),
                                      ),
                                  )}`,
                              }
                            : {}),
                    }
                })

                return res
            },
        ),
    )

    return res
}
