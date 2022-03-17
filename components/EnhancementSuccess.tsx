import EnhancementButton from "./buttons/EnhancementButton";
import type {CurrentEnhancement} from "@models/CurrentEnhancement"

const EnhancementSuccess = ({currentEnhancement}: {currentEnhancement : CurrentEnhancement}) => {
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    return (
        <div className="w-full px-1 py-3 h-min">
            <div className={"py-2 text-4xl font-bold text-center text-white bg-amber-700"}>
                Bought {currentEnhancement.name ?? "..." } x {currentEnhancement.amountBought ?? "..."}
            </div>
            <div className="grid grid-cols-2 gap-2 px-4 pt-1 pb-3 text-white bg-slate-500">
                <div className="flex flex-col col-span-1 ">
                    <div className="pb-2 font-bold">Received:</div>
                    {
                        currentEnhancement && currentEnhancement.attack * currentEnhancement.amountBought > 0 && 
                        <div>
                            Attack : {currentEnhancement ? currentEnhancement.attack * currentEnhancement.amountBought : "..."}
                        </div>
                    }
                    {
                        currentEnhancement && currentEnhancement.defence * currentEnhancement.amountBought > 0 && 
                        <div>
                        Defence : {currentEnhancement ? currentEnhancement.defence * currentEnhancement.amountBought : "..."}
                        </div>
                    }
                </div>
                <EnhancementButton enhancementData={{
                    data:{
                        type:currentEnhancement.type,
                        name:currentEnhancement.name,
                        attack:currentEnhancement.attack,
                        defence:currentEnhancement.defence,
                        cost:currentEnhancement.cost,
                        minLevel:currentEnhancement.minLevel,
                        upkeep:currentEnhancement.upkeep,
                        ref:currentEnhancement.ref,
                    },
                    ref:currentEnhancement.ref,
                }} showAmount={true} />
            </div>
        </div>
    )
}

export default EnhancementSuccess