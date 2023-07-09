import { test, expect } from "@playwright/test";
import Fastify from "fastify";

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

  fastify.post("/", async (request, reply) => {
    reply.type("text/plain").code(200);
    return answer;
  });

  fastify.listen({ port: port || 6000 }, (err, address) => {
    if (err) throw err;
    console.log(`Server is now listening on ${address}`);
  });

  return fastify;
};

test("shows title", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await expect(page.locator("main")).toHaveText("Welcome to Sphinx");
});

test("register a new endpoint", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.locator("text=Register endpoint").click();

  await page.locator("text=Name").fill("Luke");
  await page.locator("text=URL").fill("http://localhost:6000");
  await page.locator("text=Create").click();

  await expect(page.locator("text=Luke")).toBeVisible();
  await expect(page.locator("text=http://localhost:6000")).toBeVisible();

  await page.reload();

  await expect(page.locator("text=http://localhost:6000")).toBeVisible();
});

test("score goes down after question answer times out (for some reason wasnt working)", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  await page.locator("text=Register endpoint").click();

  await page.locator("text=Name").fill("Harry");
  await page.locator("text=URL").fill("http://localhost:6002");
  await page.locator("text=Create").click();

  await page.locator("text=Ask a question").click();
  await expect(page.locator("text=asked!")).toBeVisible();
});

test("score goes down after question answer times out 2", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.locator("text=Register endpoint").click();

  await page.locator("text=Name").fill("Frank");
  await page.locator("text=URL").fill("http://localhost:6005");
  await page.locator("text=Create").click();

  await page.locator("text=Ask a question").click();
  await expect(page.locator("text=asked!")).toBeVisible();

  expect(await page.getByTestId("Frank-score").innerText()).toBe("-10");
});

test("score goes up after question answer passed", async ({ page }) => {
  // hardcode question to 1 + 2
  const server = setupServerWithAnswer({ answer: "3", port: 6001 });

  await page.goto("http://localhost:3000");

  await page.locator("text=Register endpoint").click();

  await page.locator("text=Name").fill("Joe");
  await page.locator("text=URL").fill("http://localhost:6001");
  await page.locator("text=Create").click();

  await page.locator("text=Ask a question").click();
  await expect(page.locator("text=asked!")).toBeVisible();

  expect(await page.getByTestId("Joe-score").innerText()).toBe("10");

  await server.close();
});

test("score goes down after question answer fails", async ({ page }) => {
  // hardcode question to 1 + 2
  const server = setupServerWithAnswer({ answer: "2" });

  await page.goto("http://localhost:3000");

  await page.locator("text=Register endpoint").click();

  await page.locator("text=Name").fill("Luke");
  await page.locator("text=URL").fill("http://localhost:6000");
  await page.locator("text=Create").click();

  await page.locator("text=Ask a question").click();
  await expect(page.locator("text=asked!")).toBeVisible();

  expect(await page.getByTestId("Luke-score").innerText()).toBe("-10");

  await server.close();
});
