import React, { DetailedHTMLProps, InputHTMLAttributes } from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import { withValidation, WithValidationProps } from 'components/with-validation'
import { withObservable } from 'components/with-observable'
import { useObservable } from 'hooks/observable'
import { map } from 'rxjs'
import { withFormatter } from 'components/with-formatter'

export type InputProps = {
    className?: ClassName
    label?: string
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const Input = withFormatter<
    WithValidationProps<string, InputProps, HTMLInputElement>
>(
    withValidation(
        withObservable(
            function Input({
                className,
                label,
                errorMessage,
                hasError,
                subject,
                formattedValue,
                ref,
                ...props
            }) {
                const length = useObservable(() =>
                    subject.pipe(map(x => x.length)),
                )
                console.log(formattedValue)
                return (
                    <div className={cn('flex m-2 items-center', className)}>
                        {label && (
                            <label className="flex mr-1 flex-grow">{`${label}:`}</label>
                        )}
                        <input
                            className={cn(
                                'border bg-gray-800 rounded-md py-1 px-2 outline-none',
                                hasError && length
                                    ? 'border-red-600 focus:border-red-500'
                                    : 'border-gray-500 focus:border-gray-300',
                            )}
                            onClick={e =>
                                //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                //@ts-ignore
                                e.target.select()
                            }
                            value={formattedValue}
                            {...props}
                        />
                    </div>
                )
            },
            e => e.target.value,
        ),
    ),
)
