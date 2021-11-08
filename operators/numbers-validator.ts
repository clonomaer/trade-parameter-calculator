import { map } from 'rxjs'
import { ValidationOperator } from 'types'
import { sanitizeNumbers } from 'utils/sanitize-numbers'

export const NumbersValidatorOperator: ValidationOperator = () => {
    return input =>
        input.pipe(
            map(input => {
                const sanitized = sanitizeNumbers(input).replace(
                    /[^0-9\.]/g,
                    '',
                )
                return {
                    data: sanitized,
                    validation: {
                        passed: sanitized.length > 0,
                    },
                }
            }),
        )
}
