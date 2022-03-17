import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from '@models/User';
import { CurrentJob } from '@models/CurrentJob';
import {Job} from "@models/Job";
import { getSession } from "next-auth/react"
import {updateEnergyBasedOnTiming} from "@controller/User";

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
            return;
        }
        await updateEnergyBasedOnTiming(user);
        let currentJob  : CurrentJob | undefined = await user.doJob(job.getRefId());
        if(currentJob === undefined){
            res.status(400).json({ error: 'Job not found' });
            return;
        }else{
          session.user.updateTop = true;
          res.status(200).json(currentJob);
          return;
        }
    }else{
      res.status(404).json({ error: 'User or job not found' });
      return;
    }
  }
  res.status(401).json({ error: 'User not logged in' });
  return;
}
