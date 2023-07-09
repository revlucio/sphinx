import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../src/endpoints";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.status(200).json({
    endpoints: db.endpoints,
  });
}
