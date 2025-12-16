import { Item } from '../entity/Item'; // Adjust path as needed; assuming entity/Item.ts
import { AppDataSource } from '../config/database'; // Assuming your TypeORM DataSource is exported here

const productRepository = AppDataSource.getRepository(Item);

export async function getAllProducts(): Promise<Item[]> {
  // Assuming all items are products; if filtering by type/category, adjust WHERE clause
  // e.g., return await productRepository.find({ where: { category: Not(IsNull()) } });
  return await productRepository.find();
}

export async function updateProduct(data: Partial<Item> & { id: number }): Promise<Item> {
  const existingProduct = await productRepository.findOne({ where: { id: data.id } });
  if (!existingProduct) {
    throw new Error('Product not found');
  }

  // Merge data with existing; handle itemDetail update for isHidden if quantity is 0
  const updatedData: Partial<Item> = { ...data };
  if (data.quantity === 0 && !updatedData.itemDetail) {
    updatedData.itemDetail = { ...existingProduct.itemDetail, isHidden: true };
  } else if (data.quantity === 0) {
    updatedData.itemDetail = { ...updatedData.itemDetail, isHidden: true };
  }

  const updatedProduct = await productRepository.save({ ...existingProduct, ...updatedData });
  return updatedProduct;
}