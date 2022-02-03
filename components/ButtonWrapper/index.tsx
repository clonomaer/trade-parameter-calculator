import React, { ButtonHTMLAttributes, DetailedHTMLProps, useState } from 'react'

export type ButtonWrapperProps = {
    job: () => Promise<void>
}

type HTMLButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>

export type WithButtonWrapperInnerComponentRequiredProps = {
    isLoading?: boolean
    onClick?: HTMLButtonProps['onClick']
    disabled?: HTMLButtonProps['disabled']
}

export default function withButtonWrapper<
    InnerComponentProps extends WithButtonWrapperInnerComponentRequiredProps,
>(
    Component: React.FC<InnerComponentProps>,
): React.FC<InnerComponentProps & ButtonWrapperProps> {
    return function WrapperComponent(props) {
        const [isLoading, setIsLoading] = useState(() => props.isLoading)
        return (
            <Component
                {...props}
                onClick={async e => {
                    if (!isLoading && !props.disabled) {
                        props.onClick?.(e)
                        setIsLoading(true)
                        await props.job?.()
                        setIsLoading(false)
                    }
                }}
                disabled={isLoading || props.disabled}
            />
        )
    }
}
