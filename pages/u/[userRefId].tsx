import Top from '@components/Top'
import SignButton from '@components/auth/SignButton'
import type { NextPage } from 'next'
import { useSession, signIn, signOut } from "next-auth/react"
import { getUserByRef } from '@controller/User'
import { useState, useEffect } from 'react'
import { IUser, User } from '@models/User'
import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Bottom from '@components/Bottom'

interface  Props  {
    stringyfiedUser: string
}

const UserPage: NextPage<Props> = (props)  => {
    let {stringyfiedUser} = props;
    const { data: session } = useSession()
    const user : User = JSON.parse(stringyfiedUser);
    const userRefId = User.getRefIdStatic(user);
    const isOwner = session && session.user && session.user.refId === userRefId;

    return (
        <>
            <div>
                <div>{user.name}</div>
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    if (context && context.params && context.params.userRefId) {
        const userRefId = context.params.userRefId as string;
        const user = await getUserByRef(userRefId);
        return {
            props:{
                stringyfiedUser:JSON.stringify(user)
            }
        }
    }else{
        return {
            notFound:true
        }
    }
}



export default UserPage