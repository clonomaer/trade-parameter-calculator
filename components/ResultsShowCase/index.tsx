import React from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import _ from 'lodash'
import ResultsShowCaseItem from 'components/ResultsShowCaseItem'

export type ResultsShowCaseProps = {
    className?: ClassName
    results?: Record<string, string> | null
    label?: string
}

export default function ResultsShowCase({
    className,
    results,
    label = 'Results',
}: ResultsShowCaseProps): React.ReactElement | null {
    return (
        <div
            className={cn(
                'flex-col align-middle justify-center items-center',
                className,
            )}>
            <label className="mb-2 flex justify-center">{label}</label>
            <div
                className={cn(
                    'border border-primary-dark rounded-xl py-5 px-7',
                )}>
                {_.map(results, (val, key) =>
                    _.isString(val) ? (
                        <ResultsShowCaseItem
                            key={`result-case-${key}`}
                            value={val}
                            id={key}
                        />
                    ) : (
                        <ResultsShowCase
                            results={val}
                            label={key}
                            className="my-2"
                        />
                    ),
                )}
            </div>
        </div>
    )
}
