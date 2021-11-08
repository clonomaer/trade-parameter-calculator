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
        }, 500)
    }, [flash])
    const spanRef = useRef<HTMLSpanElement>(null)
    const copy = useClipboardCopy(spanRef, () => setFlash(true))
    return (
        <div className={cn('flex w-80 items-center', className)}>
            <div className="flex-grow">{id}:</div>
            <div>
                <span ref={spanRef}>{value}</span>
                <Button className="text-xs" active={flash} onClick={copy}>
                    copy
                </Button>
            </div>
        </div>
    )
}
