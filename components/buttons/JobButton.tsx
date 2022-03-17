import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from '@lib/redux/hooks'
import { useSession, signOut } from "next-auth/react"
import { fetchTopAsync } from '@lib/redux/features/Top/TopSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt} from "@fortawesome/free-solid-svg-icons"
import {Job, JobData} from '@models/Job'
import { doJob as fetchDoJob, selectCurrentJob } from '@lib/redux/features/CurrentJob/CurrentJobSlice'

const JobButton = ({jobData} : {jobData:JobData}) => {
    const { data: session, status } = useSession()
    const dispatch = useAppDispatch()
    const currentJob = useAppSelector(selectCurrentJob)
    const [hover,setHover] = useState(false)
    
    const doJob = async (jobRefId :string) => {
        if(session){
            dispatch(fetchDoJob(jobRefId))
        }else{
            signOut();
        }
    }

    useEffect(()=>{
         if(currentJob && session && session.user.refId){
                dispatch(fetchTopAsync(session?.user.refId))
         }
    },[currentJob, dispatch, session])

    return (
        <div className="flex flex-col justify-center mr-5">
            <button className="flex flex-row justify-between px-3 py-2 transition-all duration-500 ease-in-out transform bg-default hover:bg-gradient-to-br hover:from-default hover:to-amber-800 hover:scale-105 "
            onClick={()=>doJob(Job.getRefIdFromJobDataStatic(jobData) )}
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
            >
                <FontAwesomeIcon icon={faBolt} size="2x" className={"w-10 "+(hover?"text-yellow-500":"text-yellow-200 ")} />
                <div className={"h-full text-2xl font-bold text-center "+(hover?"text-yellow-500":"text-yellow-200 ")}>
                    {jobData?.data.energy??"..."}
                </div>
            </button>
        </div>
    )
}
export default JobButton