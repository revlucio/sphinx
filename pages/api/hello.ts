import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch';
import {db} from '../../src/endpoints'

type Data = {
  correct: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const correct = await fetch(db.endpoints[0]?.url, {
    method: 'POST',
    body: 'What is 1 + 2?',
    headers: { 'Content-Type': 'text/plain' }
  })
    .then(res => {
      return res.text()
    })
    .then(text => {
      return text === '3'})
    .catch(() => false)

    
  res.status(200).json({ correct: correct })
}
