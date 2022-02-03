import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import { useClipboardCopy } from 'hooks/clipboard-copy'
import Button from 'components/Button'

export type ResultsShowCaseItemProps = {
    className?: ClassName
    id: string
    value: string
}

export default function ResultsShowCaseItem({
    className,
    id,
    value,
}: ResultsShowCaseItemProps): React.ReactElement | null {
    const [flash, setFlash] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setFlash(false)
        }, 300)
    }, [flash])
    const spanRef = useRef<HTMLSpanElement>(null)
    const copy = useClipboardCopy(spanRef, () => setFlash(true))
    return (
        <div className={cn('flex w-full items-center', className)}>
            <div className="flex-grow">{id}:</div>
            <div>
                <span ref={spanRef}>{value}</span>
                <Button
                    className="text-xs inline-flex ml-3 mr-0 text-3xl !px-3 !py-1"
                    active={flash}
                    job={copy}>
                    ⎘
                </Button>
            </div>
        </div>
    )
}
