import { Enhancement, EnhancementData, EnhancementType } from '@models/Enhancement'
import EnhancementComponent from '@components/Enhancement';
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
const Home: NextPage = ({

}) => {
  const { data: session, status } = useSession()
  const [enhancements, setEnhancements] = useState<EnhancementData[]>([])
  const [currentTypeViewing, setCurrentTypeViewing] = useState<EnhancementType>(EnhancementType.equipment);
  const activeCss = 'bg-gradient-to-br from-slate-500 to-slate-800';
  const inactiveCss = 'bg-slate-900 ' 
  const buttonCss = 'flex py-2 flex-col justify-center hover:bg-gradient-to-br hover:from-slate-500 hover:to-slate-800 transition-all duration-500 ease-in-out';
  
  useEffect(() => {
    const doAsync = async () => {
        if (session && session.user.refId) {
            const res = await fetch('/api/enhancement/all')
            setEnhancements(await res.json())
        }
    }
    doAsync()
}, [session])
  return (
    <>
    <div className='grid grid-cols-3 mb-3 mb-5'>
      {
        Object.values(EnhancementType).map((type, i) => {
          return <button 
          className={"text-default font-bold capitalize flex flex-row items-center "+buttonCss+" "+(currentTypeViewing===type?activeCss:inactiveCss)}
          onClick={() => setCurrentTypeViewing(type)} key={i}>{type}</button>
        })
      }
    </div>
    <div>
      {
        enhancements.filter(e => e.data.type === currentTypeViewing).map((enhancement, i) => {
          return <EnhancementComponent key={i} enhancementData={enhancement} />
        })
      }
    </div>
    </>
  )
}


export default Home