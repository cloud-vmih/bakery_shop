import { Wishlist } from "../entity/Wishlist";
import { Item } from "../entity/Item";

export const getWishlist = async (customerId: number): Promise<Item[]> => {
  const wishlist = await Wishlist.find({
    where: { customerID: customerId },
    relations: ["item"], // ⭐ CỰC KỲ QUAN TRỌNG
  });

  return wishlist.map((w) => w.item);
};

export const addToWishlist = async (customerId: number, itemId: number) => {
  const exists = await Wishlist.findOne({
    where: { customerID: customerId, itemID: itemId },
  });

  if (exists) return;

  const wishlist = Wishlist.create({
    customerID: customerId,
    itemID: itemId,
  });

  await wishlist.save();
};

export const removeFromWishlist = async (
  customerId: number,
  itemId: number
) => {
  await Wishlist.delete({
    customerID: customerId,
    itemID: itemId,
  });
};
