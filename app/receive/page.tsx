"use client";


import Image from "next/image";
import Link from "next/link";
import QRCode from "react-qr-code";
import { truncateAddress } from "@/lib/utils";
import WalletCopyButton from "@/components/wallet-copy-button";
import { Address } from "viem";
import BackButton from "@/components/back-button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAtom, useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils'
import { availableNetworksAtom, evmAddressAtom, polkadotAddressAtom } from "@/components/wallet-management";
import { selectChainNameFromChainId, selectNativeAssetLogoFromChainId } from "@/lib/utils";

// Atom to store the last selected network
const lastSelectedNetworkAtom = atomWithStorage('lastSelectedNetwork', "eip155:11155111")

export default function ReceivePage() {
  // Get the available networks, last selected network, and addresses from the wallet management atoms
  const availableNetworks = useAtomValue(availableNetworksAtom)

  // Get the last selected network and set the last selected network
  const [lastSelectedNetwork, setLastSelectedNetwork] = useAtom<string>(lastSelectedNetworkAtom)
  
  // Get the addresses from the wallet management atoms
  const evmAddress = useAtomValue(evmAddressAtom)
  const polkadotAddress = useAtomValue(polkadotAddressAtom)

  // Function to handle the network change
  function handleInputNetworkChange(value: string) {
    setLastSelectedNetwork(value)
  }

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

  function selectDescriptionFromChainId(chainId: string) {
    const chainType = chainId.split(":")[0]
    const chainIdNumber = chainId.split(":")[1]

    switch (chainType) {
      case "eip155":
        return "You can receive tokens & NFTs on EVM compatible networks"
      case "polkadot":
        return "You can receive tokens & NFTs on Polkadot compatible networks"
      default:
        return "n/a"
    }
  }

  function selectChainTypeFromChainId(chainId: string) {
    const chainType = chainId.split(":")[0]

    switch (chainType) {
      case "eip155":
        return "EVM"
      case "polkadot":
        return "Polkadot"
      default:
        return "n/a"
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Receive
      </h1>
      <BackButton route="/" />
      <Tabs defaultValue="receive" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="receive">
            Receive
          </TabsTrigger>
          <TabsTrigger asChild value="request">
            <Link href="/request">
              Request
            </Link>
            </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Network</h2>
        <p className="text-muted-foreground">Select a network to get its address</p>
        <Select
          value={lastSelectedNetwork!}
          onValueChange={handleInputNetworkChange}
          defaultValue="eip155:11155111"
        >
          <SelectTrigger className="w-full md:w-[400px] h-[56px]">
            <SelectValue placeholder="Select a network" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select a network</SelectLabel>
              {availableNetworks!.sort().map((network) => (
                <SelectItem key={network} value={network}>
                  <div className="flex flex-row gap-2 items-center">
                    <Image
                      src={selectNativeAssetLogoFromChainId(network) || "/default-logo.png"}
                      alt={network}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <div className="text-lg">{selectChainNameFromChainId(network)}</div>
                    <Badge variant="secondary">{selectChainTypeFromChainId(network)}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col items-center">
        <QRCode
          className="mt-4"
          size={256}
          value={selectAddressFromChainId(lastSelectedNetwork)}
          viewBox={`0 0 256 256`}
        />
      </div>
      <div className="flex flex-col gap-4 items-center">
        <WalletCopyButton
          copyText={
            evmAddress ? evmAddress : "n/a"
          }
          buttonTitle={truncateAddress(selectAddressFromChainId(lastSelectedNetwork) as Address, 6)}
        />
      </div>
      <div className="flex flex-col gap-4 items-center text-center text-sm">
        <p className="w-[300px]">
          {selectDescriptionFromChainId(lastSelectedNetwork)}
        </p>
        <Link className="text-blue-500" href="/learn">
          Learn more
        </Link>
      </div>
    </div>
  );
}
