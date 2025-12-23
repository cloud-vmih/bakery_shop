"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = exports.addToCart = void 0;
const cart_service_1 = require("../servies/cart.service");
const cartService = new cart_service_1.CartService();
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
        return res.status(400).json({ message: error.message || "Lỗi khi thêm vào giỏ" });
    }
};
exports.addToCart = addToCart;
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await cartService.getCart(userId);
        return res.json(cart);
    }
    catch (error) {
        return res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getCart = getCart;
