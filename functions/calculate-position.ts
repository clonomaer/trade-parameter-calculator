import { BigNumber } from '@ethersproject/bignumber'
import { PositionSubType } from 'configs'

export function calculatePosition(props: {
    positionType: 'short' | 'long'
    positionSubType: PositionSubType
    fields: Record<string, BigNumber>
}): Record<string, BigNumber> {
    return props.fields
}
