import { AppDataSource } from "../config/database";
import { Item } from "../entity/Item";

export const itemRepository = AppDataSource.getRepository(Item);

export async function getAllItemsDB() {
  return await itemRepository.find();
}

export async function createItemDB(data: Partial<Item>) {
  const item = itemRepository.create(data);
  return await itemRepository.save(item);
}

export async function updateItemDB(id: number, data: Partial<Item>) {
  const result = await itemRepository.update(id, data);

  if (result.affected === 0) {
    throw new Error("Không tìm thấy món để cập nhật");
  }

  const updatedItem = await itemRepository.findOne({
    where: { id }
  });

  if (!updatedItem) {
    throw new Error("Cập nhật thất bại – không tìm thấy món sau khi lưu");
  }

  return updatedItem;
}

// XÓA
export async function deleteItemDB(id: number) {
  const result = await itemRepository.delete(id);

  if (result.affected === 0) {
    throw new Error("Không tìm thấy món để xóa");
  }

  return { message: "Xóa thành công" };
}
