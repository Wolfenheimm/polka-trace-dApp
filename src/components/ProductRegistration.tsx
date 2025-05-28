import React, { useState } from 'react';
import { usePolkadot } from '../contexts/PolkadotContext';
import { Package, Plus, Loader } from 'lucide-react';

const ProductRegistration: React.FC = () => {
  const { registerProduct, state } = usePolkadot();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    initialLocation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.initialLocation.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const metadata = `${formData.name} | ${formData.description} | Initial Location: ${formData.initialLocation}`;
      await registerProduct(metadata);
      setFormData({ name: '', description: '', initialLocation: '' });
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const isFormValid = formData.name.trim() && formData.description.trim() && formData.initialLocation.trim();

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-6 h-6 text-polka-600" />
        <h2 className="text-xl font-semibold text-gray-900">Register New Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter product name"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="input-field resize-none"
            placeholder="Enter product description"
            required
          />
        </div>

        <div>
          <label htmlFor="initialLocation" className="block text-sm font-medium text-gray-700 mb-1">
            Initial Location *
          </label>
          <input
            type="text"
            id="initialLocation"
            name="initialLocation"
            value={formData.initialLocation}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter initial location"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting || !state.selectedAccount}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {isSubmitting ? 'Registering...' : 'Register Product'}
        </button>

        {!state.selectedAccount && (
          <p className="text-sm text-amber-600 text-center">
            Please connect your wallet to register products
          </p>
        )}
      </form>
    </div>
  );
};

export { ProductRegistration };
export default ProductRegistration; 