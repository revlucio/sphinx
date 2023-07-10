import { Page } from "@playwright/test";

export default class ScorePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async go() {
    await this.page.goto("http://localhost:3000");
  }

  async registerEndpoint(page: Page, name: string, url: string) {
    await page.locator("text=Register endpoint").click();

    await page.locator("text=Name").fill(name);
    await page.locator("text=URL").fill(url);
    await page.locator("text=Create").click();
  }
}
