import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import {User} from '@models/User'
import generateRandomName from '@utils/generateRandomName'
import { Session } from "inspector"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, user, token }) {
      if(!session.user.name){
        session.user.name = await generateRandomName();
      }
      if(!session.user?.refId && session.user.email){
        const userModel = new User(session.user.name, session.user.email)
        await userModel.get()
        session.user.refId = userModel.getRefId();
      }
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token
    }
  }
})