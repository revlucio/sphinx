// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const answer = await fetch('http://localhost:6000')
    .then(res => res.status)
    .catch(res => 'failed')
    
  console.log(answer)
  res.status(200).json({ answer: answer })
}
