import Button from 'components/Button'
import LongShortSelect from 'components/long-short-select'
import NumberInput from 'components/NumberInput'
import { config } from 'configs'
import { LoadingStatusCtx } from 'contexts/loading-status'
import { useLazyRef } from 'hooks/lazy-ref'
import { useObservable } from 'hooks/observable'
import type { NextPage } from 'next'
import { PositionSubTypeObservable } from 'observables/position-sub-type'
import React, { useContext, useEffect, useState } from 'react'
import { combineLatest, map, Subject } from 'rxjs'
import { parseFixed, formatFixed } from '@ethersproject/bignumber'
import { calculatePosition } from 'functions/calculate-position'
import { PositionTypeObservable } from 'observables/position-type'
import _ from 'lodash'
import ResultsShowCase from 'components/ResultsShowCase'
import Fade from 'components/Fade'

const Home: NextPage = () => {
    const loading = useContext(LoadingStatusCtx)
    useEffect(() => {
        loading.next(false)
    }, [])

    const positionSubType = useObservable(PositionSubTypeObservable)
    const fieldSubjects = useLazyRef(() =>
        config.PositionSubTypes.map(subType => ({
            id: subType.id,
            fields: subType.fields.map(field => ({
                id: field.id,
                subject: new Subject<string>(),
            })),
        })),
    )

    const results = useObservable(
        () =>
            positionSubType
                ? combineLatest({
                      positionType: PositionTypeObservable,
                      positionSubType: PositionSubTypeObservable,
                      fields: combineLatest(
                          fieldSubjects.current
                              .find(val => val.id === positionSubType)!
                              .fields.reduce(
                                  (acc, curr) => ({
                                      ...acc,
                                      [curr.id]: curr.subject.pipe(
                                          map(x => parseFixed(x, 18)),
                                      ),
                                  }),
                                  {},
                              ),
                      ),
                  }).pipe(
                      map(x => calculatePosition(x)),
                      map(x =>
                          _.reduce(
                              x,
                              (acc, curr, key) => ({
                                  ...acc,
                                  [key]: formatFixed(curr, 18),
                              }),
                              {},
                          ),
                      ),
                  )
                : null,
        { dependencies: [positionSubType] },
    )

    const [displayResults, setDisplayResults] = useState<
        Record<string, string> | null | undefined
    >()

    return (
        <div className="flex flex-col h-[var(--h-screen)] w-screen py-8 children:flex children:justify-center overflow-y-scroll">
            <div>
                <LongShortSelect />
            </div>
            <div>
                {config.PositionSubTypes.map(subType => (
                    <Button
                        key={subType.id}
                        onClick={() =>
                            PositionSubTypeObservable.next(subType.id)
                        }
                        active={positionSubType === subType.id}>
                        {subType.name}
                    </Button>
                ))}
            </div>
            <div className="flex-col mx-auto align-middle justify-center items-center mt-10">
                {config.PositionSubTypes.find(
                    val => val.id === positionSubType,
                )?.fields.map((field, index) => (
                    <NumberInput
                        key={`sub-position-${positionSubType}-field-${field.id}`}
                        label={field.name}
                        className="w-96"
                        subject={
                            fieldSubjects.current
                                .find(val => val.id === positionSubType)
                                ?.fields.find(val => val.id === field.id)
                                ?.subject
                        }
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                setDisplayResults(results)
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
                        }}
                    />
                ))}
                <Button
                    className="w-full mt-4"
                    onClick={() => setDisplayResults(results)}>
                    Run
                </Button>
            </div>
            <Fade
                visible={_.keys(displayResults).length > 0}
                className="!overflow-visible">
                <ResultsShowCase
                    className="mx-auto mt-10 w-96"
                    results={displayResults}
                />
            </Fade>
        </div>
    )
}

export default Home
