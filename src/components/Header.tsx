import React from 'react';
import { usePolkadot } from '../contexts/PolkadotContext';
import { formatAddress, formatBalance } from '../utils/helpers';

interface HeaderProps {
  onConnectWallet: () => void;
  onDisconnect: () => void;
}

export function Header({ onConnectWallet, onDisconnect }: HeaderProps) {
  const { state } = usePolkadot();

  return (
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
                  onClick={onDisconnect}
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
                  onClick={onConnectWallet}
                  disabled={!state.isInitialized || state.loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
} 