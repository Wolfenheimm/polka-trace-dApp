import React, { useState, useEffect } from 'react';
import { usePolkadot } from '../contexts/PolkadotContext';
import { Package, User, Clock, Loader, RefreshCw } from 'lucide-react';
import { Product } from '../types/contract';
import { formatAddress, formatTimestamp } from '../utils/helpers';

const ProductList: React.FC = () => {
  const { getProductsByOwner, getProduct, state } = usePolkadot();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadProducts = async () => {
    if (!state.selectedAccount) return;

    setIsLoading(true);
    try {
      const productIds = await getProductsByOwner(state.selectedAccount.address);
      const productPromises = productIds.map(id => getProduct(id));
      const productResults = await Promise.all(productPromises);
      const validProducts = productResults.filter((p): p is Product => p !== null);
      setProducts(validProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [state.selectedAccount]);

  if (!state.selectedAccount) {
    return (
      <div className="card text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">My Products</h2>
        <p className="text-gray-600">Please connect your wallet to view your products</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-polka-600" />
          <h2 className="text-xl font-semibold text-gray-900">My Products</h2>
        </div>
        <button
          onClick={loadProducts}
          disabled={isLoading}
          className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="card text-center py-12">
          <Loader className="w-8 h-8 animate-spin text-polka-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="card text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600">You don't own any products yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {products.map((product) => (
            <div key={product.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Product #{product.id}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{product.metadata}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div><span className="font-medium">ID:</span> {product.id}</div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Manufacturer:</span> {formatAddress(product.manufacturer)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Created:</span> {formatTimestamp(product.createdAt)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Event Count:</span> {product.eventCount}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Owned
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { ProductList };
export default ProductList; 