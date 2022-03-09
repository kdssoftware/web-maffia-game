import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'
import { User } from '@models/User'
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie, faCoins, faMoneyBill, faGun, faBolt, faHeart } from '@fortawesome/free-solid-svg-icons'
import { useAppSelector, useAppDispatch, useInterval } from '@lib/redux/hooks'
import { fetchTopAsync, selectTop } from '@lib/redux/features/Top/TopSlice'
import mstoMin from '@utils/mstoMin'
// @next/react-refresh-utils
const Top = () => {
    const { data: session, status } = useSession()
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectTop)
    const [energyTiming, setEnergyTiming] = useState(user?.timings.energyFull??null);
    const [energyTimingStarted, setEnergyTimingStarted] = useState(false);
    const [newEnergy,setNewEnergy] = useState<number|null>(null)
    const [energyTimerInterval,setEnergyTimerInterval] = useState<NodeJS.Timer|null>(null)
    const [experienceBar,setExperienceBar] = useState<number>(0)
    const [hover,setHover] = useState<string|null>(null)
    const [hoverColor, setHoverColor] = useState<string|null>(null)
    
    useEffect(()=>{
        const hoverItems = [{name:"health",color:"red-500",},{name:"energy",color:"yellow-500",},{name:"dollars",color:"green-500",},{name:"ammo",color:"blue-500",},{name:"chips",color:"default",},{name:"level",color:"default",}];
        if(hover){
            setHoverColor(hoverItems.find(item=>item.name===hover)?.color||null)
        }
    },[hover])
    
    const energyTimer = ()=>{
        if(user && newEnergy !== user.energyMAX && user.timings.energyFull){
            const timeUntil = ((user?.timings.energyFull ?? 0) - Date.now());
            console.log("ping with ",timeUntil)
            if(timeUntil <= 0){
                setEnergyTimingStarted(false);
                setNewEnergy(user.energyMAX);
                return;
            }
            let timeUntilNewEnergyinMs = ((user?.timings.energyFull ?? 0) - Date.now())% (5 * 1000 * 60);
            let timeUntilNewEnergyinS = Math.floor(timeUntilNewEnergyinMs/1000)
            console.log(timeUntilNewEnergyinS, "s until next energy");
            setEnergyTiming(timeUntilNewEnergyinMs);
            if(timeUntilNewEnergyinS === 0 && user?.energy){
                console.log("5 min mark, energy plus one");
                if(newEnergy === null){
                    console.log("plus one");
                    setNewEnergy(user?.energy+1)
                }else{
                    setNewEnergy(newEnergy+1)
                }
            }
        }
    }

    useEffect(()=>{
        if (!user && session && session.user.refId) {
            dispatch(fetchTopAsync(session?.user.refId)) //fetch user data
        }
        if(user){
            setExperienceBar(Math.floor(Number((user?.experience/user?.experienceMax)*100))); // expierience bar width
            setNewEnergy(user?.energy); // frontend energy value
        }
        if(user && !energyTimingStarted && user.timings.energyFull && user?.energy !== user.energyMAX){ // checking if energyTimer should start
            setEnergyTimingStarted(true);
            if(energyTimerInterval === null){ // if the interval is not set
                console.log("started");
                setEnergyTimerInterval(setInterval(energyTimer, 1000))
            }
        }else if(user && energyTimerInterval && !user.timings.energyFull){
            console.log("stopped");
            setEnergyTimingStarted(false);
            clearInterval(energyTimerInterval);
            setEnergyTimerInterval(null);
            setEnergyTiming(null)
        }
    },[dispatch, session, user])
    

    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      
    return (
        <>
        <div className="hidden text-green-500 text-blue-500">{/* FOR TAILWIND CSS  */}</div> 
        <div className="z-10 flex flex-row justify-between cursor-default bg-slate-900">
            <div className="flex flex-col w-32 py-3">
                <div className="flex flex-row" onMouseOver={()=>{setHover("level")}} onMouseLeave={()=>{setHover(null)}}>
                    <FontAwesomeIcon icon={faUserTie} size="2x" className={"w-1/2 "+(hover==="level"?"text-"+hoverColor:"text-default")} />
                    <div className="grid w-1/2 grid-rows-2">
                        <div className={"font-bold "+(hover==="level"?"text-"+hoverColor:"text-default")}>
                            {user?.level??"..."}
                        </div>
                        <div className="text-gray-400">
                            Level
                        </div>
                    </div>
                </div>
                <div className="flex flex-row" onMouseOver={()=>{setHover("chips")}} onMouseLeave={()=>{setHover(null)}}>
                    <FontAwesomeIcon icon={faCoins} size="2x" className={"w-1/2 "+(hover==="chips"?"text-"+hoverColor:"text-default")} />
                    <div className="grid w-1/2 grid-rows-2" >
                        <div className={"font-bold "+(hover==="chips"?"text-"+hoverColor:"text-default")} >
                            {user?.chips??"..."}
                        </div>
                        <div className="text-gray-400">
                            Chips
                        </div>
                    </div>
                </div>
                <div className="flex flex-row" onMouseOver={()=>{setHover("dollars")}} onMouseLeave={()=>{setHover(null)}}>
                    <FontAwesomeIcon icon={faMoneyBill} size="2x" className={"w-1/2 "+(hover==="dollars"?"text-"+hoverColor:"text-default")} />
                    <div className="grid w-1/2 grid-rows-2" >
                        <div className={"font-bold "+(hover==="dollars"?"text-"+hoverColor:"text-default")}>
                            {user?.dollars?formatter.format(user?.dollars):"..."}
                        </div>
                        <div className="text-gray-400" >
                            Dollars
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col" >
                <div className="flex flex-col h-16 text-2xl font-bold text-center text-black border-b-4 border-l-4 border-r-4 border-blue-600 bg-amber-100 w-44 rounded-bl-custom rounded-br-custom">
                    <div className={"mt-0.5"} >
                        Maffia Game
                    </div>
                </div>
                <div className="w-full text-center text-gray-400">
                    Experience {user?.experience??"..."}/{user?.experienceMax??"..."}
                </div>
            </div>

            <div className="flex flex-col w-32 py-3">
                <div className="flex flex-row" onMouseOver={()=>{setHover("ammo")}} onMouseLeave={()=>{setHover(null)}}>
                    <div className="grid w-1/2 grid-rows-2" >
                        <div className={"font-bold "+(hover==="ammo"?"text-"+hoverColor:"text-default")}>
                            {user?.ammo??"..."}/{user?.ammoMax??"..."}
                        </div>
                        <div className="text-gray-400">
                            Ammo
                        </div>
                    </div>
                    <FontAwesomeIcon icon={faGun} size="2x" className={"w-1/2 "+(hover==="ammo"?"text-"+hoverColor:"text-default")} />
                </div>
                <div className="flex flex-row" onMouseOver={()=>{setHover("energy")}} onMouseLeave={()=>{setHover(null)}}>
                    <div className="grid w-1/2 grid-rows-2" >
                        <div className={"font-bold "+(hover==="energy"?"text-"+hoverColor:"text-default")}>
                            {newEnergy?newEnergy:user?.energy??"..."}/{user?.energyMAX??"..."}
                        </div>
                        <div className="text-gray-400">
                            {
                                user?.energy != user?.energyMAX  && (energyTiming??-1) > 0 ? (
                                    energyTiming?mstoMin(energyTiming-1000):"..."
                                ): (
                                    "Energy"
                                )
                            }
                        </div>
                    </div>
                    <FontAwesomeIcon icon={faBolt} size="2x" className={"w-1/2 "+(hover==="energy"?"text-"+hoverColor:"text-default")} />
                </div>
                <div className="flex flex-row" onMouseOver={()=>{setHover("health")}} onMouseLeave={()=>{setHover(null)}} >
                    <div className="grid w-1/2 grid-rows-2 " >
                        <div className={"font-bold "+(hover==="health"?"text-"+hoverColor:"text-default")}>
                            {user?.health??"..."}/{user?.healthMax??"..."}
                        </div>
                        <div className="text-gray-400">
                            Health
                        </div>
                    </div>
                    <FontAwesomeIcon icon={faHeart} size="2x" className={"w-1/2 "+(hover==="health"?"text-"+hoverColor:"text-default")} />
                </div>
            </div>
        </div>
        <div className="fixed z-0 w-screen h-1 bg-slate-700">
            <div className="z-10 h-1 transition-all duration-200 ease-in-out bg-default" style={{width:(user?experienceBar+"%":0)}}></div>
        </div>
        
        </>
    );
}

export default Top