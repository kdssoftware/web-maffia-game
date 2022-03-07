import {  JobData } from "@models/Job"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleDollarToSlot, faDollarSign, faCrown, faBolt} from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

const JobComponent = ({jobData} : {jobData:JobData})   => {
    return (
        <div className="w-full px-1 py-3">
            <div className="bg-amber-900 pl-4 text-2xl pb-0.5 capitalize text-white border-b-2 border-default">
                {jobData.data.name}
            </div>
            <div className="bg-slate-900 text-default pl-2 py-2 ">
                <div className="flex flex-row justify-between">
                    <div className="w-4/5">
                        <div className="flex flex-row w-full my-1">
                            <FontAwesomeIcon icon={faDollarSign} size="2x" className="text-default w-10" />
                            <div className="pt-1 pl-2" > 
                                {jobData.data.minDollars}-{jobData.data.maxDollars}
                            </div>
                        </div>
                        <div className="flex flex-row w-full my-1">
                            <FontAwesomeIcon icon={faCrown} size="2x" className="text-default w-10" />
                            <div className="pt-1 pl-2">
                                Experience +{jobData.data.experience}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center mr-5">
                        <button className="bg-default px-3 py-2 flex flex-row justify-between 
                        hover:bg-gradient-to-br hover:from-default hover:to-slate-600
                        transition-all duration-500 ease-in-out transform hover:scale-105
                        ">
                            <FontAwesomeIcon icon={faBolt} size="2x" className="text-slate-600 w-10" />
                            <div className="text-slate-200 font-bold h-full text-center text-2xl ">
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