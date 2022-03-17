import type { NextPage } from 'next'
import { useSession } from "next-auth/react"
import JobComponent from '@components/Job'
import { JobData } from '@models/Job'
import { useState, useEffect } from 'react'
import JobSuccess from '@components/JobSuccess'
import { useAppSelector, useAppDispatch } from '@lib/redux/hooks'
import { selectCurrentJob } from '@lib/redux/features/CurrentJob/CurrentJobSlice'

const Jobs: NextPage = ({ }) => {
    const { data: session, status } = useSession()
    const dispatch = useAppDispatch()
    const currentJob = useAppSelector(selectCurrentJob)
    const [jobs, setJobs] = useState<JobData[]>([])
    useEffect(() => {
        const doAsync = async () => {
            if (session && session.user.refId) {
                const res = await fetch('/api/job/getAvailable?id=' + session.user.refId)
                setJobs(await res.json())
            }
        }
        doAsync()
    }, [session])
    return (
        <>
        <div className='flex flex-row justify-center '>
            <div className='flex flex-col justify-center w-full '> 
            {
                currentJob && 
                <JobSuccess job={currentJob}/>
            }
            {
                jobs.map((jobdata, i) => {
                    return <JobComponent jobData={jobdata}  key={i} />
                }) ?? "no jobs"
            }
            </div>
        </div>
        </>
    )
}


export default Jobs