import { map, OperatorFunction } from 'rxjs'
import { ValidationResults } from 'types'
import { onlyNumbers } from 'utils/sanitize-numbers'

export const NumbersValidatorOperator: OperatorFunction<
    string,
    ValidationResults
> = input =>
    input.pipe(
        map(input => {
            const sanitized = onlyNumbers(input)
            return {
                data: sanitized,
                validation: {
                    passed: sanitized.length > 0,
                },
            }
        }),
    )
