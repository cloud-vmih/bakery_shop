<<<<<<< HEAD
=======
// src/db/db.cart.ts
>>>>>>> feature/updateQuantity-v2
import { AppDataSource } from "../config/database";
import { Cart } from "../entity/Cart";
import { CartItem } from "../entity/CartItem";
import { Item } from "../entity/Item";

<<<<<<< HEAD
export const getCartByUserId = async (userId: number) => {
  return await AppDataSource.getRepository(Cart).findOne({
    where: { customer: { id: userId } },
    relations: {
      items: {
        item: true, // 👈 load luôn product
      },
    },
  });
};

export const createOrUpdateCart = async (
  userId: number,
  itemId: number,
  quantity: number = 1
) => {
  const cartRepo = AppDataSource.getRepository(Cart);
  const cartItemRepo = AppDataSource.getRepository(CartItem);
  const itemRepo = AppDataSource.getRepository(Item);

  // 1️⃣ Check item
  const item = await itemRepo.findOne({
    where: { id: itemId },
    select: ["id"],
  });
  if (!item) throw new Error("Sản phẩm không tồn tại");

  // 2️⃣ Get or create cart
  let cart = await getCartByUserId(userId);

  if (!cart) {
    const newCart = cartRepo.create({
=======
// Thêm lại hàm này (đã mất)
export const getCartByUserId = async (userId: number) => {
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
>>>>>>> feature/updateQuantity-v2
      customer: { id: userId } as any,
      createAt: new Date(),
      updateAt: new Date(),
    });
<<<<<<< HEAD
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
  } else {
    const newCartItem = cartItemRepo.create({
      cart: { id: cart.id } as Cart,
      item: { id: itemId } as Item,
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

export const clearCartByUserId = async (userId: number) => {
  const cartRepo = AppDataSource.getRepository(Cart);

  const cart = await cartRepo.findOne({
    where: { customer: { id: userId } },
    relations: ["items"],
  });

  if (!cart) return true;

  await cartRepo.remove(cart);
  return true;
};
=======
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
>>>>>>> feature/updateQuantity-v2
