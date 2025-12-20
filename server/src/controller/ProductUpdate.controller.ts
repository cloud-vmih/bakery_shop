// import { Request, Response } from 'express';
// import { ProductService } from '../services/ProductService';
// import { Item } from '../entity/Item'; // Assuming Item.ts defines the Product entity
//
// export class ProductController {
//   private productService: ProductService;
//
//   constructor() {
//     this.productService = new ProductService();
//   }
//
//   async getProductList(req: Request, res: Response): Promise<void> {
//     try {
//       const products = await this.productService.getProductList();
//       res.json(products);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch products' });
//     }
//   }
//
//   async updateProductQuantity(req: Request, res: Response): Promise<void> {
//     try {
//       const { id, quantity, status } = req.body;
//       if (quantity < 0 || !Number.isInteger(quantity)) {
//         res.status(400).json({ error: 'Quantity must be a non-negative integer' });
//         return;
//       }
//       const updatedStatus = quantity === 0 ? 'hidden' : status;
//       const result = await this.productService.updateProductQuantity(id, quantity, updatedStatus);
//       res.json({ message: 'Product updated successfully', data: result });
//     } catch (error) {
//       res.status(500).json({ error: 'Update failed' });
//     }
//   }
// }