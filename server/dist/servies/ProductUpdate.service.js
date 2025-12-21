"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
class ProductService {
    constructor() {
        this.db = new ProductDB();
    }
    async getProductList() {
        return await this.db.getAllProducts();
    }
    async updateProductQuantity(id, quantity, status) {
        // Business logic: Auto-hide if quantity is 0
        if (quantity === 0) {
            status = 'hidden';
        }
        return await this.db.updateProduct({ id, quantity, status });
    }
}
exports.ProductService = ProductService;
