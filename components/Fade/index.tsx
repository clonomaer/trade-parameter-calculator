import React, {
    ForwardedRef,
    forwardRef,
    HTMLProps,
    PropsWithoutRef,
} from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import { animated, useSpring, useTransition } from 'react-spring'
import { useMeasure } from 'hooks/measure'

export type FadeMode = 'opacity' | 'height' | 'width'

export type FadeProps = PropsWithoutRef<HTMLProps<HTMLDivElement>> & {
    className?: ClassName
    classNames?: { wrapper?: ClassName }
    visible: boolean
    mode?: FadeMode
    skipInitialTransition?: boolean
}

function InnerFade(
    {
        className,
        classNames,
        visible,
        mode = 'opacity',
        children,
        skipInitialTransition,
        ...props
    }: FadeProps,
    ref: ForwardedRef<HTMLDivElement>,
): React.ReactElement | null {
    const [measure, { height, width }] = useMeasure<HTMLDivElement>()
    const transitions = useTransition(visible, {
        from: { opacity: skipInitialTransition ? 1 : 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        reverse: visible,
    })
    const dimensions = useSpring({
        ...(mode === 'height' ? { height: visible ? height : 0 } : {}),
        ...(mode === 'width' ? { width: visible ? width : 0 } : {}),
        ...(['height', 'width'].includes(mode)
            ? { margin: visible ? '' : 0 }
            : {}),
    })
    return (
        <>
            {transitions(
                (styles, item) =>
                    item && (
                        <animated.div
                            style={{
                                ...styles,
                                ...dimensions,
                                transitionProperty: 'margin',
                            }}
                            className={cn(
                                'overflow-hidden',
                                'transition-all',
                                className,
                            )}
                            ref={ref}
                            {...props}>
                            <div
                                ref={measure}
                                className={cn(classNames?.wrapper)}>
                                {children}
                            </div>
                        </animated.div>
                    ),
            )}
        </>
    )
}

const Fade = forwardRef(InnerFade)
export default Fade
