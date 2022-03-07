import '../styles/globals.css'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Bottom from '@components/Bottom'
import Top from '@components/Top'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className="bg-slate-800 h-screen">
        <Top />
        <Component {...pageProps} />
        <Bottom />
      </div>
    </SessionProvider>
  )
}
export default MyApp