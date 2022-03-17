import Top from '@components/Top'
import SignButton from '@components/auth/SignButton'
import type { NextPage } from 'next'
import { useSession } from "next-auth/react"

const Home: NextPage = ({

}) => {
  const { data: session } = useSession()
  return (
    <div>
      <SignButton />
    </div>
  )
}


export default Home