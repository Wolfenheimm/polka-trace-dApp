import { EventType, Product } from '../types/contract';
import { sleep } from '../utils/helpers';

export interface MockAccount {
  address: string;
  meta: {
    name: string;
    source: string;
  };
}

class MockPolkadotService {
  private accounts: MockAccount[] = [];
  private selectedAccount: MockAccount | null = null;
  private products: Map<string, Product> = new Map();
  private authorizedAccounts: Set<string> = new Set();
  private admin: string = '';
  private nextProductId: number = 1;
  private isConnected: boolean = false;

  async initialize(contractAddress?: string): Promise<void> {
    await sleep(1000); // Simulate connection delay
    console.log('✅ Mock Polkadot API initialized');
    
    // Mock some initial data
    this.admin = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
    this.authorizedAccounts.add(this.admin);
    
    // Add some sample products
    this.products.set('1', {
      id: '1',
      owner: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      manufacturer: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      metadata: 'Organic Coffee Beans - Ethiopian Highlands - Batch #2024001',
      createdAt: Date.now() - 86400000, // 1 day ago
      eventCount: 3
    });
    
    this.products.set('2', {
      id: '2',
      owner: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
      manufacturer: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      metadata: 'Premium Swiss Watch - Model XLT-2024',
      createdAt: Date.now() - 172800000, // 2 days ago
      eventCount: 5
    });
  }

  async connectWallet(): Promise<MockAccount[]> {
    await sleep(800); // Simulate connection delay
    
    this.accounts = [
      {
        address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        meta: { name: 'Alice', source: 'polkadot-js' }
      },
      {
        address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        meta: { name: 'Bob', source: 'polkadot-js' }
      },
      {
        address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
        meta: { name: 'Charlie', source: 'polkadot-js' }
      },
      {
        address: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
        meta: { name: 'Dave', source: 'polkadot-js' }
      }
    ];
    
    this.isConnected = true;
    console.log('✅ Mock wallet connected', this.accounts.length, 'accounts found');
    return this.accounts;
  }

  selectAccount(account: MockAccount): void {
    this.selectedAccount = account;
  }

  async getBalance(address: string): Promise<string> {
    await sleep(300);
    // Return mock balances
    const balances: Record<string, string> = {
      '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY': '1000000000000', // 1000 DOT
      '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty': '500000000000',  // 500 DOT
      '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y': '250000000000',  // 250 DOT
      '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy': '100000000000'   // 100 DOT
    };
    return balances[address] || '0';
  }

  async registerProduct(metadata: string): Promise<string> {
    if (!this.selectedAccount) {
      throw new Error('No account selected');
    }

    await sleep(2000); // Simulate transaction time
    
    const productId = this.nextProductId.toString();
    this.nextProductId++;
    
    const product: Product = {
      id: productId,
      owner: this.selectedAccount.address,
      manufacturer: this.selectedAccount.address,
      metadata,
      createdAt: Date.now(),
      eventCount: 1
    };
    
    this.products.set(productId, product);
    console.log('✅ Product registered:', productId);
    return productId;
  }

  async logEvent(productId: string, eventType: EventType): Promise<void> {
    if (!this.selectedAccount) {
      throw new Error('No account selected');
    }

    if (!this.authorizedAccounts.has(this.selectedAccount.address)) {
      throw new Error('Account not authorized');
    }

    const product = this.products.get(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    await sleep(1500); // Simulate transaction time
    
    // Update event count
    product.eventCount += 1;
    
    // Handle ownership transfer for Received events
    if (eventType === EventType.Received) {
      product.owner = this.selectedAccount.address;
    }
    
    this.products.set(productId, product);
    console.log('✅ Event logged:', eventType, 'for product:', productId);
  }

  async verifyProduct(productId: string): Promise<boolean> {
    await sleep(500);
    return this.products.has(productId);
  }

  async getProduct(productId: string): Promise<Product | null> {
    await sleep(500);
    return this.products.get(productId) || null;
  }

  async getProductsByOwner(owner: string): Promise<string[]> {
    await sleep(500);
    const productIds: string[] = [];
    
    Array.from(this.products.entries()).forEach(([id, product]) => {
      if (product.owner === owner) {
        productIds.push(id);
      }
    });
    
    return productIds;
  }

  async getProductsByManufacturer(manufacturer: string): Promise<string[]> {
    await sleep(500);
    const productIds: string[] = [];
    
    Array.from(this.products.entries()).forEach(([id, product]) => {
      if (product.manufacturer === manufacturer) {
        productIds.push(id);
      }
    });
    
    return productIds;
  }

  async isAuthorized(account: string): Promise<boolean> {
    await sleep(300);
    return this.authorizedAccounts.has(account) || account === this.admin;
  }

  async addAuthorizedAccount(account: string): Promise<void> {
    if (!this.selectedAccount || this.selectedAccount.address !== this.admin) {
      throw new Error('Only admin can authorize accounts');
    }
    
    await sleep(1000);
    this.authorizedAccounts.add(account);
    console.log('✅ Account authorized:', account);
  }

  async removeAuthorizedAccount(account: string): Promise<void> {
    if (!this.selectedAccount || this.selectedAccount.address !== this.admin) {
      throw new Error('Only admin can remove authorization');
    }
    
    await sleep(1000);
    this.authorizedAccounts.delete(account);
    console.log('✅ Account unauthorized:', account);
  }

  async getAdmin(): Promise<string> {
    await sleep(200);
    return this.admin;
  }

  // Getters
  get isWalletConnected(): boolean {
    return this.isConnected && this.accounts.length > 0;
  }

  get currentAccount(): MockAccount | null {
    return this.selectedAccount;
  }

  get allAccounts(): MockAccount[] {
    return this.accounts;
  }

  // Disconnect
  async disconnect(): Promise<void> {
    this.isConnected = false;
    this.accounts = [];
    this.selectedAccount = null;
  }
}

// Singleton instance
export const mockPolkadotService = new MockPolkadotService(); 