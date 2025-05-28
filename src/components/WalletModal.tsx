import React from 'react';
import { usePolkadot } from '../contexts/PolkadotContext';
import { formatAddress, formatBalance } from '../utils/helpers';
import { MockAccount } from '../services/mockPolkadotService';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { state, connectWallet, selectAccount } = usePolkadot();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleSelectAccount = async (account: MockAccount) => {
    try {
      await selectAccount(account);
      onClose();
    } catch (error) {
      console.error('Failed to select account:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Connect Wallet</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          {!state.isConnected ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-polka-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-polka-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Connect to PolkaTrace
                </h3>
                <p className="text-gray-600 mb-6">
                  Connect your Polkadot wallet to interact with the PolkaTrace supply chain.
                </p>
              </div>

              <button
                onClick={handleConnectWallet}
                disabled={state.loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  'Connect Polkadot.js Wallet'
                )}
              </button>

              <div className="text-center text-sm text-gray-500">
                Make sure you have the Polkadot.js extension installed
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select Account
                </h3>
                <p className="text-gray-600">
                  Choose which account to use for transactions
                </p>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {state.accounts.map((account) => (
                  <button
                    key={account.address}
                    onClick={() => handleSelectAccount(account)}
                    className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                      state.selectedAccount?.address === account.address
                        ? 'border-polka-500 bg-polka-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {account.meta.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatAddress(account.address)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {/* Balance would be loaded here in real implementation */}
                          {account.address === state.selectedAccount?.address ? state.balance : '---'} DOT
                        </div>
                        {state.selectedAccount?.address === account.address && (
                          <div className="text-xs text-polka-600 font-medium">
                            Selected
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {state.selectedAccount && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <div className="flex items-center space-x-2">
                      {state.isAuthorized && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          Authorized
                        </span>
                      )}
                      {state.selectedAccount.address === state.admin && (
                        <span className="bg-polka-100 text-polka-800 px-2 py-1 rounded text-xs">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 