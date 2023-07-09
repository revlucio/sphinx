import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { db } from "../../src/endpoints";

type Data = {
  correct: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  let correct = false;

  for (const endpoint of db.endpoints) {
    correct = await fetch(endpoint.url, {
      method: "POST",
      body: "What is 1 + 2?",
      headers: { "Content-Type": "text/plain" },
    })
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        return text === "3";
      })
      .catch(() => false);

    const index = db.endpoints.findIndex((e) => e.name === endpoint.name);
    db.endpoints[index] = {
      ...endpoint,
      score: correct ? endpoint.score + 10 : endpoint.score - 10,
    };
  }

  res.status(200).json({ endpoints: db.endpoints });
}
