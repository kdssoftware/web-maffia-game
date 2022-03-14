import { EnhancementData } from "@models/Enhancement";
import EnhancementButton from "@components/buttons/EnhancementButton";

const Enhancement = ({enhancementData} : { enhancementData : EnhancementData}) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    return (
        <div className="w-full px-1 py-3 h-min">
        <div className="bg-amber-900 px-4 text-2xl pb-0.5 capitalize text-white border-b-2 border-default flex justify-between">
            <div>{enhancementData.data.name}</div>
            <div className="font-normal text-white">You have: 1</div>
        </div>
        <div className="py-2 pl-2 bg-slate-900 text-default ">
            <div className="flex flex-row justify-between">
                <div className="w-4/5">
                    <div>Attack: {enhancementData.data.attack}</div>
                    <div>Defence: {enhancementData.data.defence}</div>
                </div>
                <EnhancementButton enhancementData={enhancementData} />
            </div>
        </div>
        </div>
    )
}

export default Enhancement;