"use client";

import { createContext, useState } from 'react';
import { Address } from 'viem';

export type WalletAddressContextType = {
  walletAddress: Address | null;
  setWalletAddress: (walletAddress: Address | null) => void;
};

export const WalletAddressContext = createContext<WalletAddressContextType | null>(null);

const WalletAddressProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<Address | null>(null);

  return (
    <WalletAddressContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletAddressContext.Provider>
  );
};

export default WalletAddressProvider;