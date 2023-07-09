import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../src/endpoints";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const endpoint = JSON.parse(req.body);
  db.endpoints.push({
    url: endpoint.url,
    name: endpoint.name,
    score: 0,
  });

  res.status(200).json({});
}
