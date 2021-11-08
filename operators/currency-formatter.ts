import _ from 'lodash'
import { map } from 'rxjs'
import { FormatterOperator } from 'types'
import { sanitizeNumbers } from 'utils/sanitize-numbers'

export const CurrencyFormatterOperator: FormatterOperator = () => {
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
