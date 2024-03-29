import React from 'react'
import { Input } from 'components/Input'
import { NumbersValidatorOperator } from 'operators/numbers-validator'
import { CurrencyFormatterOperatorFactory } from 'operators/currency-formatter'
import cn from 'classnames'
import styles from './styles.module.css'

export type NumberInputProps = Omit<
    React.ComponentProps<typeof Input>,
    'validationFactory' | 'formatterFactory'
>

export default function NumberInput({
    className,
    onWheel,
    onFocus,
    ...props
}: NumberInputProps): React.ReactElement | null {
    return (
        <Input
            {...props}
            validationFactory={NumbersValidatorOperator}
            formatterFactory={CurrencyFormatterOperatorFactory()}
            // type="number"
            className={cn(styles.input, className)}
            onWheel={e => {
                onWheel?.(e)
                ;(e.target as HTMLInputElement).blur()
            }}
            onFocus={e => {
                onFocus?.(e)
                ;(e.target as HTMLInputElement).select()
            }}
        />
    )
}
