import { User } from '@models/User';
import { Job } from '@models/Job';

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const user = new User('karel')
    await user.get();
    const job = new Job('test');
    await job.get();
    await user.doJob(job.getRefId());
    res.status(200).json(user);
}
