import { expect, test } from '@playwright/test';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { InventoryPage } from './pages/InventoryPage';
import { LoginPage } from './pages/LoginPage';

const validCredentials = {
  username: 'standard_user',
  password: 'secret_sauce',
};

test('end-to-end flow: login → add 2 items → checkout → finish', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.login(validCredentials.username, validCredentials.password);
  await loginPage.expectLoggedIn();
  await page.waitForTimeout(500);

  await inventoryPage.addToCart('Sauce Labs Backpack');
  await page.waitForTimeout(300);
  await inventoryPage.addToCart('Sauce Labs Bike Light');
  await page.waitForTimeout(300);

  await inventoryPage.openCart();
  await page.waitForTimeout(500);

  // Verify exactly these items are in the cart
  await cartPage.expectCartItemCount(2);
  const itemNames = await cartPage.getCartItemNames();
  expect(itemNames).toEqual([
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
  ]);

  await cartPage.checkout();
  await page.waitForTimeout(500);

  await checkoutPage.fillShippingInfo('Test', 'User', '12345');
  await page.waitForTimeout(500);
  await checkoutPage.finish();
  await page.waitForTimeout(500);

  const completeText = await checkoutPage.expectOrderComplete();
  expect(completeText).toContain('Thank you for your order');
});
