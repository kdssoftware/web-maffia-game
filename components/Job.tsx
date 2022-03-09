import {  JobData, Job } from "@models/Job"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleDollarToSlot, faDollarSign, faCrown, faBolt} from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { useAppSelector, useAppDispatch } from '@lib/redux/hooks'
import { useSession, signIn, signOut } from "next-auth/react"
import { fetchTopAsync } from '@lib/redux/features/Top/TopSlice'

const JobComponent = ({jobData} : {jobData:JobData})   => {
    const { data: session, status } = useSession()
    const dispatch = useAppDispatch()
    const doJob = async (jobRefId :string) => {
        const res = await fetch('/api/job/do?id=' + jobRefId)
        const success = await res.json() as boolean
        if(success && session && session.user.refId){
            dispatch(fetchTopAsync(session?.user.refId))
        }
    }
    const [hover,setHover] = useState(false)
    return (
        <div className="w-full px-1 py-3 h-min">
            <div className="bg-amber-900 pl-4 text-2xl pb-0.5 capitalize text-white border-b-2 border-default">
                {jobData.data.name}
            </div>
            <div className="py-2 pl-2 bg-slate-900 text-default ">
                <div className="flex flex-row justify-between">
                    <div className="w-4/5">
                        <div className="flex flex-row w-full my-1">
                            <FontAwesomeIcon icon={faDollarSign} size="2x" className="w-10 text-default" />
                            <div className="pt-1 pl-2" > 
                                {jobData.data.minDollars}-{jobData.data.maxDollars}
                            </div>
                        </div>
                        <div className="flex flex-row w-full my-1">
                            <FontAwesomeIcon icon={faCrown} size="2x" className="w-10 text-default" />
                            <div className="pt-1 pl-2">
                                Experience +{jobData.data.experience}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center mr-5">
                        <button className="flex flex-row justify-between px-3 py-2 transition-all duration-500 ease-in-out transform bg-default hover:bg-gradient-to-br hover:from-default hover:to-amber-800 hover:scale-105 "
                        onClick={()=>doJob(Job.getRefIdFromJobDataStatic(jobData) )}
                        onMouseEnter={()=>setHover(true)}
                        onMouseLeave={()=>setHover(false)}
                        >
                            <FontAwesomeIcon icon={faBolt} size="2x" className={"w-10 "+(hover?"text-yellow-500":"text-yellow-200 ")} />
                            <div className={"h-full text-2xl font-bold text-center "+(hover?"text-yellow-500":"text-yellow-200 ")}>
                                {jobData.data.energy}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobComponent