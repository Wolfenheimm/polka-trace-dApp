import React from 'react';
import { PolkadotProvider } from './contexts/PolkadotContext';
import { Dashboard } from './components/Dashboard';
import './index.css';

function App() {
  return (
    <PolkadotProvider>
      <div className="min-h-screen bg-gray-50">
        <Dashboard />
      </div>
    </PolkadotProvider>
  );
}

export default App;
