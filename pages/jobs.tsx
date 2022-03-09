
//default nextpage

import Top from '@components/Top'
import SignButton from '@components/auth/SignButton'
import type { NextPage } from 'next'
import { faUserTie, faCoins, faMoneyBill, faGun,faCrown, faBolt, faHeart, faL } from '@fortawesome/free-solid-svg-icons'
import { useSession, signIn, signOut } from "next-auth/react"
import { getAvailableJobsForUser } from '@controller/User'
import { getUserByEmail } from '@controller/User'
import JobComponent from '@components/Job'
import { Job, JobData } from '@models/Job'
import { useState, useEffect } from 'react'
import Bottom from '@components/Bottom'
import JobSuccess from '@components/JobSuccess'


const Jobs: NextPage = ({

}) => {
    const { data: session, status } = useSession()
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
            <div className='flex flex-col justify-center w-full mx-12 '> 
            <JobSuccess job={jobs[0]} result={true} receivings={[
                {
                    icon: faMoneyBill,
                    value: ('$' + 100),
                    color: 'text-green-500'
                },
                {
                    icon: faCrown,
                    value:("Experience +" + 1),
                    color:"text-default"
                }
            ]}/>
            {/* <JobSuccess job={jobs[0]} result={false} receivings={[
                {
                    icon: faMoneyBill,
                    value: ('$' + 100),
                    color: 'text-green-500'
                },
                {
                    icon: faCrown,
                    value:("Experience +" + 1),
                    color:"text-default"
                }
            ]}/> */}
            {
                jobs.map((jobdata, i) => {
                    return <JobComponent jobData={jobdata} key={i} />
                }) ?? "no jobs"
            }
            </div>
        </div>
        </>
    )
}


export default Jobs