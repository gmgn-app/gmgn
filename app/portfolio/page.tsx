"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import BackButton from "@/components/back-button";
import {
  createPublicClient,
  http,
  Address,
  formatEther,
  formatUnits,
} from "viem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAtomValue } from 'jotai'
import { availableNetworksAtom, evmAddressAtom, polkadotAddressAtom } from "@/components/wallet-management";
import { Skeleton } from "@/components/ui/skeleton";
import { selectViemObjectFromChainId, formatBalance, selectNativeAssetInfoFromChainId, selectNativeAssetLogoFromChainId } from "@/lib/utils";
import { mockStablecoinAbi } from "@/lib/abis";
import Header from "@/components/header";

type NativeBalanceObject = {
  network: string;
  id: string;
  balance: string;
}

export default function PortfolioPage() {
  const availableNetworks = useAtomValue(availableNetworksAtom);
  const evmAddress = useAtomValue(evmAddressAtom);
  const polkadotAddress = useAtomValue(polkadotAddressAtom);
  const [nativeBalances, setNativeBalances] = useState<NativeBalanceObject[]>([]);

  // loop through the available networks and fetch the balance of the native token
  useEffect(() => {
    if (evmAddress) {
      if (availableNetworks) {
        availableNetworks.map((network) => {
          let nativeBalanceObject: NativeBalanceObject = {
            network: "",
            id: "",
            balance: "",
          };
          const publicClient = createPublicClient({
            chain: selectViemObjectFromChainId(network as string),
            transport: http(),
          });
          nativeBalanceObject["network"] = network;
          nativeBalanceObject["id"] = network;
          const fetchNativeTokenBalance = async () => {
            const balance = await publicClient.getBalance({
              address: evmAddress as Address,
            });
            nativeBalanceObject["balance"] = formatEther(balance).toString();
            // add the nativeBalanceObject into the nativeBalances array
            setNativeBalances((nativeBalances) => [...nativeBalances, nativeBalanceObject]);
          };
          fetchNativeTokenBalance();
        });
      }
    }
  }, [evmAddress, availableNetworks]);


  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Portfolio
      </h1>
      <BackButton route="/" />
      <Tabs defaultValue="crypto" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
        </TabsList>
        <TabsContent value="crypto">
          <div  className="flex flex-col gap-2 mt-4">
            {
              availableNetworks ? (
                availableNetworks.map((network: string) => {
                  return (
                    <div key={network} className="flex flex-row items-start justify-between">
                      <div className="flex flex-row gap-2 items-center">
                        <Image
                          src={selectNativeAssetLogoFromChainId(network) || "/default-logo.png"}
                          alt="logo"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex flex-col">
                          <h3 className="font-semibold">{selectNativeAssetInfoFromChainId(network).split(":")[2]}</h3>
                          <div className="text-sm bg-muted p-1 rounded-md">{selectNativeAssetInfoFromChainId(network).split(":")[0]}</div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <Suspense fallback={<Skeleton className="w-16 h-4" />}>
                          <div className="text-right">
                            {
                              // find the balance of the network in nativeBalances
                              nativeBalances.find((nativeBalance) => nativeBalance.id === network) ? (
                                formatBalance(nativeBalances.find((nativeBalance) => nativeBalance.id === network)!.balance, 6)
                              ) : (
                                <Skeleton className="w-16 h-4" />
                              )
                            }
                          </div>
                        </Suspense>
                        <p className="text-muted-foreground text-right">$0.00</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <Skeleton className="w-full h-4" />
              )
            }
          </div>
        </TabsContent>
        <TabsContent value="nfts">
          <div className="flex flex-col gap-2 mt-4">We are building this now 😁</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
