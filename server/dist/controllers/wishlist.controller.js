"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const wishlistService = __importStar(require("../services/wishlist.service"));
const getWishlist = async (req, res, next) => {
    try {
        const customerId = req.user.id;
        const items = await wishlistService.getWishlist(customerId);
        res.json(items); // ⭐ Item[]
    }
    catch (err) {
        next(err);
    }
};
exports.getWishlist = getWishlist;
const addToWishlist = async (req, res, next) => {
    try {
        const customerId = req.user.id;
        const itemId = Number(req.params.itemId);
        if (!itemId) {
            return res.status(400).json({ error: "INVALID_ITEM_ID" });
        }
        await wishlistService.addToWishlist(customerId, itemId);
        res.json({ message: "Đã thêm vào wishlist" });
    }
    catch (err) {
        next(err);
    }
};
exports.addToWishlist = addToWishlist;
const removeFromWishlist = async (req, res, next) => {
    try {
        const customerId = req.user.id;
        const itemId = Number(req.params.itemId);
        await wishlistService.removeFromWishlist(customerId, itemId);
        res.json({ message: "Đã xóa khỏi wishlist" });
    }
    catch (err) {
        next(err);
    }
};
exports.removeFromWishlist = removeFromWishlist;
