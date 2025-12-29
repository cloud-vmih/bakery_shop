"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCartByUserId = exports.createOrUpdateCart = exports.getCartByUserId = void 0;
const database_1 = require("../config/database");
const Cart_1 = require("../entity/Cart");
const CartItem_1 = require("../entity/CartItem");
const Item_1 = require("../entity/Item");
const getCartByUserId = async (userId) => {
    return await database_1.AppDataSource.getRepository(Cart_1.Cart).findOne({
        where: { customer: { id: userId } },
        relations: {
            items: {
                item: true, // 👈 load luôn product
            },
        },
    });
};
exports.getCartByUserId = getCartByUserId;
const createOrUpdateCart = async (userId, itemId, quantity = 1) => {
    const cartRepo = database_1.AppDataSource.getRepository(Cart_1.Cart);
    const cartItemRepo = database_1.AppDataSource.getRepository(CartItem_1.CartItem);
    const itemRepo = database_1.AppDataSource.getRepository(Item_1.Item);
    // 1️⃣ Check item
    const item = await itemRepo.findOne({
        where: { id: itemId },
        select: ["id"],
    });
    if (!item)
        throw new Error("Sản phẩm không tồn tại");
    // 2️⃣ Get or create cart
    let cart = await (0, exports.getCartByUserId)(userId);
    if (!cart) {
        const newCart = cartRepo.create({
            customer: { id: userId },
            createAt: new Date(),
            updateAt: new Date(),
        });
        await cartRepo.save(newCart);
        cart = await cartRepo.findOneByOrFail({ id: newCart.id });
    }
    // 🔥 QUAN TRỌNG: đảm bảo cart.id tồn tại
    if (!cart.id) {
        throw new Error("Cart ID missing");
    }
    // 3️⃣ Find cart item
    const cartItem = await cartItemRepo.findOne({
        where: {
            cart: { id: cart.id },
            item: { id: itemId },
        },
    });
    if (cartItem) {
        cartItem.quantity = (cartItem.quantity ?? 0) + quantity;
        await cartItemRepo.save(cartItem);
    }
    else {
        const newCartItem = cartItemRepo.create({
            cart: { id: cart.id },
            item: { id: itemId },
            quantity,
        });
        await cartItemRepo.save(newCartItem);
    }
    // 4️⃣ Update cart time
    await cartRepo.update(cart.id, {
        updateAt: new Date(),
    });
    return cart;
};
exports.createOrUpdateCart = createOrUpdateCart;
const clearCartByUserId = async (userId) => {
    const cartRepo = database_1.AppDataSource.getRepository(Cart_1.Cart);
    const cart = await cartRepo.findOne({
        where: { customer: { id: userId } },
        relations: ["items"],
    });
    if (!cart)
        return true;
    await cartRepo.remove(cart);
    return true;
};
exports.clearCartByUserId = clearCartByUserId;
