
import { EnhancementData } from "@models/Enhancement"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faMoneyBill } from '@fortawesome/free-solid-svg-icons'
import EnhancementButton from "./buttons/EnhancementButton";
import type {CurrentEnhancement} from "@models/CurrentEnhancement"

const EnhancementSuccess = ({currentEnhancement, amount=1}: {currentEnhancement : CurrentEnhancement, amount:number}) => {
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    return (
        <div className="w-full px-1 py-3 h-min">
            <div className={"py-1 text-4xl font-bold text-center text-white bg-amber-700"}>
                Bought {currentEnhancement.name ?? "..." } x {amount ?? "..."}
            </div>
            <div className="grid grid-cols-5 gap-4 px-4 pt-1 pb-3 text-white bg-slate-500">
                <div className="flex flex-col col-span-2 ">
                    <div className="pb-2 font-bold">Received:</div>
                    
                </div>
                <div className={"col-span-2"}>
                    <div className="pb-2 font-bold">Used:</div>
                    <div className="flex flex-row w-full" >
                        <FontAwesomeIcon icon={faMoneyBill} size="2x" className={"text-yellow-500"} />
                        <div className="mx-4 my-1">
                            {currentEnhancement && amount? formatter.format(currentEnhancement.cost*amount) : "..."}
                        </div>
                    </div>
                </div>
                {/* <EnhancementButton enhancementData={enhancementData} /> */}
            </div>
        </div>
    )
}

export default EnhancementSuccess