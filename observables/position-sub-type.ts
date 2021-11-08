import { config, PositionSubType } from 'configs'
import { BehaviorSubject } from 'rxjs'

export const PositionSubTypeObservable = new BehaviorSubject<PositionSubType>(
    config.PositionSubTypes[0]!.id,
)
