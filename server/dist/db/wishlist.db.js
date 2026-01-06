"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProductFromWishlistDB = exports.addProductToWishlistDB = exports.getWishlistByCustomerId = void 0;
const database_1 = require("../config/database");
const Wishlist_1 = require("../entity/Wishlist");
/**
 * Lấy wishlist theo customerId
 */
const getWishlistByCustomerId = async (customerId) => {
    const repo = database_1.AppDataSource.getRepository(Wishlist_1.Wishlist);
    const wishlist = await repo.find({
        where: { customerID: customerId },
        relations: ["item"],
    });
    // item là mảng → flatten
    return wishlist.flatMap(w => w.item || []);
};
exports.getWishlistByCustomerId = getWishlistByCustomerId;
/**
 * Thêm sản phẩm vào wishlist
 */
const addProductToWishlistDB = async (customerId, itemId) => {
    const repo = database_1.AppDataSource.getRepository(Wishlist_1.Wishlist);
    const exists = await repo.findOne({
        where: { customerID: customerId, itemID: itemId },
    });
    if (exists)
        return;
    const wishlist = repo.create({
        customerID: customerId,
        itemID: itemId,
    });
    await repo.save(wishlist);
};
exports.addProductToWishlistDB = addProductToWishlistDB;
/**
 * Xóa sản phẩm khỏi wishlist
 */
const removeProductFromWishlistDB = async (customerId, itemId) => {
    const repo = database_1.AppDataSource.getRepository(Wishlist_1.Wishlist);
    await repo.delete({
        customerID: customerId,
        itemID: itemId,
    });
};
exports.removeProductFromWishlistDB = removeProductFromWishlistDB;
