"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
// src/services/cart.service.ts
const db_cart_1 = require("../db/db.cart");
class CartService {
    async addItem(userId, itemId, quantity = 1) {
        return await (0, db_cart_1.createOrUpdateCart)(userId, itemId, quantity);
    }
    async getCart(userId) {
        const cart = await (0, db_cart_1.getCartByUserId)(userId);
        if (!cart)
            return { items: [], totalItems: 0 };
        const totalItems = cart.items?.reduce((sum, ci) => sum + ci.quantity, 0) || 0;
        return {
            items: cart.items || [],
            totalItems,
        };
    }
}
exports.CartService = CartService;
