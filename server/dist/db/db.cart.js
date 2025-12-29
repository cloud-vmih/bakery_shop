"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrUpdateCart = exports.getCartByUserId = void 0;
// src/db/db.cart.ts
const database_1 = require("../config/database");
const Cart_1 = require("../entity/Cart");
const CartItem_1 = require("../entity/CartItem");
const Item_1 = require("../entity/Item");
// Thêm lại hàm này (đã mất)
const getCartByUserId = async (userId) => {
<<<<<<< HEAD
=======
    console.log(userId);
>>>>>>> origin/master
    return await database_1.AppDataSource.getRepository(Cart_1.Cart).findOne({
        where: { customer: { id: userId } },
        relations: ["items", "items.item"],
    });
};
exports.getCartByUserId = getCartByUserId;
const createOrUpdateCart = async (userId, itemId, quantity = 1) => {
    const cartRepo = database_1.AppDataSource.getRepository(Cart_1.Cart);
    const cartItemRepo = database_1.AppDataSource.getRepository(CartItem_1.CartItem);
    // Kiểm tra item tồn tại
    const itemExists = await database_1.AppDataSource.getRepository(Item_1.Item)
        .createQueryBuilder("item")
        .where("item.id = :id", { id: itemId })
        .getOne();
    console.log(itemExists);
    if (!itemExists)
        throw new Error("Sản phẩm không tồn tại");
    // Tìm hoặc tạo giỏ hàng
    let cart = await (0, exports.getCartByUserId)(userId);
    console.log(cart);
    if (!cart) {
        cart = cartRepo.create({
            customer: { id: userId },
            createAt: new Date(),
            updateAt: new Date(),
        });
        await cartRepo.save(cart);
    }
    console.log(cart);
    console.log(itemId);
    // Tìm CartItem cũ (dùng any để tránh lỗi TS)
    let cartItem = (cart.items || []).find((ci) => ci.item.id === itemId);
    console.log(cartItem);
    if (cartItem) {
        // Fix lỗi undefined: dùng || 0
        cartItem.quantity = (cartItem.quantity || 0) + quantity;
        await cartItemRepo.save(cartItem);
    }
    else {
        cartItem = await cartItemRepo.create({
            cart: { id: cart.id },
            item: { id: itemId },
            quantity,
        });
        await cartItemRepo.save(cartItem);
    }
    // Cập nhật thời gian
    cart.updateAt = new Date();
    await cartRepo.save(cart);
    return cart;
};
exports.createOrUpdateCart = createOrUpdateCart;
