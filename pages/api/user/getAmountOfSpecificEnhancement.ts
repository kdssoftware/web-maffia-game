// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from '@models/User';
import { getSession } from "next-auth/react"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const session = await getSession({ req })
    if(!session) {
        res.status(400).json({ error: 'User id is required' });
        return;
    }else if(session && session.user.refId && req.query.id) {
        const userRefId = session.user.refId;
        const user = await User.getByRef(userRefId);
        const enhancementRefId = req.query.id as string;
        const result = await user.getAmountOfSpecificEnhancement(enhancementRefId);
        res.status(200).json(result);
        return;
    }
   res.status(401).json({ error: 'User not logged in' });
   return;
}
