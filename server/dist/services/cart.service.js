"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const database_1 = require("../config/database");
const CartItem_1 = require("../entity/CartItem");
const cart_db_1 = require("../db/cart.db");
class CartService {
    /**
     * ADD ITEM
     */
    async addItem(userId, itemId, quantity = 1) {
        return await (0, cart_db_1.createOrUpdateCart)(userId, itemId, quantity);
    }
    /**
     * GET CART
     */
    async getCart(userId) {
        const cart = await (0, cart_db_1.getCartByUserId)(userId);
        if (!cart) {
            return { items: [], totalItems: 0 };
        }
        const totalItems = cart.items?.reduce((sum, ci) => sum + (ci.quantity ?? 0), 0) ?? 0;
        return {
            items: cart.items || [],
            totalItems,
        };
    }
    /**
     * UPDATE QUANTITY (+ / -)
     */
    async updateItem(userId, cartItemId, quantity) {
        const cartItemRepo = database_1.AppDataSource.getRepository(CartItem_1.CartItem);
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
    async removeItem(userId, cartItemId) {
        const cartItemRepo = database_1.AppDataSource.getRepository(CartItem_1.CartItem);
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
    async clearCart(userId) {
        return await (0, cart_db_1.clearCartByUserId)(userId);
    }
}
exports.CartService = CartService;
