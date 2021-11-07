import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React, { PropsWithChildren } from 'react'
import Head from 'next/head'
import LoadingOverlay from 'components/LoadingOverlay'
import { useMainLoadingOverlayMinDelay } from 'hooks/loading-overlay'
import { useMobileVHFix } from 'hooks/mobile-vh-fix'
import { useMobileHoverFix } from 'hooks/mobile-hover-fix'
import MainLayout from 'components/MainLayout'

function SafeHydrate({ children }: PropsWithChildren<unknown>) {
    return (
        <div suppressHydrationWarning>
            {typeof window === 'undefined' ? null : children}
        </div>
    )
}

function MyApp({ Component, pageProps }: AppProps) {
    useMobileVHFix()
    useMobileHoverFix()
    const delayedLoading = useMainLoadingOverlayMinDelay()
    return (
        <SafeHydrate>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no"
                />
            </Head>
            <LoadingOverlay
                spinnerProps={{ big: true }}
                visible={delayedLoading}
                skipInitialTransition
                className={'!z-50 bg-gray-900'}
            />
            <MainLayout>
                <Component {...pageProps} />
            </MainLayout>
        </SafeHydrate>
    )
}
export default MyApp
