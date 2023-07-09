import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch';

type Data = {
  correct: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const correct = await fetch('http://localhost:6000', {
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
