import React, { useState } from 'react';
import { usePolkadot } from '../contexts/PolkadotContext';
import { FileText, MapPin, Calendar, Loader } from 'lucide-react';
import { EventType } from '../types/contract';

const EventLogger: React.FC = () => {
  const { logEvent, state } = usePolkadot();
  const [formData, setFormData] = useState({
    productId: '',
    eventType: EventType.Shipped
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eventOptions = [
    { value: EventType.Created, label: 'Created' },
    { value: EventType.Shipped, label: 'Shipped' },
    { value: EventType.InTransit, label: 'In Transit' },
    { value: EventType.Received, label: 'Received' },
    { value: EventType.Inspected, label: 'Inspected' },
    { value: EventType.Verified, label: 'Verified' },
    { value: EventType.Delivered, label: 'Delivered' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await logEvent(formData.productId, formData.eventType);
      setFormData({
        productId: '',
        eventType: EventType.Shipped
      });
    } catch (error) {
      console.error('Event logging failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'eventType' ? value as EventType : value
    }));
  };

  const isFormValid = formData.productId.trim();

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-polka-600" />
        <h2 className="text-xl font-semibold text-gray-900">Log Product Event</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
            Product ID *
          </label>
          <input
            type="text"
            id="productId"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter product ID"
            required
          />
        </div>

        <div>
          <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
            Event Type *
          </label>
          <select
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className="input-field"
            required
          >
            {eventOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting || !state.selectedAccount || !state.isAuthorized}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Calendar className="w-4 h-4" />
          )}
          {isSubmitting ? 'Logging Event...' : 'Log Event'}
        </button>

        {!state.selectedAccount && (
          <p className="text-sm text-amber-600 text-center">
            Please connect your wallet to log events
          </p>
        )}

        {state.selectedAccount && !state.isAuthorized && (
          <p className="text-sm text-red-600 text-center">
            Your account is not authorized to log events. Contact the admin to get authorization.
          </p>
        )}
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Event Types Guide</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-800">
          <div><strong>Created:</strong> Product manufactured</div>
          <div><strong>Shipped:</strong> Product dispatched</div>
          <div><strong>In Transit:</strong> Product in movement</div>
          <div><strong>Received:</strong> Product received</div>
          <div><strong>Inspected:</strong> Quality check done</div>
          <div><strong>Verified:</strong> Authenticity confirmed</div>
          <div><strong>Delivered:</strong> Final delivery</div>
        </div>
      </div>
    </div>
  );
};

export { EventLogger };
export default EventLogger; 