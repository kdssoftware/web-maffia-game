import { withAuth } from "next-auth/middleware"
import {getUserByEmail} from '@controller/User'

export default withAuth({
  callbacks: {
    authorized: async ({token}) => {
        if(token?.email){
            const userData = await getUserByEmail(token.email);
            if(userData){
              token.role = userData.data?.role??"user";
            }
          }        
        return token?.role === "admin";
    }
  },
})