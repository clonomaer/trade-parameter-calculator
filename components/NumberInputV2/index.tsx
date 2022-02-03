import React from 'react'
import { NumbersValidatorOperator } from 'operators/numbers-validator'
import {
    CurrencyFormatterOperatorFactory,
    CurrencyParsersOperator,
} from 'operators/currency-formatter'
import cn from 'classnames'
import styles from './styles.module.css'
import { InputV2 } from 'components/InputV2'

export type NumberInputProps = Omit<
    React.ComponentProps<typeof InputV2>,
    'validationFactory' | 'formatterFactory'
>

export default function NumberInputV2({
    className,
    onWheel,
    onFocus,
    ...props
}: NumberInputProps): React.ReactElement | null {
    return (
        <InputV2
            {...props}
            validator={NumbersValidatorOperator}
            formatter={CurrencyFormatterOperatorFactory()}
            parser={CurrencyParsersOperator}
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
