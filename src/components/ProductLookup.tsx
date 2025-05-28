import React, { useState } from 'react';
import { usePolkadot } from '../contexts/PolkadotContext';
import { Search, Package, MapPin, User, Clock, Loader } from 'lucide-react';
import { Product } from '../types/contract';
import { formatAddress, formatTimestamp } from '../utils/helpers';

const ProductLookup: React.FC = () => {
  const { getProduct, state } = usePolkadot();
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId.trim()) return;

    setIsSearching(true);
    setError(null);
    setProduct(null);

    try {
      const result = await getProduct(productId);
      if (result) {
        setProduct(result);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to fetch product');
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-6 h-6 text-polka-600" />
          <h2 className="text-xl font-semibold text-gray-900">Product Lookup</h2>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="input-field flex-1"
            placeholder="Enter Product ID"
          />
          <button
            type="submit"
            disabled={!productId.trim() || isSearching}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Search
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Product Details */}
      {product && (
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-polka-600" />
            <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">ID:</span> {product.id}</div>
                <div><span className="font-medium">Metadata:</span> {product.metadata}</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Ownership & Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Owner:</span> {formatAddress(product.owner)}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Manufacturer:</span> {formatAddress(product.manufacturer)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Created:</span> {formatTimestamp(product.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Event Count:</span> {product.eventCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ProductLookup };
export default ProductLookup; 