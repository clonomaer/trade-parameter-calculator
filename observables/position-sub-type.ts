import { config, PositionSubType } from 'configs'
import { BehaviorSubject } from 'rxjs'

export const PositionSubType$ = new BehaviorSubject<PositionSubType>(
    config.PositionSubTypes[0]!.id,
)
