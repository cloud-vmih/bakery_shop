"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = getAllProducts;
exports.updateProduct = updateProduct;
const Item_1 = require("../entity/Item"); // Adjust path as needed; assuming entity/Item.ts
const database_1 = require("../config/database"); // Assuming your TypeORM DataSource is exported here
const productRepository = database_1.AppDataSource.getRepository(Item_1.Item);
async function getAllProducts() {
    // Assuming all items are products; if filtering by type/category, adjust WHERE clause
    // e.g., return await productRepository.find({ where: { category: Not(IsNull()) } });
    return await productRepository.find();
}
async function updateProduct(data) {
    const existingProduct = await productRepository.findOne({ where: { id: data.id } });
    if (!existingProduct) {
        throw new Error('Product not found');
    }
    // Merge data with existing; handle itemDetail update for isHidden if quantity is 0
    const updatedData = { ...data };
    if (data.quantity === 0 && !updatedData.itemDetail) {
        updatedData.itemDetail = { ...existingProduct.itemDetail, isHidden: true };
    }
    else if (data.quantity === 0) {
        updatedData.itemDetail = { ...updatedData.itemDetail, isHidden: true };
    }
    const updatedProduct = await productRepository.save({ ...existingProduct, ...updatedData });
    return updatedProduct;
}
