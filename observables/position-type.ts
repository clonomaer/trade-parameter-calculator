import { BehaviorSubject } from 'rxjs'

export const PositionTypeObservable = new BehaviorSubject<'short' | 'long'>(
    'long',
)
