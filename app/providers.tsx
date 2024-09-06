'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  klaytn,
  klaytnBaobab
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http } from 'wagmi';
// import according to docs

const { wallets } = getDefaultWallets();
// initialize and destructure wallets object

const config = getDefaultConfig({
  appName: 'GMGN', // Name your app
  projectId: "e0e485365ce5d5ab04d3dd795f627315", // Enter your WalletConnect Project ID here
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [trustWallet, ledgerWallet],
    },
  ],
  chains: [
    klaytn,
    klaytnBaobab
  ],
  transports: {
    [klaytn.id]: http('https://rpc.ankr.com/klaytn'),
    [klaytnBaobab.id]: http('https://rpc.ankr.com/klaytn_testnet'),
  },
  ssr: true, // Because it is Nextjs's App router, you need to declare ssr as true
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}