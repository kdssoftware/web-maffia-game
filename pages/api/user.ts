// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {User} from "@models/User";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //POST
  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
      const user = new User(name)
      user.get().then((_user) => {
        res.status(200).json(user);
      }).catch((err: any) => {
          res.status(500).json({ error: err.message });
      })
  }
}
