import { Enhancement, EnhancementData } from "@models/Enhancement";
import EnhancementButton from "@components/buttons/EnhancementButton";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch, useInterval } from '@lib/redux/hooks'
import { selectTop } from '@lib/redux/features/Top/TopSlice'

const EnhancementComponent = ({enhancementData} : { enhancementData : EnhancementData}) => {
    const { data: session, status } = useSession()
    const [amount,setAmount] = useState<number|string>("...");
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectTop)
    useEffect(()=>{
        fetch("/api/user/getAmountOfSpecificEnhancement?id="+Enhancement.getRefIdFromEnhancementDataStatic(enhancementData)).then(res=>res.json()).then(res=>{
            setAmount(res)
            console.log(res);
        }).catch(err=>{
            console.log(err);
        })
    },[user, session, enhancementData,dispatch])

    return (
        <div className="w-full px-1 py-3 h-min">
        <div className="bg-amber-900 px-4 text-2xl pb-0.5 capitalize text-white border-b-2 border-default flex justify-between">
            <div>{enhancementData.data.name}</div>
            <div className="font-normal text-white">You have: {amount}</div>
        </div>
        <div className="py-2 pl-2 bg-slate-900 text-default ">
            <div className="flex flex-row justify-between">
                <div className="w-4/5">
                    <div>Attack: {enhancementData.data.attack??0}</div>
                    <div>Defence: {enhancementData.data.defence??0}</div>
                    {
                        enhancementData.data.upkeep && 
                        <div>Upkeep : {enhancementData.data.upkeep}</div>
                    }
                </div>
                <EnhancementButton enhancementData={enhancementData} showAmount={false} />
            </div>
        </div>
        </div>
    )
}

export default EnhancementComponent;