import {
    WithObservableComponent,
    WithObservableProps,
} from 'components/with-observable'
import { useObservable } from 'hooks/observable'
import _ from 'lodash'
import {
    forwardRef,
    ForwardRefExoticComponent,
    PropsWithoutRef,
    RefAttributes,
    useRef,
} from 'react'
import { Observable, Subject } from 'rxjs'

export type WithFormatterProps<T, P, E> = WithObservableProps<T, P, E> & {
    formatterFactory?: (input: Observable<T>) => Observable<T>
}

export type WithFormatterComponent<T, P, E> = ForwardRefExoticComponent<
    PropsWithoutRef<WithFormatterProps<T, P, E>> & RefAttributes<Subject<T>>
>

export function withFormatter<
    P,
    E extends Element = HTMLInputElement,
    T = string,
>(
    Component: WithObservableComponent<T, P & { formattedValue: T }, E>,
): WithFormatterComponent<T, P, E> {
    return forwardRef<Subject<T>, WithFormatterProps<T, P, E>>(
        function WrappedComponent({ formatterFactory, ...props }, ref) {
            const innerRef = useRef<Subject<T>>()
            const formattedValue = useObservable(() =>
                formatterFactory && innerRef.current
                    ? formatterFactory?.(innerRef.current)
                    : null,
            )
            return (
                //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                <Component
                    ref={_ref => {
                        if (_.isFunction(ref)) {
                            ref(_ref)
                        } else if (!_.isNil(ref)) {
                            ref.current = _ref
                        }
                        innerRef.current = _ref ?? undefined
                    }}
                    formattedValue={formattedValue}
                    {...props}
                />
            )
        },
    )
}
