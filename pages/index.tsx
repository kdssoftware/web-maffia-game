import Top from '@components/Top'
import SignButton from '@components/auth/SignButton'
import type { NextPage } from 'next'
import { useSession, signIn, signOut } from "next-auth/react"
import { getUserByEmail } from '@controller/User'
import Bottom from '@components/Bottom'


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