"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeCartItem = exports.updateCartItem = exports.getCart = exports.addToCart = void 0;
const cart_service_1 = require("../services/cart.service");
const cartService = new cart_service_1.CartService();
/**
 * ADD TO CART
 */
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, quantity = 1 } = req.body;
        if (!itemId) {
            return res.status(400).json({ message: "Thiếu itemId" });
        }
        await cartService.addItem(userId, itemId, quantity);
        return res.json({ message: "Đã thêm vào giỏ hàng thành công!" });
    }
    catch (error) {
        return res
            .status(400)
            .json({ message: error.message || "Lỗi khi thêm vào giỏ" });
    }
};
exports.addToCart = addToCart;
/**
 * GET CART
 */
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await cartService.getCart(userId);
        console.log(cart);
        return res.json(cart);
    }
    catch (error) {
        return res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getCart = getCart;
/**
 * UPDATE CART ITEM QUANTITY (+ / -)
 * PUT /cart/item/:id
 */
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItemId = Number(req.params.id);
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Số lượng không hợp lệ" });
        }
        await cartService.updateItem(userId, cartItemId, quantity);
        return res.json({ message: "Cập nhật số lượng thành công" });
    }
    catch (error) {
        return res
            .status(400)
            .json({ message: error.message || "Không thể cập nhật số lượng" });
    }
};
exports.updateCartItem = updateCartItem;
/**
 * REMOVE SINGLE CART ITEM
 * DELETE /cart/item/:id
 */
const removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItemId = Number(req.params.id);
        await cartService.removeItem(userId, cartItemId);
        return res.json({ message: "Đã xoá sản phẩm khỏi giỏ hàng" });
    }
    catch (error) {
        return res
            .status(400)
            .json({ message: error.message || "Không thể xoá sản phẩm" });
    }
};
exports.removeCartItem = removeCartItem;
const clearCart = async (req, res) => {
    const userId = req.user.id;
    await cartService.clearCart(userId);
    res.json({ message: "Đã xoá toàn bộ giỏ hàng" });
};
exports.clearCart = clearCart;
