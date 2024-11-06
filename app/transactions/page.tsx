"use client";

import BackButton from "@/components/back-button";
import Header from "@/components/header";
import Image from "next/image";
import { useAtomValue } from 'jotai'
import { availableNetworksAtom, evmAddressAtom, polkadotAddressAtom } from "@/components/wallet-management";
import { selectBlockExplorerFromChainId, truncateAddress } from "@/lib/utils";
import { ExternalLink } from 'lucide-react';
import { selectChainNameFromChainId, selectNativeAssetLogoFromChainId } from "@/lib/utils";


export default function TransactionsPage() {
  /*
  * State management with Jotai
  */
  const availableNetworks = useAtomValue(availableNetworksAtom)
  const evmAddress = useAtomValue(evmAddressAtom)
  const polkadotAddress = useAtomValue(polkadotAddressAtom)


  // Function to select the address based on the chainId
  function selectAddressFromChainId(chainId: string) {
    const chainType = chainId.split(":")[0]
    const chainIdNumber = chainId.split(":")[1]

    switch (chainType) {
      case "eip155":
        return evmAddress || "n/a"
      case "polkadot":
        return polkadotAddress || "n/a"
      default:
        return "n/a"
    }
  }

  // Function to change the explorer URL based on the chainId
  function selectBlockExplorerFormatFromChainId(chainId: string) {
    const chainType = chainId.split(":")[0]
    const chainIdNumber = chainId.split(":")[1]

    switch (chainType) {
      case "eip155":
        return `address/${evmAddress}`
      case "polkadot":
        return `account/${polkadotAddress}`
      default:
        return "n/a"
    }
  }
  
  /*
  * Render component
  */
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
            availableNetworks.sort().map((network) => {
              return (
                <a key={network} href={`${selectBlockExplorerFromChainId(network)}/${selectBlockExplorerFormatFromChainId(network)}`} target="_blank">
                  <div className="flex flex-col gap-2 w-full border-2 border-primary p-2">
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex flex-row gap-2 items-center">
                        <Image
                          src={selectNativeAssetLogoFromChainId(network) || "/default-logo.png"}
                          alt="logo"
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <h2>{selectChainNameFromChainId(network)}</h2>
                      </div>
                      <ExternalLink className="w-6 h-6" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {truncateAddress(selectAddressFromChainId(network), 10)}
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
