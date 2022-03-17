import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from '@models/User';
import { getSession } from "next-auth/react"
import {updateEnergyBasedOnTiming} from "@controller/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const session = await getSession({ req })
    if(!session) {
        res.status(400).json({ error: 'User id is required' });
        return;
    }else if(session && session.user.refId) {
        const userRefId = req.query.id as string||session.user.refId;
        const user = await User.getByRef(userRefId);
        await updateEnergyBasedOnTiming(user);
        if(!user) {
            res.status(400).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(user);
        return;
    }
   res.status(401).json({ error: 'User not logged in' }); 
   return;
}
