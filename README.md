# 🔗 PolkaTrace - Supply Chain Transparency dApp

<div align="center">

![PolkaTrace Logo](https://via.placeholder.com/200x200/6366f1/ffffff?text=PT)

**Transparent supply chain tracking powered by Polkadot blockchain technology**

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Polkadot](https://img.shields.io/badge/Polkadot-API-pink?logo=polkadot)](https://polkadot.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-cyan?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Live Demo](http://localhost:3000) • [Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-reference)

</div>

## 📖 Overview

PolkaTrace is a decentralized application (dApp) for supply chain transparency built on the Polkadot network. This React-based frontend provides a complete interface for interacting with the PolkaTrace smart contract, enabling end-to-end tracking of products throughout their lifecycle from manufacturing to delivery.

### 🎯 Mission

To create a transparent, immutable, and user-friendly supply chain tracking system that builds trust between manufacturers, distributors, and consumers while combating counterfeiting and ensuring product authenticity.

## ✨ Features

### 🔐 Core Functionality

- **📦 Product Registration**: Register new products with detailed metadata
- **🔍 Product Lookup**: Search and verify product information and history
- **📝 Event Logging**: Log comprehensive supply chain events (Created, Shipped, In Transit, Received, Inspected, Verified, Delivered)
- **📋 Product Management**: View and manage owned products
- **⚙️ Admin Panel**: Manage authorized accounts (admin-only)

### 🔌 Wallet Integration

- **Seamless Connection**: Polkadot{.js} extension support
- **Multi-Account**: Manage multiple wallet accounts
- **Real-time Updates**: Live balance and status displays
- **Secure Transactions**: Safe blockchain interactions

### 🎨 User Experience

- **Responsive Design**: Works on all devices
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Real-time Feedback**: Instant status updates and error handling
- **Intuitive Navigation**: Easy-to-use tabbed interface

## 🛠️ Tech Stack

### Frontend

- **React 18.2.0** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React Context API** - State management

### Blockchain Integration

- **Polkadot.js API** - Blockchain interaction
- **Polkadot Extension** - Wallet connectivity
- **Substrate** - Blockchain framework compatibility
- **Ink! Smart Contracts** - Contract interaction

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Polkadot{.js} Extension** ([Chrome](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/polka-trace-dApp.git
   cd polka-trace-dApp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

5. **Connect your wallet**
   Click "Connect Wallet" and select your Polkadot account

## 📱 Usage Guide

### Getting Started

1. **Install Polkadot Extension**: Add the Polkadot{.js} extension to your browser
2. **Create/Import Account**: Set up a Polkadot account in the extension
3. **Connect Wallet**: Click "Connect Wallet" in the PolkaTrace interface
4. **Select Account**: Choose which account to use for transactions

### Core Operations

#### 📦 Registering Products

1. Navigate to **"Register Product"** tab
2. Fill in product details:
   - Product name
   - Description
   - Initial location
3. Click **"Register Product"** to submit to blockchain

#### 🔍 Looking Up Products

1. Go to **"Product Lookup"** tab
2. Enter the product ID
3. View complete product information and history

#### 📝 Logging Events

1. Select **"Log Events"** tab
2. Enter product ID and select event type
3. Submit event (requires authorization)

#### 📋 Managing Products

1. Visit **"My Products"** to view owned products
2. See comprehensive product listings with metadata
3. Track ownership and event history

#### ⚙️ Admin Functions

1. Access **"Admin Panel"** (admin accounts only)
2. Authorize/deauthorize accounts for event logging
3. Manage system permissions

## 🏗️ Project Structure

```
polka-trace-dApp/
├── public/                  # Static assets
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/          # React components
│   │   ├── AdminPanel.tsx   # Admin management
│   │   ├── Dashboard.tsx    # Main interface
│   │   ├── EventLogger.tsx  # Event logging
│   │   ├── ProductList.tsx  # Product management
│   │   ├── ProductLookup.tsx# Product search
│   │   ├── ProductRegistration.tsx # Product creation
│   │   └── WalletModal.tsx  # Wallet connection
│   ├── contexts/            # React contexts
│   │   └── PolkadotContext.tsx # Blockchain state
│   ├── services/            # External services
│   │   ├── mockPolkadotService.ts # Development mock
│   │   └── polkadotService.ts     # Blockchain service
│   ├── types/               # TypeScript definitions
│   │   └── contract.ts      # Smart contract types
│   ├── utils/               # Utility functions
│   │   └── helpers.ts       # Helper functions
│   ├── contracts/           # Smart contract metadata
│   │   └── polka_trace.json # Contract ABI
│   ├── App.tsx             # Main application
│   ├── index.tsx           # Entry point
│   └── index.css           # Global styles
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── LICENSE
└── README.md
```

## 📋 API Reference

### Context Methods

```typescript
// Wallet Management
connectWallet(): Promise<MockAccount[]>
selectAccount(account: MockAccount): Promise<void>
disconnect(): Promise<void>

// Product Operations
registerProduct(metadata: string): Promise<string>
getProduct(productId: string): Promise<Product | null>
getUserProducts(owner: string): Promise<string[]>

// Event Logging
logEvent(productId: string, eventType: EventType): Promise<void>

// Authorization (Admin Only)
addAuthorizedAccount(account: string): Promise<void>
removeAuthorizedAccount(account: string): Promise<void>
```

### Event Types

```typescript
enum EventType {
  Created = "Created",
  Shipped = "Shipped",
  InTransit = "InTransit",
  Received = "Received",
  Inspected = "Inspected",
  Verified = "Verified",
  Delivered = "Delivered",
}
```

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject CRA configuration

### Environment Setup

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd polka-trace-dApp
   npm install
   ```

2. **Configure environment** (optional)

   ```bash
   echo "REACT_APP_WS_ENDPOINT=ws://127.0.0.1:9944" > .env
   ```

3. **Start development server**
   ```bash
   npm start
   ```

### Mock vs Real Blockchain

The application includes both mock and real blockchain services:

- **Mock Service**: For development and testing (default)
- **Real Service**: For production with actual Polkadot network

To switch to real blockchain, update the contract address and endpoint in the Polkadot service configuration.

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Hosting Platform

The app can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Deploy the `build` folder
- **AWS S3**: Upload `build` folder contents
- **GitHub Pages**: Use `gh-pages` branch

### Environment Variables

For production, configure:

- `REACT_APP_WS_ENDPOINT` - Polkadot node endpoint
- `REACT_APP_CONTRACT_ADDRESS` - Deployed contract address

## 🐛 Troubleshooting

### Common Issues

**1. Wallet Connection Fails**

- Ensure Polkadot{.js} extension is installed and enabled
- Check that you have accounts configured in the extension
- Verify the website has permission to access the extension

**2. Transaction Failures**

- Confirm you have sufficient balance for transaction fees
- Verify your account has necessary permissions for the operation
- Check network connectivity and node status

**3. Build Errors**

- Clear node_modules: `rm -rf node_modules && npm install`
- Update dependencies: `npm update`
- Check Node.js version compatibility

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compatibility

## 🗺️ Roadmap

- [ ] **Enhanced Analytics** - Advanced supply chain analytics dashboard
- [ ] **Mobile App** - Native mobile applications
- [ ] **Real-time Notifications** - Push notifications for events
- [ ] **Multi-language Support** - Internationalization
- [ ] **Advanced Filtering** - Enhanced product search and filtering
- [ ] **Export Features** - Data export capabilities
- [ ] **Integration APIs** - Third-party system integration

## 🙏 Acknowledgments

- **Polkadot Team** - For the amazing blockchain framework
- **Substrate** - For the development tools
- **Ink!** - For the smart contract language
- **React Team** - For the UI framework
- **Tailwind CSS** - For the styling system
- **Open Source Community** - For the incredible tools and libraries

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for the future of supply chain transparency**

**Powered by Polkadot • Open Source Forever**

[Issues](https://github.com/your-username/polka-trace-dApp/issues) • [Discussions](https://github.com/your-username/polka-trace-dApp/discussions) • [Contributing](CONTRIBUTING.md)

</div>
