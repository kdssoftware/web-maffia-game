import type { NextApiRequest, NextApiResponse } from 'next'
import { Enhancement } from '@models/Enhancement';
import { getSession } from "next-auth/react"

// amount and id
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const session = await getSession({ req })
    const amount = parseInt( (req.query.amount ?? 1) as string) ?? 1;
    const enhancementRefId = req.query.id as string;
    
    if (session && session.user.refId && amount && enhancementRefId) {
        const enhancement = await Enhancement.getClassByRefId(enhancementRefId);
        if(enhancement){
            const currentEnhancement = await enhancement.purchase(session.user.refId, amount);
            res.status(200).json(currentEnhancement);
        }else{
            res.status(403).json({ error: 'Enhancement not found' });
            return;
        }

    }else{
        res.status(400).json({ error: 'Bad method' });
    }
}
