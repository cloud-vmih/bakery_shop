import { useState, useEffect } from 'react';
import { getProductList, updateProductQuantity } from '../services/ProductUpdate.service';

interface Product {
  id: number;
  name: string;
  quantity: number;
  status: 'visible' | 'hidden';
}

const StaffProductUpdatePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [status, setStatus] = useState<'visible' | 'hidden'>('visible');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProductList();
      setProducts(data);
    } catch (error) {
      setMessage('Error fetching products');
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setNewQuantity(product.quantity);
    setStatus(product.status);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const updatedData = {
        id: selectedProduct.id,
        quantity: newQuantity,
        status: newQuantity === 0 ? 'hidden' : status, // Auto-hide if quantity is 0
      };
      await updateProductQuantity(updatedData);
      setMessage('Product updated successfully');
      fetchProducts(); // Refresh list
      setSelectedProduct(null);
    } catch (error) {
      setMessage('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) {
      setMessage('Quantity must be a non-negative integer');
      return;
    }
    setNewQuantity(value);
    setMessage(''); // Clear error
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Update Product Quantity</h1>
      {message && <p>{message}</p>}
      
      {/* Product List */}
      {!selectedProduct ? (
        <div>
          <h2>Product List</h2>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                {product.name} - Quantity: {product.quantity} - Status: {product.status}
                <button onClick={() => handleSelectProduct(product)}>Edit</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        /* Edit Form */
        <form onSubmit={handleSubmit}>
          <h2>Edit {selectedProduct.name}</h2>
          <label>
            Quantity:
            <input
              type="number"
              value={newQuantity}
              onChange={handleQuantityChange}
              min="0"
            />
          </label>
          <label>
            Status:
            <select value={status} onChange={(e) => setStatus(e.target.value as 'visible' | 'hidden')}>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
          {newQuantity === 0 && (
            <p>Product out of stock. Suggest hiding?</p>
          )}
          <button type="submit" disabled={loading}>Save Changes</button>
          <button type="button" onClick={() => setSelectedProduct(null)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default StaffProductUpdatePage;