import UseAuthState from 'context/context'
import type { AppProps } from 'next/app'
import React, { StrictMode } from 'react'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {

    return (
        <>
            <UseAuthState>
                <StrictMode>
                    {/* <Layout> */}
                    <Component {...pageProps} />
                    {/* </Layout> */}
                </StrictMode>
            </UseAuthState>
        </>
    )
}
export default MyApp
