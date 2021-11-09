import React, { PropsWithChildren } from 'react'
import cn from 'classnames'
import { useMainLoadingOverlayMinDelay } from 'hooks/loading-overlay'

export default function MainLayout({
    children,
}: PropsWithChildren<unknown>): React.ReactElement | null {
    const delayedLoading = useMainLoadingOverlayMinDelay()
    return (
        <div
            id="MainLayout"
            className={cn(
                // 'px-[max(calc((100vw-75rem)/2),0.5rem)]',
                'min-h-[var(--h-screen)]',
                delayedLoading && 'h-[var(--h-screen)]',
                'flex',
                'justify-center',
                'items-center',
                'overflow-hidden',
                'children:max-w-full',
                'children:max-h-full',
                'bg-gray-900',
                'text-gray-100',
            )}>
            {children}
        </div>
    )
}
