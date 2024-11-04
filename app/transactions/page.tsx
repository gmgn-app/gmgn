"use client";

import BackButton from "@/components/back-button";
import Header from "@/components/header";
import { useAtomValue } from 'jotai'
import { availableNetworksAtom, evmAddressAtom, polkadotAddressAtom } from "@/components/wallet-management";
import { selectBlockExplorerFromChainId, truncateAddress } from "@/lib/utils";
import { ExternalLink } from 'lucide-react';

export default function TransactionsPage() {
  const availableNetworks = useAtomValue(availableNetworksAtom)
  const evmAddress = useAtomValue(evmAddressAtom)
  const polkadotAddress = useAtomValue(polkadotAddressAtom)

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Transactions
      </h1>
      <BackButton route="/" />
      <div className="flex flex-col gap-2">
        {
          availableNetworks ? (
            availableNetworks.map((network) => {
              return (
                <a href={`${selectBlockExplorerFromChainId(network as string)}/address/${evmAddress}`} target="_blank">
                  <div key={network} className="flex flex-col gap-2 w-full border-2 border-primary p-2">
                    <div className="flex flex-row justify-between items-center">
                      <h2>{network}</h2>
                      <ExternalLink className="w-6 h-6" />
                    </div>
                    
                    <p className="text-muted-foreground text-sm">
                      {truncateAddress(evmAddress, 10)}
                    </p>
                  </div>
                </a>
              )
            })
          ) : null
        }
      </div>

    </div>
  );
}
