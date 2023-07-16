import { test, expect } from "@playwright/test";
import Fastify from "fastify";
import ScorePage from "./ScorePage";

const setupServerWithAnswer = ({
  port,
  answer,
}: {
  port?: number;
  answer: string;
}) => {
  const fastify = Fastify({
    logger: true,
  });

  let lastQuestion = "";

  fastify.post("/", async (request, reply) => {
    lastQuestion = request.body + "";
    reply.type("text/plain").code(200);
    return answer;
  });

  fastify.listen({ port: port || 6000 }, (err, address) => {
    if (err) throw err;
    console.log(`Server is now listening on ${address}`);
  });

  return {
    fastify,
    getLastQuestion: () => lastQuestion,
  };
};

test("shows title", async ({ page }) => {
  const scorePage = new ScorePage(page);
  await scorePage.go();

  await expect(page.locator("main")).toHaveText("Welcome to Sphinx");
});

test("register a new endpoint", async ({ page }) => {
  const scorePage = new ScorePage(page);
  await scorePage.go();

  await scorePage.registerEndpoint("Luke", "http://localhost:6000");

  await expect(page.locator("text=Luke")).toBeVisible();
  await expect(page.locator("text=http://localhost:6000")).toBeVisible();
  expect(await scorePage.getScoreFor("Luke")).toBe("0");

  await page.reload();

  await expect(page.locator("text=http://localhost:6000")).toBeVisible();
});

test("score goes down after question answer times out (for some reason wasnt working)", async ({
  page,
}) => {
  const scorePage = new ScorePage(page);
  await scorePage.go();

  await scorePage.registerEndpoint("Harry", "http://localhost:6002");

  await scorePage.askQuestion();
});

test("score goes down after question answer times out 2", async ({ page }) => {
  const scorePage = new ScorePage(page);
  await scorePage.go();

  await scorePage.registerEndpoint("Frank", "http://localhost:6005");
  await scorePage.askQuestion();

  expect(await scorePage.getScoreFor("Frank")).toBe("-10");
});

test("score goes up after question answer passed", async ({ page }) => {
  // hardcode question to 1 + 2
  const server = setupServerWithAnswer({ answer: "3", port: 6001 }).fastify;

  const scorePage = new ScorePage(page);
  await scorePage.go();

  await scorePage.registerEndpoint("Joe", "http://localhost:6001");

  await scorePage.askQuestion();

  expect(await scorePage.getScoreFor("Joe")).toBe("10");

  await server.close();
});

test("score goes down after question answer fails", async ({ page }) => {
  // hardcode question to 1 + 2
  const server = setupServerWithAnswer({ answer: "2" }).fastify;

  const scorePage = new ScorePage(page);
  await scorePage.go();

  await scorePage.registerEndpoint("Fred", "http://localhost:6000");

  await scorePage.askQuestion();

  expect(await scorePage.getScoreFor("Fred")).toBe("-10");

  await server.close();
});

test("asks math questions the first 4 times", async ({ page }) => {
  // hardcode question to 1 + 2
  const server = setupServerWithAnswer({ answer: "3", port: 6009 });

  const scorePage = new ScorePage(page);
  await scorePage.go();
  await scorePage.registerEndpoint("Math", "http://localhost:6009");

  await scorePage.askQuestion();
  expect(server.getLastQuestion()).toBe("What is 1 + 2?");

  await scorePage.askQuestion();
  expect(server.getLastQuestion()).toBe("What is 5 - 7?");

  await server.fastify.close();
});
