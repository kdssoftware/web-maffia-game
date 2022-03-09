import '../styles/globals.css'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { Provider } from 'react-redux'
import store from '@lib/redux/store'
import { useEffect } from 'react'
import Layout from '@components/Layout'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
      <SessionProvider session={session}>
        <Provider store={store}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
        </Provider>
      </SessionProvider>
    )
}
export default MyApp