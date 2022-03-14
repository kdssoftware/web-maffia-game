import type { NextApiRequest, NextApiResponse } from 'next'
import { Enhancement, EnhancementType } from '@models/Enhancement';
import { getAllEnhancements, getEnhancementsByType } from '@controller/Enhancement';
import { Job } from '@models/Job';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(typeof req.query.type === "string"){
        const type  = req.query.type as unknown as EnhancementType;
        const enhancements = await getEnhancementsByType(type);
        if(!enhancements) {
            res.status(400).json({ error: 'Enhancements not found' });
            return;
        }
        res.status(200).json(enhancements);
    }
    else{
        res.status(400).json({ error: 'Bad method' });
        return;
    }
}
