import { Router } from 'express';
import { ProductController } from '../controller/ProductUpdate.controller';

const router = Router();
const productController = new ProductController();

router.get('/products', productController.getProductList.bind(productController));
router.post('/products/update', productController.updateProductQuantity.bind(productController));

export default router;