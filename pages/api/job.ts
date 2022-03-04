// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Job } from '@models/Job';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //POST
  if (req.method === 'POST') {
    const { name, description, minLevel, maxLevel, minDollars, maxDollars, energy, experience } = req.body;
    if (!name || !description || !minLevel || !maxLevel || !minDollars || !maxDollars || !energy || !experience) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const job = new Job(name, description, minLevel, maxLevel, minDollars, maxDollars, energy, experience)
    job.get().then((_job) => {
        res.status(200).json(job);
    }
    ).catch((err: any) => {
        res.status(500).json({ error: err.message });
    })
  }
}
