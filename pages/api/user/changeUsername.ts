import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from '@models/User';
import { getSession } from "next-auth/react"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const session = await getSession({ req })
    const username = req.query.username as string;
    if(!session) {
        res.status(400).json({ error: 'User is required' });
        return;
    }else if(session && session.user.refId && username) {
        const userRefId = session.user.refId;
        const user = await User.getByRef(userRefId);
        let success = await user.changeUsername(username);
        res.status(200).json(success);
        return;
    }
   res.status(401).json({ error: 'User not logged in' });
   return;
}