// src/services/cart.service.ts
import { getCartByUserId, createOrUpdateCart } from "../db/db.cart";

export class CartService {
  async addItem(userId: number, itemId: number, quantity: number = 1) {
    return await createOrUpdateCart(userId, itemId, quantity);
  }

  async getCart(userId: number) {
    const cart = await getCartByUserId(userId);
    if (!cart) return { items: [], totalItems: 0 };

    const totalItems = cart.items?.reduce((sum, ci: any) => sum + ci.quantity, 0) || 0;
    return {
      items: cart.items || [],
      totalItems,
    };
  }
}