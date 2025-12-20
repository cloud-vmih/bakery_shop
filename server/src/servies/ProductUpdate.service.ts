// import { ProdukctDB } from '../db.ProductUpdate';
// import { Item } from '../entity/Item'; // Entity import
//
// export class ProductService {
//   private db: ProductDB;
//
//   constructor() {
//     this.db = new ProductDB();
//   }
//
//   async getProductList(): Promise<Item[]> {
//     return await this.db.getAllProducts();
//   }
//
//   async updateProductQuantity(id: number, quantity: number, status: 'visible' | 'hidden'): Promise<Item> {
//     // Business logic: Auto-hide if quantity is 0
//     if (quantity === 0) {
//       status = 'hidden';
//     }
//     return await this.db.updateProduct({ id, quantity, status });
//   }
// }