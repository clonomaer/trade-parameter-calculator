import Button from 'components/Button'
import LongShortSelect from 'components/long-short-select'
import NumberInput from 'components/NumberInput'
import { config } from 'configs'
import { LoadingStatusCtx } from 'contexts/loading-status'
import { useLazyRef } from 'hooks/lazy-ref'
import { useObservable } from 'hooks/observable'
import { useSubscribe } from 'hooks/subscribe'
import type { NextPage } from 'next'
import { PositionSubTypeObservable } from 'observables/position-sub-type'
import React, { useContext, useEffect } from 'react'
import { combineLatest, Subject } from 'rxjs'

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

    useSubscribe(
        () =>
            positionSubType
                ? combineLatest({
                      positionType: PositionSubTypeObservable,
                      positionSubType: PositionSubTypeObservable,
                      fields: combineLatest(
                          fieldSubjects.current
                              .find(val => val.id === positionSubType)!
                              .fields.reduce(
                                  (acc, curr) => ({
                                      ...acc,
                                      [curr.id]: curr.subject,
                                  }),
                                  {},
                              ),
                      ),
                  })
                : undefined,
        x => console.log(x),
        [positionSubType],
    )

    return (
        <div className="flex flex-col h-[var(--h-screen)] w-screen py-3 children:flex children:justify-center">
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
                )?.fields.map(field => (
                    <NumberInput
                        key={`sub-position-${positionSubType}-field-${field.id}`}
                        label={field.name}
                        className="w-80"
                        subject={
                            fieldSubjects.current
                                .find(val => val.id === positionSubType)
                                ?.fields.find(val => val.id === field.id)
                                ?.subject
                        }
                    />
                ))}
            </div>
        </div>
    )
}

export default Home
