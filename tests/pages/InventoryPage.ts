import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly burgerMenuButton: Locator;
  readonly logoutLink: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('#shopping_cart_container a');
  }

  async logout() {
    await this.burgerMenuButton.click();
    await this.logoutLink.click();
  }

  private itemCard(itemName: string) {
    return this.page.locator('.inventory_item').filter({ has: this.page.getByText(itemName) });
  }

  async addToCart(itemName: string) {
    const card = this.itemCard(itemName);
    await card.getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(itemName: string) {
    const card = this.itemCard(itemName);
    await card.getByRole('button', { name: 'Remove' }).click();
  }

  async getCartCount() {
    if (await this.cartBadge.count() === 0) return 0;
    const text = await this.cartBadge.textContent();
    return text ? Number(text) : 0;
  }

  async openCart() {
    await this.cartLink.click();
    await this.page.waitForURL(/cart\.html$/);
  }
}
