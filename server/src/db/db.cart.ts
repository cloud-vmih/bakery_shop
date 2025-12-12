// src/db/db.cart.ts
import { AppDataSource } from "../config/database";
import { Cart } from "../entity/Cart";
import { CartItem } from "../entity/CartItem";
import { Item } from "../entity/Item";

// Thêm lại hàm này (đã mất)
export const getCartByUserId = async (userId: number) => {
  console.log(userId)
  return await AppDataSource.getRepository(Cart).findOne({
    where: { customer: { id: userId } },
    relations: ["items", "items.item"],
  });
};

export const createOrUpdateCart = async (userId: number, itemId: number, quantity: number = 1) => {
  const cartRepo = AppDataSource.getRepository(Cart);
  const cartItemRepo = AppDataSource.getRepository(CartItem);

  // Kiểm tra item tồn tại
  const itemExists = await AppDataSource.getRepository(Item)
    .createQueryBuilder("item")
    .where("item.id = :id", { id: itemId })
    .getOne();

  console.log(itemExists)

  if (!itemExists) throw new Error("Sản phẩm không tồn tại");

  // Tìm hoặc tạo giỏ hàng
  let cart = await getCartByUserId(userId);

  console.log(cart)

  if (!cart) {
    cart = cartRepo.create({
      customer: { id: userId } as any,
      createAt: new Date(),
      updateAt: new Date(),
    });
    await cartRepo.save(cart);
  }

  console.log(cart)

  console.log(itemId)

  // Tìm CartItem cũ (dùng any để tránh lỗi TS)
  let cartItem = (cart.items || []).find((ci: any) => ci.item.id === itemId);
  console.log(cartItem)

  if (cartItem) {
    // Fix lỗi undefined: dùng || 0
    cartItem.quantity = (cartItem.quantity || 0) + quantity;
    await cartItemRepo.save(cartItem);
  } else {
    cartItem = await cartItemRepo.create({
      cart: { id: cart.id },
      item: { id: itemId },
      quantity,
    });
    await cartItemRepo.save(cartItem)
  }

  // Cập nhật thời gian
  cart.updateAt = new Date();
  await cartRepo.save(cart);


  return cart;
};