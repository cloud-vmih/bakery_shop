"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const Wishlist_1 = require("../entity/Wishlist");
const getWishlist = async (customerId) => {
    const wishlist = await Wishlist_1.Wishlist.find({
        where: { customerID: customerId },
        relations: ["item"], // ⭐ CỰC KỲ QUAN TRỌNG
    });
    return wishlist.map(w => w.item);
};
exports.getWishlist = getWishlist;
const addToWishlist = async (customerId, itemId) => {
    const exists = await Wishlist_1.Wishlist.findOne({
        where: { customerID: customerId, itemID: itemId },
    });
    if (exists)
        return;
    const wishlist = Wishlist_1.Wishlist.create({
        customerID: customerId,
        itemID: itemId,
    });
    await wishlist.save();
};
exports.addToWishlist = addToWishlist;
const removeFromWishlist = async (customerId, itemId) => {
    await Wishlist_1.Wishlist.delete({
        customerID: customerId,
        itemID: itemId,
    });
};
exports.removeFromWishlist = removeFromWishlist;
