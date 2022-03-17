import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt } from '@fortawesome/free-solid-svg-icons'
import JobButton from "@components/buttons/JobButton"
import {CurrentJob} from "@models/CurrentJob"


const JobSuccess = (
    {job } : {job : CurrentJob}
        
) => {
    const receivingsMap = job.receivings?.map(receiving =>
        <div className="flex flex-row w-full" key={receiving.value}>
            {
                receiving.icon &&
                <FontAwesomeIcon icon={receiving.icon} size="2x" className={receiving.color} />
            }
            <div className="mx-4 my-1">
                {receiving.value}
            </div>
        </div>
    )
    return (
        <div className="w-full px-1 py-3 h-min">
            <div className="bg-slate-700">
            <div className={"py-1 text-4xl font-bold text-center text-white "+(job.result?"bg-green-700":"bg-red-700")}>
                {job.result ? "Success" : "Failed"}
            </div>
            <div className="px-2 py-1 text-xl text-white">
                {job.job?.data?.name ?? "..."}
            </div>
            <div className="grid grid-cols-5 gap-4 px-4 pt-1 pb-3 text-white bg-slate-500">
                {
                    job.result &&
                    <div className="flex flex-col col-span-2 ">
                        <div className="pb-2 font-bold">Received:</div>
                        {receivingsMap}
                    </div>
                }
                <div className={job.result?"col-span-2":"col-span-4"}>
                    <div className="pb-2 font-bold">Used:</div>
                    <div className="flex flex-row w-full" >
                        <FontAwesomeIcon icon={faBolt} size="2x" className={"text-yellow-500"} />
                        <div className="mx-4 my-1">
                            {job.job?.data?.energy ?? "..."}
                        </div>
                    </div>
                </div>
                <JobButton jobData={job.job} />
            </div>
            </div>
        </div>
    )
}

export default JobSuccess