import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

const cartService = new CartService();

/**
 * ADD TO CART
 */
export const addToCart = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity = 1 } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "Thiếu itemId" });
    }

    await cartService.addItem(userId, itemId, quantity);
    return res.json({ message: "Đã thêm vào giỏ hàng thành công!" });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Lỗi khi thêm vào giỏ" });
  }
};

/**
 * GET CART
 */
export const getCart = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.getCart(userId);
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * UPDATE CART ITEM QUANTITY (+ / -)
 * PUT /cart/item/:id
 */
export const updateCartItem = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const cartItemId = Number(req.params.id);
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Số lượng không hợp lệ" });
    }

    await cartService.updateItem(userId, cartItemId, quantity);
    return res.json({ message: "Cập nhật số lượng thành công" });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Không thể cập nhật số lượng" });
  }
};

/**
 * REMOVE SINGLE CART ITEM
 * DELETE /cart/item/:id
 */
export const removeCartItem = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const cartItemId = Number(req.params.id);

    await cartService.removeItem(userId, cartItemId);
    return res.json({ message: "Đã xoá sản phẩm khỏi giỏ hàng" });
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: error.message || "Không thể xoá sản phẩm" });
  }
};

export const clearCart = async (req: any, res: Response) => {
  const userId = req.user.id;
  await cartService.clearCart(userId);
  res.json({ message: "Đã xoá toàn bộ giỏ hàng" });
};
