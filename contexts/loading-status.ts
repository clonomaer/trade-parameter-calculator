import { createContext } from 'react'
import { BehaviorSubject } from 'rxjs'

export const LoadingStatusCtx = createContext<BehaviorSubject<boolean>>(
    new BehaviorSubject<boolean>(true),
)
