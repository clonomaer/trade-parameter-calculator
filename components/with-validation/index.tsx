import {
    WithObservableComponent,
    WithObservableProps,
} from 'components/with-observable'
import { useSubscribe } from 'hooks/subscribe'
import {
    forwardRef,
    ForwardRefExoticComponent,
    PropsWithoutRef,
    RefAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'
import { map, Observable, ReplaySubject, Subject } from 'rxjs'
import { ValidationResults } from 'types'

export type WithValidationProps<T, P, E> = WithObservableProps<T, P, E> & {
    validationFactory?: (
        input: Observable<T>,
    ) => Observable<ValidationResults<T>>
}

export type WithValidationComponent<T, P, E> = ForwardRefExoticComponent<
    PropsWithoutRef<WithValidationProps<T, P, E>> & RefAttributes<Subject<T>>
>

export function withValidation<
    P,
    E extends Element = HTMLInputElement,
    T = string,
>(
    Component: WithObservableComponent<
        T,
        P & { errorMessage?: string; hasError: boolean },
        E
    >,
): WithValidationComponent<T, P, E> {
    return forwardRef<Subject<T>, WithValidationProps<T, P, E>>(
        function WrappedComponent(
            { validationFactory, subject, ...props },
            ref,
        ) {
            const componentRef = useRef<Subject<T>>()
            useImperativeHandle(ref, () => {
                if (componentRef.current) {
                    if (validationFactory) {
                        const res = new ReplaySubject<T>(1)
                        validationFactory(componentRef.current)
                            .pipe(map(v => v.data))
                            .subscribe(res)
                        return res
                    }
                    return componentRef.current
                } else {
                    throw new Error('incompatible component')
                }
            })
            useEffect(() => {
                if (componentRef.current) {
                    validationFactory?.(componentRef.current)
                        .pipe(map(v => v.data))
                        .subscribe(subject)
                }
            }, [])
            const [errorMessage, setErrorMessage] = useState<string>()
            const [hasError, setHasError] = useState<boolean>(false)
            useSubscribe(
                () =>
                    componentRef.current
                        ? validationFactory?.(componentRef.current)
                        : undefined,
                x => {
                    setErrorMessage(x.validation.message),
                        setHasError(!x.validation.passed)
                },
            )
            return (
                //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                <Component
                    ref={componentRef}
                    {...props}
                    {...{
                        hasError,
                        errorMessage,
                        subject: validationFactory ? undefined : subject,
                    }}
                />
            )
        },
    )
}
