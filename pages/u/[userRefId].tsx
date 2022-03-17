import type { NextPage } from 'next'
import { useSession } from "next-auth/react"
import { getUserByRef } from '@controller/User'
import { User } from '@models/User'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faMoneyBill, faGun, faBolt, faHeart, faCrown, faChevronLeft, faChevronRight, faPlus, faEdit, faUpload, faSave} from '@fortawesome/free-solid-svg-icons'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'

interface  Props  {
    stringyfiedUser: string
}

const UserPage: NextPage<Props> = (props)  => {
    let {stringyfiedUser} = props;
    const { data: session } = useSession()
    const [user,setUser] = useState<User>(JSON.parse(stringyfiedUser))
    const userRefId = User.getRefIdStatic(user);
    const isOwner = session && session.user && session.user.refId === userRefId;
    const [userName,setUserName] = useState(user.name);
    const [userNameChangeError, setUserNameChangeError] = useState(false);
    const coreContent = [
        {
            icon: faBolt,
            text:"Max. Energy",
            value:user.energyMAX
        },
        {
            icon: faGun,
            text:"Max. Ammo",
            value:user.ammoMax
        },
        {
            icon:faHeart,
            text:"Max. Health",
            value:user.healthMax
        }
    ]

    const changeName = async () => {
        if(isOwner){
            let res = await fetch("/api/user/changeUsername?username="+userName);
            let result = await res.json() as boolean;
            if(result){
                setUser({
                    ...user,
                    name:userName
                });
            }else{
                setUserNameChangeError(true);
            }
        }
    }

    return (
        <>
            <div className='flex flex-row justify-center w-full mt-5 h-5/6'>
                <div className='w-full h-full mx-6 md:mx-0 md:w-4/5 lg:w-2/3 bg-slate-700'>
                    <div className='flex flex-row justify-between py-3 bg-slate-900'>
                        <div className='pl-4'>
                            <FontAwesomeIcon icon={faChevronLeft} className="text-default" size="3x" />
                        </div>
                        <div className='grid grid-flow-col col-span-2 gap-2 '>
                            <FontAwesomeIcon icon={faCrown} className="text-default" size="3x" />
                            <span className='text-5xl'>{user.level}</span>
                        </div>
                        <div className='pr-4'>
                        <FontAwesomeIcon icon={faChevronRight} className="text-default" size="3x" />
                        </div>
                    </div>
                    <div className='w-full h-min bg-default'>
                        <div className='relative w-full py-1 text-2xl font-bold text-center'>
                            {
                                isOwner ? 
                                <>
                                    <input type="text" value={userName} onChange={(e)=>{setUserName(e.target.value)}} className="text-2xl font-bold text-center bg-default w-min"/>
                                    {
                                        userName !== user.name &&
                                        <div className='absolute top-0 right-0 z-10 pt-1 pr-2' onClick={()=>{changeName()}}>
                                            <FontAwesomeIcon icon={faSave} className="transition-all duration-300 ease-in-out cursor-pointer text-slate-700 hover:text-slate-900 hover:scale-110" size="1x" />
                                        </div>
                                    }
                                </>
                                : 
                                user.name
                            }
                        </div>
                        {
                            isOwner && userNameChangeError &&
                            <div className='text-base text-center bg-red-600'>
                                Username not valid, min 3 chars and max 20 chars
                            </div>
                        }
                    </div>
                    <div className='flex flex-col py-2'>
                        {coreContent.map((x,i)=> (
                            <div key={i} className='grid w-full grid-cols-8'>
                                <div className='w-1/4 col-span-1 py-2 pl-3'>
                                    <FontAwesomeIcon icon={x.icon} className="text-default" size="2x" />
                                </div>
                                <div className='flex flex-col justify-center h-full col-span-4'>
                                    <span className='text-xl font-bold'>{x.text}</span>
                                </div>
                                <div className='flex flex-col justify-center h-full col-span-2'>
                                    <span>{x.value}</span>
                                </div>
                                {
                                    isOwner &&
                                    <div className='col-span-1 w-14'>
                                        <div className="flex flex-col justify-center h-full w-14">
                                            <button className="flex flex-row justify-between px-3 py-2 transition-all duration-500 ease-in-out transform bg-default hover:bg-gradient-to-br hover:from-default hover:to-amber-800 hover:scale-105">
                                                <FontAwesomeIcon icon={faPlus} size="2x" className={"w-10 text-yellow-200 "} />
                                            </button>
                                        </div>
                                    </div>
                                }
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    if (context && context.params && context.params.userRefId) {
        const userRefId = context.params.userRefId as string;
        const user = await getUserByRef(userRefId);
        return {
            props:{
                stringyfiedUser:JSON.stringify(user)
            }
        }
    }else{
        return {
            notFound:true
        }
    }
}



export default UserPage