export enum EventType {
  Created = 'Created',
  Shipped = 'Shipped',
  InTransit = 'InTransit',
  Received = 'Received',
  Inspected = 'Inspected',
  Verified = 'Verified',
  Delivered = 'Delivered'
}

export interface Product {
  id: string;
  owner: string;
  manufacturer: string;
  metadata: string;
  createdAt: number;
  eventCount: number;
}

export interface ProductEvent {
  productId: string;
  eventType: EventType;
  actor: string;
  timestamp: number;
  blockNumber?: number;
  extrinsicHash?: string;
}

export interface ContractError {
  ProductAlreadyExists: null;
  UnauthorizedAccess: null;
  ProductNotFound: null;
  InvalidEvent: null;
}

export interface PolkaTraceContract {
  registerProduct: (metadata: string) => Promise<string>;
  logEvent: (productId: string, eventType: EventType) => Promise<void>;
  verifyProduct: (productId: string) => Promise<boolean>;
  getProduct: (productId: string) => Promise<Product | null>;
  getProductsByOwner: (owner: string) => Promise<string[]>;
  getProductsByManufacturer: (manufacturer: string) => Promise<string[]>;
  addAuthorizedAccount: (account: string) => Promise<void>;
  removeAuthorizedAccount: (account: string) => Promise<void>;
  isAuthorized: (account: string) => Promise<boolean>;
  getAdmin: () => Promise<string>;
}

export interface WalletState {
  isConnected: boolean;
  accounts: string[];
  selectedAccount: string | null;
  balance: string;
}

export interface AppState {
  wallet: WalletState;
  contract: PolkaTraceContract | null;
  loading: boolean;
  error: string | null;
} 