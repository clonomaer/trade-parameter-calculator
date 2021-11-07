import React from 'react'
import cn from 'classnames'
import LoadingSpinner, { LoadingSpinnerProps } from 'components/LoadingSpinner'
import { ClassName } from 'types'
import Fade from 'components/Fade'

export type LoadingOverlayProps = {
    className?: ClassName
    spinnerProps?: LoadingSpinnerProps
    visible: boolean
    skipInitialTransition?: boolean
}

/**@description either provide visible/animationDuration/delay OR renderCondition/fadeOutCondition */
export default function LoadingOverlay({
    className,
    spinnerProps,
    visible,
    skipInitialTransition,
}: LoadingOverlayProps): React.ReactElement | null {
    return (
        <Fade
            visible={visible}
            skipInitialTransition={skipInitialTransition}
            classNames={{
                wrapper: cn(
                    'flex',
                    'justify-center',
                    'items-center',
                    'absolute',
                    'inset-0',
                    'z-40',
                    className,
                ),
            }}>
            <LoadingSpinner {...spinnerProps} />
        </Fade>
    )
}
