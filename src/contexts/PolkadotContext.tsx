import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { EventType, Product } from '../types/contract';
import { mockPolkadotService, MockAccount } from '../services/mockPolkadotService';

interface PolkadotState {
  isInitialized: boolean;
  isConnected: boolean;
  accounts: MockAccount[];
  selectedAccount: MockAccount | null;
  balance: string;
  admin: string;
  isAuthorized: boolean;
  loading: boolean;
  error: string | null;
}

type PolkadotAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_ACCOUNTS'; payload: MockAccount[] }
  | { type: 'SET_SELECTED_ACCOUNT'; payload: MockAccount | null }
  | { type: 'SET_BALANCE'; payload: string }
  | { type: 'SET_ADMIN'; payload: string }
  | { type: 'SET_AUTHORIZED'; payload: boolean }
  | { type: 'RESET' };

const initialState: PolkadotState = {
  isInitialized: false,
  isConnected: false,
  accounts: [],
  selectedAccount: null,
  balance: '0',
  admin: '',
  isAuthorized: false,
  loading: false,
  error: null,
};

function polkadotReducer(state: PolkadotState, action: PolkadotAction): PolkadotState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    case 'SET_SELECTED_ACCOUNT':
      return { ...state, selectedAccount: action.payload };
    case 'SET_BALANCE':
      return { ...state, balance: action.payload };
    case 'SET_ADMIN':
      return { ...state, admin: action.payload };
    case 'SET_AUTHORIZED':
      return { ...state, isAuthorized: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface PolkadotContextType {
  state: PolkadotState;
  
  // Connection methods
  initialize: (contractAddress?: string) => Promise<void>;
  connectWallet: () => Promise<void>;
  selectAccount: (account: MockAccount) => Promise<void>;
  disconnect: () => Promise<void>;
  
  // Contract methods
  registerProduct: (metadata: string) => Promise<string>;
  logEvent: (productId: string, eventType: EventType) => Promise<void>;
  verifyProduct: (productId: string) => Promise<boolean>;
  getProduct: (productId: string) => Promise<Product | null>;
  getUserProducts: (owner: string) => Promise<string[]>;
  getProductsByOwner: (owner: string) => Promise<string[]>;
  getProductsByManufacturer: (manufacturer: string) => Promise<string[]>;
  addAuthorizedAccount: (account: string) => Promise<void>;
  removeAuthorizedAccount: (account: string) => Promise<void>;
  
  // Utility methods
  refreshBalance: () => Promise<void>;
  checkAuthorization: () => Promise<void>;
}

const PolkadotContext = createContext<PolkadotContextType | undefined>(undefined);

interface PolkadotProviderProps {
  children: ReactNode;
}

export function PolkadotProvider({ children }: PolkadotProviderProps) {
  const [state, dispatch] = useReducer(polkadotReducer, initialState);

  // Auto-initialize on mount
  useEffect(() => {
    const autoInitialize = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await mockPolkadotService.initialize();
        dispatch({ type: 'SET_INITIALIZED', payload: true });
        
        // Get admin address
        const adminAddress = await mockPolkadotService.getAdmin();
        dispatch({ type: 'SET_ADMIN', payload: adminAddress });
        
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        console.error('Failed to initialize:', error);
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to initialize' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    autoInitialize();
  }, []);

  const initialize = async (contractAddress?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await mockPolkadotService.initialize(contractAddress);
      dispatch({ type: 'SET_INITIALIZED', payload: true });
      
      // Get admin address
      const adminAddress = await mockPolkadotService.getAdmin();
      dispatch({ type: 'SET_ADMIN', payload: adminAddress });
      
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error('Failed to initialize:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to initialize' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const connectWallet = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const accounts = await mockPolkadotService.connectWallet();
      
      dispatch({ type: 'SET_ACCOUNTS', payload: accounts });
      dispatch({ type: 'SET_CONNECTED', payload: true });
      
      // Auto-select first account if available
      if (accounts.length > 0) {
        await selectAccount(accounts[0]);
      }
      
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to connect wallet' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const selectAccount = async (account: MockAccount) => {
    try {
      mockPolkadotService.selectAccount(account);
      dispatch({ type: 'SET_SELECTED_ACCOUNT', payload: account });
      
      // Get balance for selected account
      const balance = await mockPolkadotService.getBalance(account.address);
      dispatch({ type: 'SET_BALANCE', payload: balance });
      
      // Check authorization
      const authorized = await mockPolkadotService.isAuthorized(account.address);
      dispatch({ type: 'SET_AUTHORIZED', payload: authorized });
      
    } catch (error) {
      console.error('Failed to select account:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to select account' });
    }
  };

  const disconnect = async () => {
    try {
      await mockPolkadotService.disconnect();
      dispatch({ type: 'RESET' });
    } catch (error) {
      console.error('Failed to disconnect:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to disconnect' });
    }
  };

  const registerProduct = async (metadata: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const productId = await mockPolkadotService.registerProduct(metadata);
      dispatch({ type: 'SET_ERROR', payload: null });
      return productId;
    } catch (error) {
      console.error('Failed to register product:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to register product' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logEvent = async (productId: string, eventType: EventType) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await mockPolkadotService.logEvent(productId, eventType);
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error('Failed to log event:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to log event' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const verifyProduct = async (productId: string) => {
    try {
      return await mockPolkadotService.verifyProduct(productId);
    } catch (error) {
      console.error('Failed to verify product:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to verify product' });
      return false;
    }
  };

  const getProduct = async (productId: string) => {
    try {
      return await mockPolkadotService.getProduct(productId);
    } catch (error) {
      console.error('Failed to get product:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to get product' });
      return null;
    }
  };

  const getUserProducts = async (owner: string) => {
    try {
      return await mockPolkadotService.getProductsByOwner(owner);
    } catch (error) {
      console.error('Failed to get user products:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to get user products' });
      return [];
    }
  };

  const getProductsByOwner = async (owner: string) => {
    try {
      return await mockPolkadotService.getProductsByOwner(owner);
    } catch (error) {
      console.error('Failed to get products by owner:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to get products' });
      return [];
    }
  };

  const getProductsByManufacturer = async (manufacturer: string) => {
    try {
      return await mockPolkadotService.getProductsByManufacturer(manufacturer);
    } catch (error) {
      console.error('Failed to get products by manufacturer:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to get products' });
      return [];
    }
  };

  const addAuthorizedAccount = async (account: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await mockPolkadotService.addAuthorizedAccount(account);
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error('Failed to add authorized account:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to authorize account' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeAuthorizedAccount = async (account: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await mockPolkadotService.removeAuthorizedAccount(account);
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error('Failed to remove authorized account:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to remove authorization' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const refreshBalance = async () => {
    if (!state.selectedAccount) return;
    
    try {
      const balance = await mockPolkadotService.getBalance(state.selectedAccount.address);
      dispatch({ type: 'SET_BALANCE', payload: balance });
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  const checkAuthorization = async () => {
    if (!state.selectedAccount) return;
    
    try {
      const authorized = await mockPolkadotService.isAuthorized(state.selectedAccount.address);
      dispatch({ type: 'SET_AUTHORIZED', payload: authorized });
    } catch (error) {
      console.error('Failed to check authorization:', error);
    }
  };

  const contextValue: PolkadotContextType = {
    state,
    initialize,
    connectWallet,
    selectAccount,
    disconnect,
    registerProduct,
    logEvent,
    verifyProduct,
    getProduct,
    getUserProducts,
    getProductsByOwner,
    getProductsByManufacturer,
    addAuthorizedAccount,
    removeAuthorizedAccount,
    refreshBalance,
    checkAuthorization,
  };

  return (
    <PolkadotContext.Provider value={contextValue}>
      {children}
    </PolkadotContext.Provider>
  );
}

export function usePolkadot() {
  const context = useContext(PolkadotContext);
  if (context === undefined) {
    throw new Error('usePolkadot must be used within a PolkadotProvider');
  }
  return context;
} 