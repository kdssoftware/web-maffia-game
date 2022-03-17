import {  JobData } from "@models/Job"
import { useSession } from "next-auth/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faDollarSign} from "@fortawesome/free-solid-svg-icons"
import JobButton from "@components/buttons/JobButton"
import {calcJobDifficulty, getInfoFromDifficulty} from "@utils/jobFunctions";
import { useAppSelector, useAppDispatch } from '@lib/redux/hooks'
import { selectTop } from '@lib/redux/features/Top/TopSlice'
import { useEffect, useState } from "react";

const JobComponent = ({jobData} : {jobData:JobData})   => {
    const dispatch = useAppDispatch()
    const { data: session, status } = useSession()
    const user = useAppSelector(selectTop)
    const [difficulty,setDifficulty] = useState<number|null>(null)

    useEffect(()=>{
        if(user && session){
            setDifficulty(calcJobDifficulty(user.level, jobData.data.minLevel,jobData.data.maxLevel))
        }
     },[jobData.data.maxLevel, jobData.data.minLevel, session, user])
     
    return (
        <div className="w-full px-1 py-3 h-min">
            <div className="bg-amber-900 px-4 text-2xl pb-0.5 capitalize text-white border-b-2 border-default flex justify-between">
                <div>
                    {jobData.data.name}
                </div>
                <div className="font-normal text-white ">
                    {
                        difficulty? 
                        <div className={getInfoFromDifficulty(difficulty)?.twcss}>
                            {getInfoFromDifficulty(difficulty)?.difficultyPercentage}%
                            </div>
                            :
                        <div>...</div>
                    }
                </div>
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
                    <JobButton jobData={jobData}/>
                </div>
            </div>
        </div>
    )
}

export default JobComponent