import { Item } from '../entity/Item'; // Assuming Item.ts exports Product interface and model

// Mock DB for illustration; replace with actual DB client (e.g., Prisma, Sequelize)
let mockProducts: Item[] = [
  { id: 1, name: 'Cake A', quantity: 10, status: 'visible' as const },
  { id: 2, name: 'Cake B', quantity: 0, status: 'hidden' as const },
];

export class ProductDB {
  async getAllProducts(): Promise<Item[]> {
    // In real: return await prisma.item.findMany({ where: { type: 'product' } });
    return mockProducts;
  }

  async updateProduct(data: Partial<Item> & { id: number }): Promise<Item> {
    const index = mockProducts.findIndex(p => p.id === data.id);
    if (index === -1) throw new Error('Product not found');
    
    mockProducts[index] = { ...mockProducts[index], ...data, status: data.status || mockProducts[index].status };
    
    // In real: return await prisma.item.update({ where: { id: data.id }, data });
    return mockProducts[index];
  }
}