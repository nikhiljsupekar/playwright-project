import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.cart_item .inventory_item_name');
  }

  async expectCartItemCount(count: number) {
    await this.page.waitForURL(/cart\.html$/);
    await this.cartItems.nth(count - 1).waitFor({ state: 'visible' });
  }

  async getCartItemNames() {
    await this.page.waitForURL(/cart\.html$/);
    return this.cartItemNames.allTextContents();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
