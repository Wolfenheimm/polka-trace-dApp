import React, { useState } from 'react';
import { usePolkadot } from '../contexts/PolkadotContext';
import ProductRegistration from './ProductRegistration';
import ProductLookup from './ProductLookup';
import EventLogger from './EventLogger';
import ProductList from './ProductList';
import AdminPanel from './AdminPanel';
import { WalletModal } from './WalletModal';
import { formatAddress, formatBalance } from '../utils/helpers';

type TabId = 'register' | 'lookup' | 'events' | 'products' | 'admin';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
  description: string;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

const tabs: Tab[] = [
  {
    id: 'lookup',
    label: 'Product Lookup',
    icon: '🔍',
    description: 'Verify and lookup product information'
  },
  {
    id: 'register',
    label: 'Register Product',
    icon: '📦',
    description: 'Register new products in the supply chain'
  },
  {
    id: 'events',
    label: 'Log Events',
    icon: '📝',
    description: 'Log supply chain events',
    requiresAuth: true
  },
  {
    id: 'products',
    label: 'My Products',
    icon: '📋',
    description: 'View your products and those you manufacture'
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: '⚙️',
    description: 'Manage authorized accounts',
    adminOnly: true
  }
];

export function Dashboard() {
  const { state, connectWallet, disconnect } = usePolkadot();
  const [activeTab, setActiveTab] = useState<TabId>('lookup');
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleConnectWallet = async () => {
    setShowWalletModal(true);
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  const getVisibleTabs = () => {
    return tabs.filter(tab => {
      if (tab.adminOnly && state.selectedAccount?.address !== state.admin) {
        return false;
      }
      if (tab.requiresAuth && !state.isAuthorized) {
        return false;
      }
      return true;
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'register':
        return <ProductRegistration />;
      case 'lookup':
        return <ProductLookup />;
      case 'events':
        return <EventLogger />;
      case 'products':
        return <ProductList />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <ProductLookup />;
    }
  };

  const visibleTabs = getVisibleTabs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-polka-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PT</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PolkaTrace</h1>
                  <p className="text-xs text-gray-500">Supply Chain Transparency</p>
                </div>
              </div>
            </div>

            {/* Wallet Connection Status */}
            <div className="flex items-center space-x-4">
              {state.isConnected && state.selectedAccount ? (
                <div className="flex items-center space-x-4">
                  {/* Account Info */}
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {state.selectedAccount.meta.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatAddress(state.selectedAccount.address)}
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="hidden md:block">
                    <div className="bg-gray-100 rounded-lg px-3 py-1">
                      <div className="text-xs text-gray-500">Balance</div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatBalance(state.balance)} DOT
                      </div>
                    </div>
                  </div>

                  {/* Authorization Status */}
                  {state.isAuthorized && (
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      Authorized
                    </div>
                  )}

                  {/* Admin Badge */}
                  {state.selectedAccount.address === state.admin && (
                    <div className="bg-polka-100 text-polka-800 px-2 py-1 rounded-full text-xs font-medium">
                      Admin
                    </div>
                  )}

                  {/* Disconnect Button */}
                  <button
                    onClick={handleDisconnect}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* Connection Status */}
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      state.isInitialized ? 'bg-green-400' : 'bg-yellow-400'
                    }`} />
                    <span className="text-sm text-gray-600">
                      {state.isInitialized ? 'Ready' : 'Initializing...'}
                    </span>
                  </div>

                  {/* Connect Wallet Button */}
                  <button
                    onClick={handleConnectWallet}
                    disabled={!state.isInitialized || state.loading}
                    className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {state.loading ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {state.error && (
          <div className="bg-red-50 border-b border-red-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-red-600 text-sm">⚠️</span>
                  <span className="text-red-800 text-sm">{state.error}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to PolkaTrace
          </h1>
          <p className="text-gray-600">
            Transparent supply chain tracking on the Polkadot network
          </p>
        </div>

        {state.isConnected ? (
          <div>
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {visibleTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-polka-500 text-polka-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-2xl">
                  {visibleTabs.find(tab => tab.id === activeTab)?.icon}
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {visibleTabs.find(tab => tab.id === activeTab)?.label}
                  </h2>
                  <p className="text-gray-600">
                    {visibleTabs.find(tab => tab.id === activeTab)?.description}
                  </p>
                </div>
              </div>
              
              {renderTabContent()}
            </div>
          </div>
        ) : (
          /* Not Connected State */
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-gray-600 mb-6">
              Please connect your Polkadot wallet to start using PolkaTrace
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-blue-800 text-sm">
                💡 <strong>Tip:</strong> Make sure you have the Polkadot.js browser extension installed and configured with accounts.
              </p>
            </div>
          </div>
        )}

        {/* Feature Overview Cards */}
        {!state.isConnected && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tabs.map((tab) => (
              <div key={tab.id} className="card">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{tab.icon}</span>
                  <h3 className="font-semibold text-gray-900">{tab.label}</h3>
                </div>
                <p className="text-gray-600 text-sm">{tab.description}</p>
                {tab.requiresAuth && (
                  <div className="mt-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Requires Authorization
                    </span>
                  </div>
                )}
                {tab.adminOnly && (
                  <div className="mt-2">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Admin Only
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wallet Modal */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </div>
  );
} 