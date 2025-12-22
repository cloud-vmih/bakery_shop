import API  from "../api/axois.config";

export interface Product {
  id: number;
  name: string;
  quantity: number;
  status: 'visible' | 'hidden';
}

export const getProductList = async (): Promise<Product[]> => {
  const response = await API.get('/products');
  return response.data;
};

export const updateProductQuantity = async (data: Partial<Product>): Promise<void> => {
  await API.post('/products/update', data);
};