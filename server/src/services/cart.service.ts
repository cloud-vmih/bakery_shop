import { AppDataSource } from "../config/database";
import { CartItem } from "../entity/CartItem";
import {
  getCartByUserId,
  createOrUpdateCart,
  clearCartByUserId,
} from "../db/cart.db";

export class CartService {
  /**
   * ADD ITEM
   */
  async addItem(userId: number, itemId: number, quantity = 1) {
    return await createOrUpdateCart(userId, itemId, quantity);
  }

  /**
   * GET CART
   */
  async getCart(userId: number) {
    const cart = await getCartByUserId(userId);

    if (!cart) {
      return { items: [], totalItems: 0 };
    }

    const totalItems =
      cart.items?.reduce((sum, ci) => sum + (ci.quantity ?? 0), 0) ?? 0;

    return {
      items: cart.items || [],
      totalItems,
    };
  }

  /**
   * UPDATE QUANTITY (+ / -)
   */
  async updateItem(userId: number, cartItemId: number, quantity: number) {
    const cartItemRepo = AppDataSource.getRepository(CartItem);

    const cartItem = await cartItemRepo.findOne({
      where: {
        id: cartItemId,
        cart: {
          customer: { id: userId },
        },
      },
      relations: ["cart"],
    });

    if (!cartItem) {
      throw new Error("Cart item không tồn tại");
    }

    cartItem.quantity = quantity;
    await cartItemRepo.save(cartItem);

    return cartItem;
  }

  /**
   * REMOVE ITEM
   */
  async removeItem(userId: number, cartItemId: number) {
    const cartItemRepo = AppDataSource.getRepository(CartItem);

    const cartItem = await cartItemRepo.findOne({
      where: {
        id: cartItemId,
        cart: {
          customer: { id: userId },
        },
      },
      relations: ["cart"],
    });

    if (!cartItem) {
      throw new Error("Cart item không tồn tại");
    }

    await cartItemRepo.remove(cartItem);
    return true;
  }

  async clearCart(userId: number) {
    return await clearCartByUserId(userId);
  }
}
