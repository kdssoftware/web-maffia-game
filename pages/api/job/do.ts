// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from '@models/User';
import { Job } from '@models/Job';
import { getSession } from "next-auth/react"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (session && session.user.refId) {
    const id = req.query.id as string;
    if (id) {
        const user = await User.getByRef(session?.user.refId);
        const job = await Job.getByRef(id);
        if(!user || !job) {
            res.status(400).json({ error: 'User or job not found' });
        }
        await user.doJob(job.getRefId());
        session.user.updateTop = true;
        console.log(session.user);
        res.status(200).json(user);
        return;
    }else{
      res.status(404).json({ error: 'User or job not found' });
      return;
    }
  }
  res.status(401).json({ error: 'User not logged in' });
  return;
}
