import React, { DetailedHTMLProps, InputHTMLAttributes, useRef } from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import { useObservable } from 'hooks/observable'
import _ from 'lodash'
import { useLazyRef } from 'hooks/lazy-ref'
import {
    makeRxControlledInput,
    RxControlledInputProps,
} from 'helpers/rx-controlled-input'
import { getSubjectValue } from 'utils/get-subject-value'

export type InputV2Props = {
    className?: ClassName
    label?: string
} & RxControlledInputProps &
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export function InputV2({
    className,
    label,
    data$,
    formatter,
    validator,
    parser,
    onChange,
    ...props
}: InputV2Props) {
    const inputRef = useRef<HTMLInputElement>(null)
    const rxControl = useLazyRef(() =>
        makeRxControlledInput({
            parser,
            validator,
            formatter,
            data$,
        }),
    )

    const input = useObservable(rxControl.current.subject$)

    const validation = useObservable(rxControl.current.inputValidation$)

    return (
        <div className={cn('flex m-2 items-center', className)}>
            {label && (
                <label className="flex mr-1 flex-grow">{`${label}:`}</label>
            )}
            <input
                ref={inputRef}
                className={cn(
                    'border bg-gray-800 rounded-md py-1 px-2 outline-none',
                    !(validation?.passed ?? true) && input?.length
                        ? 'border-red-600 focus:border-red-500'
                        : 'border-gray-500 focus:border-gray-300',
                )}
                onChange={e => {
                    onChange?.(e)
                    rxControl.current.subject$.next(e.target.value)
                }}
                value={getSubjectValue(rxControl.current.subject$) ?? ''}
                {...props}
            />
        </div>
    )
}
