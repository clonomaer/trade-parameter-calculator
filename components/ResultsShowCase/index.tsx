import React from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import _ from 'lodash'
import ResultsShowCaseItem from 'components/ResultsShowCaseItem'

export type ResultsShowCaseProps = {
    className?: ClassName
    results?: Record<string, string> | null
}

export default function ResultsShowCase({
    className,
    results,
}: ResultsShowCaseProps): React.ReactElement | null {
    return (
        <div
            className={cn(
                'flex-col align-middle justify-center items-center',
                className,
            )}>
            <label className="mb-2 flex justify-center">Results</label>
            <div
                className={cn(
                    'border border-primary-dark rounded-xl py-5 px-7',
                )}>
                {_.map(results, (val, key) => (
                    <ResultsShowCaseItem
                        key={`result-case-${key}`}
                        value={val}
                        id={key}
                    />
                ))}
            </div>
        </div>
    )
}
