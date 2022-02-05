import Button from 'components/Button'
import { config } from 'configs'
import { LoadingStatusCtx } from 'contexts/loading-status'
import { useObservable } from 'hooks/observable'
import type { NextPage } from 'next'
import { PositionSubType$ } from 'observables/position-sub-type'
import React, { useContext, useEffect, useState } from 'react'
import { calculatePosition } from 'functions/calculate-position'
import _ from 'lodash'
import ResultsShowCase from 'components/ResultsShowCase'
import Fade from 'components/Fade'
import { filter, map } from 'rxjs/operators'
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets'
import { Fields$, FieldSubjects } from 'observables/field-subjects'
import NumberInputV2 from 'components/NumberInputV2'
import { InputV2 } from 'components/InputV2'
import { showChart$ } from 'contexts/show-chart'

const MemoizedChart = React.memo<{ symbol: string | null | undefined }>(
    ({ symbol }) => (
        <AdvancedRealTimeChart
            theme="dark"
            symbol={
                (symbol === 'KUCOIN:XBTUSDT' ? undefined : symbol) ??
                'KUCOIN:BTCUSDT'
            }
            autosize={true}
            interval="5"
        />
    ),
)

const Home: NextPage = () => {
    const loading = useContext(LoadingStatusCtx)
    useEffect(() => {
        loading.next(false)
    }, [])

    const positionSubType = useObservable(PositionSubType$)

    const symbol = useObservable(() =>
        FieldSubjects[PositionSubType$.getValue()]['symbol']?.pipe(
            map(String),
            map(symbol => `KUCOIN:${symbol?.toUpperCase() ?? 'BTC'}USDT`),
        ),
    )

    const results = useObservable(
        () =>
            calculatePosition({
                positionSubType: PositionSubType$,
                //TODO: remove this, let the calculator decide on which fields to pick
                fields: Fields$.pipe(
                    map(x => x[PositionSubType$.getValue()]),
                    filter(_.negate(_.isUndefined)),
                ),
            }).pipe(
                map(results =>
                    _.reduce(
                        results,
                        (acc, curr, key) => ({
                            ...acc,
                            [key]: _.isNumber(curr)
                                ? curr.toLocaleString()
                                : curr,
                        }),
                        {},
                    ),
                ),
            ),
        { dependencies: [positionSubType] },
    )

    const showChart = useObservable(showChart$)

    return (
        <div className="flex w-screen justify-center overflow-auto">
            {showChart && (
                <div className="flex flex-grow children:w-full">
                    <div>
                        <MemoizedChart symbol={symbol} />
                    </div>
                </div>
            )}
            <div className="flex flex-col h-[var(--h-screen)] flex-grow-0 px-5 children:flex children:justify-center">
                {/* <div>
                    {config.PositionSubTypes.map(subType => (
                        <Button
                            key={subType.id}
                            job={async () =>
                                PositionSubTypeObservable.next(subType.id)
                            }
                            active={positionSubType === subType.id}>
                            {subType.name}
                        </Button>
                    ))}
                </div> */}
                <Button
                    active={showChart}
                    job={async () => showChart$.next(!showChart)}>
                    show chart
                </Button>
                <div className="flex-col mx-auto align-middle justify-center items-center mt-5">
                    {config.PositionSubTypes.find(
                        val => val.id === positionSubType,
                    )?.fields.map((field, index) => {
                        const props = {
                            autoFocus: index === 0,
                            key: `sub-position-${positionSubType}-field-${field.id}`,
                            label: field.name,
                            className: 'w-96',
                            data$: FieldSubjects[PositionSubType$.getValue()][
                                field.id
                            ],
                            onKeyPress: (
                                e: React.KeyboardEvent<HTMLInputElement>,
                            ) => {
                                if (e.key === 'Enter') {
                                    const fields =
                                        Array.from(
                                            document.querySelectorAll('input'),
                                        ) || []
                                    const position = fields.indexOf(
                                        e.target as HTMLInputElement,
                                    )
                                    fields[position + 1]?.focus()
                                    if (index === fields.length - 1) {
                                        ;(e.target as HTMLInputElement).blur()
                                    }
                                }
                            },
                            // defaultValue: ,
                        }
                        if (field.type === 'number') {
                            return <NumberInputV2 {...props} />
                        } else {
                            return <InputV2 {...props} />
                        }
                    })}
                </div>
                <Fade
                    visible={_.keys(results).length > 0}
                    className="!overflow-visible">
                    <ResultsShowCase
                        className="mx-auto mt-10 w-96"
                        results={results}
                    />
                </Fade>
            </div>
        </div>
    )
}

export default Home
