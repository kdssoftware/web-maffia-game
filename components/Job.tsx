import {  JobData } from "@models/Job"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faDollarSign} from "@fortawesome/free-solid-svg-icons"
import JobButton from "@components/buttons/JobButton"

const JobComponent = ({jobData} : {jobData:JobData})   => {
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
                    <JobButton jobData={jobData}/>
                </div>
            </div>
        </div>
    )
}

export default JobComponent