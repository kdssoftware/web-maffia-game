// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {User} from "@models/User";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //POST
  if (req.method === 'POST') {
    const { name, email } = req.body;
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }
    const user = new User(name, email)
    user.get().then(() => {
      if(!user) {
        res.status(404).send("404 Not found")
        return
      }
      res.status(200).json(user);
    }).catch((err: any) => {
        console.log(err);
        res.status(404).send("404 Not found")
  })
  }
}
