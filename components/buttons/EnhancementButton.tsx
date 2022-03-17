import { useState } from "react"
import { useAppSelector, useAppDispatch } from '@lib/redux/hooks'
import { selectCurrentEnhancement, purchase } from '@lib/redux/features/CurrentEnhancement/CurrentEnhancementSlice'
import { fetchTopAsync } from '@lib/redux/features/Top/TopSlice'

import { useSession, signOut} from "next-auth/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from "@fortawesome/free-solid-svg-icons"
import { EnhancementData, Enhancement } from "@models/Enhancement"

const EnhancementButton = ({ enhancementData, showAmount = false }: { enhancementData: EnhancementData, showAmount: boolean}) => {
    const { data: session, status } = useSession()
    const dispatch = useAppDispatch()
    const currentEnhancement = useAppSelector(selectCurrentEnhancement)
    const [hover, setHover] = useState(false)
    const [amount, setAmount] = useState<number>(1)
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    const doPurchase = async (enhancementRefId: string, amount: number = 1) => {
        if (session && session.user.refId && enhancementRefId) {
            dispatch(purchase({ enhancementRefId, amount })).then(() => {
                if (session && session.user.refId) {
                    dispatch(fetchTopAsync(session?.user.refId))
                }
            });

        } else {
            signOut();
        }
    }

    return (
        <div className="flex flex-row justify-end">
            {
                showAmount &&
                <div className="flex flex-col justify-center">
                    <input className="w-24 h-12 text-3xl text-right bg-yellow-500 text-slate-900" type="number" min={1} step={1} value={amount} onChange={(e) => { setAmount(e.target.value as unknown as number) }} />
                </div>
            }
            <div className="flex flex-col justify-center mr-5">
                <button className="flex flex-row justify-between px-3 py-2 transition-all duration-500 ease-in-out transform bg-default hover:bg-gradient-to-br hover:from-default hover:to-amber-800 hover:scale-105 "
                    onClick={() => doPurchase(Enhancement.getRefIdFromEnhancementDataStatic(enhancementData),amount)}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <FontAwesomeIcon icon={faCoins} size="2x" className={"w-10 " + (hover ? "text-yellow-500" : "text-yellow-200 ")} />
                    <div className={"h-full text-2xl font-bold text-center " + (hover ? "text-yellow-500" : "text-yellow-200 ")}>
                        {enhancementData.data.cost ? formatter.format(showAmount?enhancementData?.data.cost*amount??1 :  enhancementData?.data.cost) : "..."}
                    </div>
                </button>
            </div>
        </div>
    )
}
export default EnhancementButton