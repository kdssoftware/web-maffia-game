import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'
import { User } from '@models/User'
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie, faCoins, faMoneyBill, faGun, faBolt, faHeart } from '@fortawesome/free-solid-svg-icons'

const Top = ({ userRefId, _user }: { userRefId?: string, _user?: User }) => {
    const { data: session, status } = useSession()
    // let userRefId = props?.userRefId;)
    let [user, setUser] = useState<User>();

    useEffect(() => {
        const doAsync = async () => {
            if (_user && userRefId) {
                throw new Error("userRefId and user are both set");
            } else if (userRefId) {
                const res = await fetch('/api/user/getByRefId?id=' + userRefId);
                setUser(await res.json())
            } else if (!_user && !userRefId && session?.user.refId) {
                const res = await fetch('/api/user/getByRefId?id=' + session?.user.refId);
                setUser(await res.json())
            } else if (_user) {
                setUser(_user);
            }
        }
        doAsync();
    }, [userRefId, _user, session])

    useEffect(()=>{
        if(session && session.user){
            console.log(session.user)
        }
        const doAsync = async () => {
            if(session && session.user.updateTop==true){
                console.log("updating...");
                const res = await fetch('/api/user/getByRefId?id=' + session?.user.refId);
                setUser(await res.json())
                session.user.updateTop=false;
            }
        }
        doAsync();

    },[])

    return (
        <div className="flex flex-row justify-between bg-slate-900 ">
            <div className="flex flex-col w-32 py-3">
                <div className="flex flex-row">
                    <FontAwesomeIcon icon={faUserTie} size="2x" className="w-1/2 text-default" />
                    <div className="grid grid-rows-2 w-1/2">
                        <div className="text-default font-bold">
                            {user?.level??"..."}
                        </div>
                        <div className="text-gray-400">
                            Level
                        </div>
                    </div>
                </div>
                <div className="flex flex-row">
                    <FontAwesomeIcon icon={faCoins} size="2x" className="w-1/2 text-default" />
                    <div className="grid grid-rows-2 w-1/2" >
                        <div className="text-default font-bold" >
                            {user?.chips??"..."}
                        </div>
                        <div className="text-gray-400">
                            Chips
                        </div>
                    </div>
                </div>
                <div className="flex flex-row">
                    <FontAwesomeIcon icon={faMoneyBill} size="2x" className="w-1/2 text-default" />
                    <div className="grid grid-rows-2 w-1/2" >
                        <div className="text-default font-bold">
                            {user?.dollars??"..."}
                        </div>
                        <div className="text-gray-400" >
                            Dollars
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="text-black bg-amber-100 h-16 w-44 text-center font-bold text-2xl border-b-4 border-l-4 border-r-4 border-blue-600 rounded-bl-custom rounded-br-custom flex flex-col">
                    <div className="mt-0.5">
                        Maffia Game
                    </div>
                </div>
                <div className="w-full text-gray-400 text-center">
                    Experience {user?.experience??"..."}/{user?.experienceMax??"..."}
                </div>
            </div>
            <div className="flex flex-col w-32 py-3">
                <div className="flex flex-row">
                    <div className="grid grid-rows-2 w-1/2" >
                        <div className="text-default font-bold">
                            {user?.ammo??"..."}/{user?.ammoMax??"..."}
                        </div>
                        <div className="text-gray-400">
                            Ammo
                        </div>
                    </div>
                    <FontAwesomeIcon icon={faGun} size="2x" className="w-1/2 text-default" />
                </div>
                <div className="flex flex-row">
                    <div className="grid grid-rows-2 w-1/2" >
                        <div className="text-default font-bold">
                            {user?.energy??"..."}/{user?.energyMAX??"..."}
                        </div>
                        <div className="text-gray-400">
                            Energy
                        </div>
                    </div>
                    <FontAwesomeIcon icon={faBolt} size="2x" className="w-1/2 text-default" />
                </div>
                <div className="flex flex-row">
                    <div className="grid grid-rows-2 w-1/2" >
                        <div className="text-default font-bold">
                            {user?.health??"..."}/{user?.healthMax??"..."}
                        </div>
                        <div className="text-gray-400">
                            Health
                        </div>
                    </div>
                    <FontAwesomeIcon icon={faHeart} size="2x" className="w-1/2 text-default" />
                </div>
            </div>
        </div>
    );
}

export default Top