import { assertTextContains, assertVisible } from "../../assertions";
import { env } from "../../framework/config/env";
import { expect, test } from "../../framework/fixtures/app.fixture";
import { HomePage } from "../../pages/HomePage";
import { LoginPage } from "../../pages/LoginPage";

test("user can log in, log out, and see an error for a wrong password @ui", async ({ page }) => {
  if (!env.TEST_USERNAME || !env.TEST_PASSWORD) {
    throw new Error("TEST_USERNAME and TEST_PASSWORD must be set to run this test");
  }

  const loginPage = new LoginPage(page);
  await page.goto(loginPage.path);
  await loginPage.isOpened();
  await loginPage.login({ email: env.TEST_USERNAME, password: env.TEST_PASSWORD });

  const homePage = new HomePage(page);
  await assertVisible(homePage.header.loggedInAs(env.TEST_USERNAME));
  await homePage.header.logoutCurrentUser();

  await loginPage.isOpened();
  await loginPage.login({ email: env.TEST_USERNAME, password: `${env.TEST_PASSWORD}-wrong` });

  await assertTextContains(loginPage.loginError, "Your email or password is incorrect");
});

test('TC-99 error message styling', async ({ page }) => {
  await page.goto('/login');
  await page.waitForTimeout(3000);
  await expect(page.locator('css=div.error')).toBeVisible();
});
