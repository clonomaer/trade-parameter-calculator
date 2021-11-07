import { useContext, useMemo } from 'react'
import { LoadingStatusCtx } from '../contexts/loading-status'
import { useMinDelay } from './min-delay'
import { useObservable } from './observable'

export function useMainLoadingOverlayMinDelay(): boolean {
    const isLoading = useObservable(useContext(LoadingStatusCtx))
    const isMinDelayOver = useMinDelay(isLoading, {
        isDonePredicate: e => e === false,
        fastLeaveWindow: null,
    })
    const delayedLoadingStatus = useMemo(
        () => (isMinDelayOver ? isLoading ?? true : true),
        [isMinDelayOver, isLoading],
    )
    return delayedLoadingStatus
}
