"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const ProductService_1 = require("../services/ProductService");
class ProductController {
    constructor() {
        this.productService = new ProductService_1.ProductService();
    }
    async getProductList(req, res) {
        try {
            const products = await this.productService.getProductList();
            res.json(products);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }
    async updateProductQuantity(req, res) {
        try {
            const { id, quantity, status } = req.body;
            if (quantity < 0 || !Number.isInteger(quantity)) {
                res.status(400).json({ error: 'Quantity must be a non-negative integer' });
                return;
            }
            const updatedStatus = quantity === 0 ? 'hidden' : status;
            const result = await this.productService.updateProductQuantity(id, quantity, updatedStatus);
            res.json({ message: 'Product updated successfully', data: result });
        }
        catch (error) {
            res.status(500).json({ error: 'Update failed' });
        }
    }
}
exports.ProductController = ProductController;
