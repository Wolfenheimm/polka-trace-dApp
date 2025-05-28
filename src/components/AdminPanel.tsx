import React, { useState, useEffect } from 'react';
import { usePolkadot } from '../contexts/PolkadotContext';
import { Shield, UserPlus, UserMinus, Users, Loader, AlertCircle } from 'lucide-react';
import { formatAddress } from '../utils/helpers';

const AdminPanel: React.FC = () => {
  const { state, addAuthorizedAccount, removeAuthorizedAccount } = usePolkadot();
  const [newAccountAddress, setNewAccountAddress] = useState('');
  const [removeAccountAddress, setRemoveAccountAddress] = useState('');
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isRemovingAccount, setIsRemovingAccount] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearMessages = () => {
    setSuccessMessage(null);
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountAddress.trim()) return;

    setIsAddingAccount(true);
    clearMessages();

    try {
      await addAuthorizedAccount(newAccountAddress);
      setSuccessMessage(`Account ${formatAddress(newAccountAddress)} has been authorized successfully!`);
      setNewAccountAddress('');
    } catch (error) {
      console.error('Failed to add authorized account:', error);
    } finally {
      setIsAddingAccount(false);
    }
  };

  const handleRemoveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!removeAccountAddress.trim()) return;

    setIsRemovingAccount(true);
    clearMessages();

    try {
      await removeAuthorizedAccount(removeAccountAddress);
      setSuccessMessage(`Account ${formatAddress(removeAccountAddress)} authorization has been removed successfully!`);
      setRemoveAccountAddress('');
    } catch (error) {
      console.error('Failed to remove authorized account:', error);
    } finally {
      setIsRemovingAccount(false);
    }
  };

  // Check if current user is admin
  if (state.selectedAccount?.address !== state.admin) {
    return (
      <div className="card text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">Only the contract administrator can access this panel.</p>
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            <strong>Admin Address:</strong> {formatAddress(state.admin)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-polka-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Admin Panel</h2>
        </div>
        <p className="text-gray-600">
          Manage authorized accounts that can log supply chain events. Only authorized accounts can create lifecycle events for products.
        </p>
        
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            <strong>You are logged in as Admin:</strong> {formatAddress(state.selectedAccount?.address || '')}
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Add Authorized Account */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <UserPlus className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Add Authorized Account</h3>
        </div>
        
        <form onSubmit={handleAddAccount} className="space-y-4">
          <div>
            <label htmlFor="newAccount" className="block text-sm font-medium text-gray-700 mb-1">
              Account Address *
            </label>
            <input
              type="text"
              id="newAccount"
              value={newAccountAddress}
              onChange={(e) => setNewAccountAddress(e.target.value)}
              className="input"
              placeholder="Enter Polkadot account address"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the full Polkadot account address (starts with 5...)
            </p>
          </div>

          <button
            type="submit"
            disabled={!newAccountAddress.trim() || isAddingAccount}
            className="btn btn-primary flex items-center gap-2"
          >
            {isAddingAccount ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {isAddingAccount ? 'Adding Account...' : 'Add Authorized Account'}
          </button>
        </form>
      </div>

      {/* Remove Authorized Account */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <UserMinus className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Remove Authorized Account</h3>
        </div>
        
        <form onSubmit={handleRemoveAccount} className="space-y-4">
          <div>
            <label htmlFor="removeAccount" className="block text-sm font-medium text-gray-700 mb-1">
              Account Address *
            </label>
            <input
              type="text"
              id="removeAccount"
              value={removeAccountAddress}
              onChange={(e) => setRemoveAccountAddress(e.target.value)}
              className="input"
              placeholder="Enter Polkadot account address"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the account address you want to remove authorization from
            </p>
          </div>

          <button
            type="submit"
            disabled={!removeAccountAddress.trim() || isRemovingAccount}
            className="btn btn-secondary border-red-300 text-red-700 hover:bg-red-50 flex items-center gap-2"
          >
            {isRemovingAccount ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <UserMinus className="w-4 h-4" />
            )}
            {isRemovingAccount ? 'Removing Account...' : 'Remove Authorization'}
          </button>
        </form>
      </div>

      {/* Quick Actions with Current Accounts */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-polka-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            You can quickly authorize or remove authorization for accounts from your connected wallet:
          </p>
          
          <div className="grid gap-2">
            {state.accounts.map((account) => (
              <div key={account.address} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{account.meta.name}</div>
                  <div className="text-xs text-gray-500">{formatAddress(account.address)}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewAccountAddress(account.address)}
                    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    Authorize
                  </button>
                  <button
                    onClick={() => setRemoveAccountAddress(account.address)}
                    className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Information Panel */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Authorization Information</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Authorized accounts can log supply chain events for any product</p>
              <p>• The admin account is always authorized and cannot be removed</p>
              <p>• Authorization is required for the "Log Events" functionality</p>
              <p>• Any account can register products and view product information</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdminPanel };
export default AdminPanel; 