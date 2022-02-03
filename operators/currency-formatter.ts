import _ from 'lodash'
import { map, OperatorFunction } from 'rxjs'
import { FormatterOperator } from 'types'
import { onlyNumbers, sanitizeNumbers } from 'utils/sanitize-numbers'

export const CurrencyFormatterOperatorFactory: FormatterOperator<[number?]> = (
    precision?: number,
) => {
    return input =>
        input.pipe(
            map(input => {
                const res = sanitizeNumbers(input)
                    .replace(/[^0-9\.]/g, '')
                    .split('.')
                return (
                    (res[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? '') +
                    (!_.isUndefined(res[1]) ? `.${res[1]}` : '')
                )
            }),
        )
}

export const CurrencyParsersOperator: OperatorFunction<string, string> =
    input => input.pipe(map(onlyNumbers))
