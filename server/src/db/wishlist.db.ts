import { AppDataSource } from "../config/database";
import { Wishlist } from "../entity/Wishlist";
import { Item } from "../entity/Item";

/**
 * Lấy wishlist theo customerId
 */
export const getWishlistByCustomerId = async (
  customerId: number
): Promise<Item[]> => {
  const repo = AppDataSource.getRepository(Wishlist);

  const wishlist = await repo.find({
    where: { customerID: customerId },
    relations: ["item"],
  });

  // item là mảng → flatten
  return wishlist.flatMap((w) => w.item || []);
};

/**
 * Thêm sản phẩm vào wishlist
 */
export const addProductToWishlistDB = async (
  customerId: number,
  itemId: number
) => {
  const repo = AppDataSource.getRepository(Wishlist);

  const exists = await repo.findOne({
    where: { customerID: customerId, itemID: itemId },
  });

  if (exists) return;

  const wishlist = repo.create({
    customerID: customerId,
    itemID: itemId,
  });

  await repo.save(wishlist);
};

/**
 * Xóa sản phẩm khỏi wishlist
 */
export const removeProductFromWishlistDB = async (
  customerId: number,
  itemId: number
) => {
  const repo = AppDataSource.getRepository(Wishlist);

  await repo.delete({
    customerID: customerId,
    itemID: itemId,
  });
};
