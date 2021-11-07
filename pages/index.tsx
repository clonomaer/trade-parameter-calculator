import { LoadingStatusCtx } from 'contexts/loading-status'
import type { NextPage } from 'next'
import React, { useContext, useEffect } from 'react'

const Home: NextPage = () => {
    const loading = useContext(LoadingStatusCtx)
    useEffect(() => {
        loading.next(false)
    }, [])
    return (
        <div className="flex flex-col h-[var(--h-screen)] w-screen py-3"></div>
    )
}

export default Home
