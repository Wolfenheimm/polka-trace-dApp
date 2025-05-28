import { EventType } from '../types/contract';

export const formatAddress = (address: string, length: number = 8): string => {
  if (!address) return '';
  if (address.length <= length * 2) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

export const formatBalance = (balance: string): string => {
  try {
    const balanceNum = parseFloat(balance);
    if (balanceNum === 0) return '0';
    if (balanceNum < 0.001) return '<0.001';
    if (balanceNum < 1) return balanceNum.toFixed(3);
    if (balanceNum < 1000) return balanceNum.toFixed(2);
    if (balanceNum < 1000000) return `${(balanceNum / 1000).toFixed(1)}K`;
    return `${(balanceNum / 1000000).toFixed(1)}M`;
  } catch {
    return '0';
  }
};

export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getEventTypeColor = (eventType: EventType): string => {
  switch (eventType) {
    case EventType.Created:
      return 'status-created';
    case EventType.Shipped:
      return 'status-shipped';
    case EventType.InTransit:
      return 'status-intransit';
    case EventType.Received:
      return 'status-received';
    case EventType.Inspected:
      return 'status-inspected';
    case EventType.Verified:
      return 'status-verified';
    case EventType.Delivered:
      return 'status-delivered';
    default:
      return 'status-badge bg-gray-100 text-gray-800';
  }
};

export const getEventIcon = (eventType: EventType): string => {
  switch (eventType) {
    case EventType.Created:
      return '🏭';
    case EventType.Shipped:
      return '📦';
    case EventType.InTransit:
      return '🚛';
    case EventType.Received:
      return '✅';
    case EventType.Inspected:
      return '🔍';
    case EventType.Verified:
      return '✔️';
    case EventType.Delivered:
      return '🏠';
    default:
      return '📄';
  }
};

export const validateProductId = (productId: string): boolean => {
  if (!productId) return false;
  const num = parseInt(productId, 10);
  return !isNaN(num) && num > 0;
};

export const validateMetadata = (metadata: string): boolean => {
  return metadata.trim().length >= 3;
};

export const getEventTypeOptions = (): { value: EventType; label: string; description: string }[] => {
  return [
    {
      value: EventType.Created,
      label: 'Created',
      description: 'Product has been manufactured/created'
    },
    {
      value: EventType.Shipped,
      label: 'Shipped',
      description: 'Product has been shipped from current location'
    },
    {
      value: EventType.InTransit,
      label: 'In Transit',
      description: 'Product is currently being transported'
    },
    {
      value: EventType.Received,
      label: 'Received',
      description: 'Product has been received (transfers ownership)'
    },
    {
      value: EventType.Inspected,
      label: 'Inspected',
      description: 'Product has undergone quality inspection'
    },
    {
      value: EventType.Verified,
      label: 'Verified',
      description: 'Product has been officially verified/certified'
    },
    {
      value: EventType.Delivered,
      label: 'Delivered',
      description: 'Product has been delivered to final destination'
    }
  ];
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}; 