import { expect, test } from '@playwright/test';
import { InventoryPage } from './pages/InventoryPage';
import { LoginPage } from './pages/LoginPage';

const validCredentials = {
  username: 'standard_user',
  password: 'secret_sauce',
};

const invalidCases = [
  {
    name: 'wrong password shows a mismatch error',
    username: 'standard_user',
    password: 'wrong_password',
    expectedError: 'Username and password do not match any user in this service',
  },
  {
    name: 'locked out user shows a locked out error',
    username: 'locked_out_user',
    password: 'secret_sauce',
    expectedError: 'Sorry, this user has been locked out.',
  },
  {
    name: 'empty credentials show a required field error',
    username: '',
    password: '',
    expectedError: 'Epic sadface: Username is required',
  },
];

test.describe('Sauce Demo login', () => {
  test('valid credentials should log in and show inventory', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(validCredentials.username, validCredentials.password);
    await loginPage.expectLoggedIn();
  });

  test('can add and remove an item from the cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(validCredentials.username, validCredentials.password);
    await loginPage.expectLoggedIn();

    // Start with a clean cart badge
    await expect(await inventoryPage.getCartCount()).toBe(0);

    await inventoryPage.addToCart('Sauce Labs Backpack');
    await expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.removeFromCart('Sauce Labs Backpack');
    await expect(await inventoryPage.getCartCount()).toBe(0);
  });

  for (const invalidCase of invalidCases) {
    test(invalidCase.name, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.login(invalidCase.username, invalidCase.password);
      await loginPage.expectErrorMessage(invalidCase.expectedError);
    });
  }
});
