import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllEnhancements } from '@controller/Enhancement';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const enhancements = await getAllEnhancements();
    if(!enhancements) {
        res.status(400).json({ error: 'Enhancements not found' });
        return;
    }
    res.status(200).json(enhancements);
}
