import '../styles/globals.css'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Bottom from '@components/Bottom'
import Top from '@components/Top'
import { Provider } from 'react-redux'
import store from '@lib/redux/store'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <div className="h-screen bg-slate-800">
          <Top />
          <div className=' top-[172px] bottom-[73px] overflow-y-auto overscroll-y-contain flex-nowrap fixed w-screen'>
          <Component {...pageProps} />
          </div>
          <Bottom />
        </div>
      </Provider>
    </SessionProvider>
  )
}
export default MyApp