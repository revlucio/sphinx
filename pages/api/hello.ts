import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { db } from "../../src/endpoints";

type Data = {
  correct: boolean;
};

const getNextQuestion = (questionCount: number) => {
  if (questionCount === 1) {
    return {question:"What is 5 - 7?", answer: '-2'};
  }

  return {question:"What is 1 + 2?", answer: '3'};
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  let correct = false;

  for (const endpoint of db.endpoints) {
    const index = db.endpoints.findIndex((e) => e.name === endpoint.name);
    const next = getNextQuestion(endpoint.questionCount)

    correct = await fetch(endpoint.url, {
      method: "POST",
      body: next.question,
      headers: { "Content-Type": "text/plain" },
    })
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        return text === next.answer;
      })
      .catch(() => false);

    db.endpoints[index] = {
      ...endpoint,
      score: correct ? endpoint.score + 10 : endpoint.score - 10,
      questionCount: endpoint.questionCount + 1,
    };
  }

  res.status(200).json({ endpoints: db.endpoints });
}
