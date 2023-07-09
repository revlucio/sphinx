import type { NextApiRequest, NextApiResponse } from 'next'
import {db} from '../../src/endpoints'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const endpoint = JSON.parse(req.body)
    db.endpoints.push({
        url: endpoint.url, 
        name: endpoint.name 
    })
    console.log(db.endpoints)
    
  res.status(200).json({})
}
