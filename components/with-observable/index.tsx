import { useLazyRef } from 'hooks/lazy-ref'
import React, {
    ChangeEvent,
    ChangeEventHandler,
    forwardRef,
    ForwardRefExoticComponent,
    PropsWithoutRef,
    RefAttributes,
    useImperativeHandle,
} from 'react'
import { ReplaySubject, Subject } from 'rxjs'

export type WithObservableRequiredProps<E = Element> = {
    onChange?: ChangeEventHandler<E>
}

export type WithObservableProps<T, P, E> = P &
    WithObservableRequiredProps<E> & { subject?: Subject<T> }

export type WithObservableComponent<T, P, E> = ForwardRefExoticComponent<
    PropsWithoutRef<WithObservableProps<T, P, E>> & RefAttributes<Subject<T>>
>

export function withObservable<
    P,
    E extends Element = HTMLInputElement,
    T = string,
>(
    Component: React.FC<
        P & WithObservableRequiredProps<E> & { subject: Subject<T> }
    >,
    getValue: (e: ChangeEvent<E>) => T,
): WithObservableComponent<T, P, E> {
    return forwardRef<Subject<T>, WithObservableProps<T, P, E>>(
        function WrappedComponent({ onChange, subject, ...props }, ref) {
            const inputObservable = useLazyRef(
                () => subject ?? new ReplaySubject<T>(1),
            )
            useImperativeHandle(ref, () => {
                return inputObservable.current
            })
            return (
                //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                <Component
                    {...props}
                    onChange={e => {
                        onChange?.(e)
                        inputObservable.current.next(getValue(e))
                    }}
                    subject={inputObservable.current}
                />
            )
        },
    )
}
