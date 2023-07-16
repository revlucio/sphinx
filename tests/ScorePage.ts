import { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export default class ScorePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async go() {
    await this.page.goto("http://localhost:3000");
  }

  async registerEndpoint(name: string, url: string) {
    await this.page.locator("text=Register endpoint").click();

    await this.page.locator("text=Name").fill(name);
    await this.page.locator("text=URL").fill(url);
    await this.page.locator("text=Create").click();
  }

  async askQuestion() {
    await this.page.locator("text=Ask a question").click();
    await expect(this.page.locator("text=asked!")).toBeVisible();
  }

  async getScoreFor(name: string) {
    return await this.page.getByTestId(name + "-score").innerText();
  }
}
