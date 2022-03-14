import type { NextApiRequest, NextApiResponse } from 'next'
import { Enhancement, EnhancementType } from '@models/Enhancement';
import { getAllEnhancements, getEnhancementsByType } from '@controller/Enhancement';
import { Job } from '@models/Job';
import { getSession } from "next-auth/react"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const session = await getSession({ req })
    const amount = parseInt(req.query.amount as string) ?? 0;
    const enhancementRefId = req.query.id as string;
    if (session && session.user.refId && amount && enhancementRefId) {
        const enhancement = await Enhancement.getClassByRefId(enhancementRefId);
        if(enhancement){
            const success = await enhancement.purchase(session.user.refId, amount);
            res.status(200).json(success);
        }else{
            res.status(403).json({ error: 'Enhancement not found' });
            return;
        }

    }else{
        res.status(400).json({ error: 'Bad method' });
    }
}
