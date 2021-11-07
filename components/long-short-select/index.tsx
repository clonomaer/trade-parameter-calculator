import React from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import Button from 'components/Button'
import { useObservable } from 'hooks/observable'
import { PositionTypeObservable } from 'observables/position-type'

export type LongShortSelectProps = {
    className?: ClassName
}

export default function LongShortSelect({
    className,
}: LongShortSelectProps): React.ReactElement | null {
    const positionType = useObservable(PositionTypeObservable)
    return (
        <div className={cn('children:w-48', className)}>
            <Button
                activeClassName="border-green-500 bg-green-900"
                inactiveClassName="border-gray-500"
                active={positionType === 'long'}
                onClick={() => PositionTypeObservable.next('long')}>
                Long
            </Button>
            <Button
                activeClassName="border-red-500 bg-red-900"
                inactiveClassName="border-gray-500"
                active={positionType === 'short'}
                onClick={() => PositionTypeObservable.next('short')}>
                Short
            </Button>
        </div>
    )
}
