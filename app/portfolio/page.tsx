"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import BackButton from "@/components/back-button";
// evm
import {
  createPublicClient,
  http,
  Address,
  formatEther,
  formatUnits,
} from "viem";
// polkadot
import { DedotClient, WsProvider } from 'dedot';
import type { PolkadotApi, PaseoApi } from '@dedot/chaintypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAtomValue } from 'jotai'
import { availableNetworksAtom, evmAddressAtom, polkadotAddressAtom } from "@/components/wallet-management";
import { Skeleton } from "@/components/ui/skeleton";
import { selectViemObjectFromChainId, selectPolkadotRpcFromChainId, formatBalance } from "@/lib/utils";
import { erc20Abi } from "@/lib/abis";
import { ALL_SUPPORTED_ASSETS_V2 } from "@/lib/assets";
import Header from "@/components/header";

type BalanceObject = {
  asset: string;
  balance: string;
}

export default function PortfolioPage() {
  const availableNetworks = useAtomValue(availableNetworksAtom);
  const evmAddress = useAtomValue(evmAddressAtom);
  const polkadotAddress = useAtomValue(polkadotAddressAtom);
  const [balances, setBalances] = useState<BalanceObject[]>([]);

  // loop through the available networks and fetch the balance of the native token
  useEffect(() => {
    if (evmAddress && polkadotAddress) {
      if (ALL_SUPPORTED_ASSETS_V2) {
        ALL_SUPPORTED_ASSETS_V2.map((asset) => {
          let balanceObject: BalanceObject = {
            asset: "",
            balance: "",
          };
          
          // Handle all EVM assets
          if (asset.split("/")[0].split(":")[0] === "eip155") {
            const publicClient = createPublicClient({
              chain: selectViemObjectFromChainId(asset.split("/")[0] as string),
              transport: http(),
            });
            balanceObject["asset"] = asset;
            const fetchNativeTokenBalance = async () => {
              const balance = await publicClient.getBalance({
                address: evmAddress as Address,
              });
              balanceObject["balance"] = formatEther(balance);
              // add the nativeBalanceObject into the nativeBalances array
              setBalances((balances) => [...balances, balanceObject]);
            };
            const fetchERC20TokenBalance = async () => {
              const balance = await publicClient.readContract({
                address: asset.split("/")[1].split(":")[1] as Address,
                abi: erc20Abi,
                functionName: "balanceOf",
                args: [evmAddress],
              });
              balanceObject["balance"] = formatUnits(balance as bigint, Number(asset.split("/")[1].split(":")[5]));
              // add the nativeBalanceObject into the nativeBalances array
              setBalances((balances) => [...balances, balanceObject]);
            }
            if (asset.split("/")[1].split(":")[1] === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
              fetchNativeTokenBalance();
            }
            if (asset.split("/")[1].split(":")[1] !== "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
              fetchERC20TokenBalance();
            }
          }

          // Handle Polkadot assets
          if (asset.split("/")[0].split(":")[0] === "polkadot") {
            // Initialize providers & clients
            const provider = new WsProvider(selectPolkadotRpcFromChainId(asset.split("/")[0]));

            const fetchParachainNativeBalance = async () => {
              // initialize the dedot polkadot client
              const polkadotClient = await DedotClient.new<PolkadotApi>({ provider, cacheMetadata: true });
              const balance = await polkadotClient.query.system.account(polkadotAddress);
              const freeBalance: bigint = balance.data.free;
              balanceObject["asset"] = asset;
              balanceObject["balance"] = formatUnits(freeBalance, Number(asset.split("/")[1].split(":")[5]));
              // add the nativeBalanceObject into the nativeBalances array
              setBalances((balances) => [...balances, balanceObject]);
            }
            fetchParachainNativeBalance();
          }
        });
      }
    } else {
      ALL_SUPPORTED_ASSETS_V2.map((asset) => {
        let balanceObject: BalanceObject = {
          asset: "",
          balance: "",
        };
        balanceObject["asset"] = asset;
        balanceObject["balance"] = "0";
        // add the nativeBalanceObject into the nativeBalances array
        setBalances((balances) => [...balances, balanceObject]);
      });
    }
  }, [evmAddress, polkadotAddress]);


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
              ALL_SUPPORTED_ASSETS_V2 ? (
                ALL_SUPPORTED_ASSETS_V2.map((asset: string) => {
                  return (
                    <div key={asset} className="flex flex-row items-start justify-between">
                      <div className="flex flex-row gap-2 items-center">
                        <Image
                          src={`/logos/${asset.split("/")[2].split(":")[0]}` || "/default-logo.png"}
                          alt="logo"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex flex-col">
                          <div className="flex flex-row gap-2 items-center">   
                            <Image
                              src={`/logos/${asset.split("/")[2].split(":")[1]}` || "/default-logo.png"}
                              alt="logo"
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                            <h3 className="font-semibold">{asset.split("/")[1].split(":")[4]}</h3>
                            <div className="text-sm bg-muted p-1 rounded-md">{asset.split("/")[1].split(":")[2]}</div>
                          </div>
                          <div className="text-sm">$0.00</div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <Suspense fallback={<Skeleton className="w-16 h-4" />}>
                          <div className="text-right">
                            {
                              // find the balance of the network in nativeBalances
                              balances.find((balance) => balance.asset === asset) ? (
                                formatBalance(balances.find((balance) => balance.asset === asset)!.balance, 6)
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
