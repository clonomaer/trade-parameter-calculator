import React from 'react'
import { Input } from 'components/Input'
import { NumbersValidatorOperator } from 'operators/numbers-validator'
import { CurrencyFormatterOperator } from 'operators/currency-formatter'

export type NumberInputProps = Omit<
    React.ComponentProps<typeof Input>,
    'validationFactory' | 'formatterFactory'
>

export default function NumberInput(
    props: NumberInputProps,
): React.ReactElement | null {
    return (
        <Input
            validationFactory={NumbersValidatorOperator()}
            formatterFactory={CurrencyFormatterOperator()}
            {...props}
        />
    )
}
