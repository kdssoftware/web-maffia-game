import { faBoxOpen, faBusinessTime, faHome, faUserGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link';
import { useRouter  } from 'next/router';
import { useSession } from "next-auth/react"

const Bottom = () => {
    
    const { data: session, status } = useSession()
    const activeCss = 'bg-gradient-to-br from-slate-500 to-slate-800';
    const buttonCss = 'flex py-5 flex-col justify-center hover:bg-gradient-to-br hover:from-slate-500 hover:to-slate-800 transition-all duration-500 ease-in-out';
    const router = useRouter();
    return (
        <div className="absolute bottom-0 z-10 grid w-full grid-cols-4 bg-slate-900">
            <Link href="/">
                <a>
                    <div className={buttonCss + " " + (router.pathname==="/" ? activeCss:"")}>
                        <FontAwesomeIcon icon={faHome} size="2x" className={(router.pathname==="/" ? "text-default":"text-slate-400")} />
                    </div>
                </a>
            </Link>
            <Link href="/jobs">
                <a>
                    <div className={buttonCss + " " + (router.pathname==="/jobs" ? activeCss:"")}>
                        <FontAwesomeIcon icon={faBusinessTime} size="2x" className={(router.pathname==="/jobs" ? "text-default":"text-slate-400")} />
                    </div>
                </a>
            </Link>
            <Link href="/enhancements">
                <a>
                    <div className={buttonCss + " " + (router.pathname==="/enhancements" ? activeCss:"")}>
                        <FontAwesomeIcon icon={faBoxOpen} size="2x" className={(router.pathname==="/enhancements" ? "text-default":"text-slate-400")} />
                    </div>
                </a>
            </Link>
            <Link href={session?"/u/"+session?.user?.refId : "/" }>
                <a>
                    <div className={buttonCss+ " " + (router.pathname==="/u/[userRefId]" ? activeCss:"")}>
                        <FontAwesomeIcon icon={faUserGear} size="2x" className={(router.pathname==="/u/[userRefId]" ? "text-default":"text-slate-400")} />
                    </div>
                </a>
            </Link>
        </div>
    )
}


export default Bottom;