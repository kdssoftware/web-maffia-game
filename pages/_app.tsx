import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"

function MyApp({ Component, pageProps: { session, ...pageProps }} : AppProps) {
  return (
    <SessionProvider session={session}>
      <div className="bg-slate-800 h-screen">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  )
}
export default MyApp