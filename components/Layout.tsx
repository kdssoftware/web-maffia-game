import Bottom from '@components/Bottom'
import Top from '@components/Top'
import { useSession,signIn } from "next-auth/react"

const Layout = ({ children} :
    { children: React.ReactNode }
    ) : JSX.Element => {
        const { data: session,status } = useSession()
        if(status === "unauthenticated"){
            signIn();
            return (<div></div>)
        }
        if(status==="authenticated"){
            return (
                <div className="h-screen text-white bg-slate-800">
                    <Top />
                    <div className=' top-[172px] bottom-[73px] overflow-y-auto overscroll-y-contain flex-nowrap fixed w-screen'>
                        {
                            children
                        }
                    </div>
                    <Bottom />
              </div>
            )
        }
        return (<div></div>)

}

export default Layout