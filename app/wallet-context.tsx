"use client";

import { createContext, useState } from 'react';
import { Address } from 'viem';

export type WalletContextType = {
  network: string | null;
  setNetwork: (network: string | null) => void;
  walletAddress: Address | null;
  setWalletAddress: (walletAddress: Address | null) => void;
};

export const WalletContext = createContext<WalletContextType | null>(null);

const WalletAddressProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<Address | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress, network, setNetwork }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletAddressProvider;