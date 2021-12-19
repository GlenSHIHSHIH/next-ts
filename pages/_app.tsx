import '../styles/globals.css'
import type { AppProps } from 'next/app'
import UseAuthState from 'context/context'

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <UseAuthState>
        {/* <Layout> */}
        <Component {...pageProps} />
        {/* </Layout> */}
      </UseAuthState>
    </>
  )
}
export default MyApp
