import { Enhancement, EnhancementData, EnhancementType } from '@models/Enhancement'
import EnhancementComponent from '@components/Enhancement';
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@lib/redux/hooks'
import {selectCurrentEnhancement, purchase} from '@lib/redux/features/CurrentEnhancement/CurrentEnhancementSlice'
import { fetchTopAsync, selectTop } from '@lib/redux/features/Top/TopSlice'
import EnhancementSuccess from '@components/EnhancementSuccess';

const Home: NextPage = ({

}) => {
  const { data: session, status } = useSession()
  const [enhancements, setEnhancements] = useState<EnhancementData[]>([])
  const dispatch = useAppDispatch()
  const currentEnhancement = useAppSelector(selectCurrentEnhancement)
  const user = useAppSelector(selectTop)

  const [currentTypeViewing, setCurrentTypeViewing] = useState<EnhancementType>(EnhancementType.equipment);
  const activeCss = 'bg-gradient-to-br from-slate-500 to-slate-800';
  const inactiveCss = 'bg-slate-900 ' 
  const buttonCss = 'flex py-2 flex-col justify-center hover:bg-gradient-to-br hover:from-slate-500 hover:to-slate-800 transition-all duration-500 ease-in-out';
  const formatter = new Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD'});
  
  useEffect(() => {
      const doAsync = async () => {
          if (session && session.user.refId) {
              const res = await fetch('/api/enhancement/all')
              setEnhancements(await res.json())
              console.log(currentEnhancement);
          }
      }
      doAsync()
  }, [session,dispatch, user, currentEnhancement])

  return (
    <>
    <div className='grid grid-cols-3'>
      {
        Object.values(EnhancementType).map((type, i) => {
          return <button 
          className={"text-default font-bold capitalize flex flex-row items-center "+buttonCss+" "+(currentTypeViewing===type?activeCss:inactiveCss)}
          onClick={() => setCurrentTypeViewing(type)} key={i}>{type}</button>
        })
      }
    </div>
    <div className='grid w-full grid-cols-3 mt-2 place-content-center'>
      <div className='ml-2 text-lg text-white'>Upkeep:  
      <span className='ml-1 text-bold'>{formatter.format(user?.totalUpkeep??0)}</span>
      </div>
      <div className='text-lg text-white'>Defence:
      <span className='ml-1 text-bold'> {user?.totalDefence??0}</span>
      </div>
      <div className='text-lg text-white'>Attack: 
      <span className='ml-1 text-bold'>{user?.totalAttack??0}</span>
      </div>
    </div>
    {
      currentEnhancement && <EnhancementSuccess currentEnhancement={currentEnhancement}/>
    }
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