"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { evmAddressAtom, polkadotAddressAtom } from "@/components/wallet-management";
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
  const router = useRouter();
  const evmAddress = useAtomValue(evmAddressAtom);
  const polkadotAddress = useAtomValue(polkadotAddressAtom);
  const [balances, setBalances] = useState<BalanceObject[]>([]);
  const [dedotClients, setDedotClients] = useState<DedotClient<PolkadotApi>[]>([]);
  const [unsubFunctions, setUnsubFunctions] = useState<(() => void)[]>([]);

  // loop through the available networks and fetch the balance of the native token
  useEffect(() => {
    // Clear existing balances when addresses change
    setBalances([]);
    
    // If no addresses, set all balances to 0
    if (!evmAddress || !polkadotAddress) {
      const zeroBalances = ALL_SUPPORTED_ASSETS_V2.map(asset => ({
        asset,
        balance: "0"
      }));
      setBalances(zeroBalances);
      return;
    }

    // Keep track of mounted state
    let isMounted = true;

    // Handle EVM assets
    const fetchEvmBalances = async () => {
      const evmAssets = ALL_SUPPORTED_ASSETS_V2.filter(
        asset => asset.split("/")[0].split(":")[0] === "eip155"
      );

      const evmBalancePromises = evmAssets.map(async (asset) => {
        const publicClient = createPublicClient({
          chain: selectViemObjectFromChainId(asset.split("/")[0] as string),
          transport: http(),
        });

        const tokenAddress = asset.split("/")[1].split(":")[1];
        const isNative = tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

        try {
          if (isNative) {
            const balance = await publicClient.getBalance({
              address: evmAddress as Address,
            });
            return {
              asset,
              balance: formatEther(balance)
            };
          } else {
            const balance = await publicClient.readContract({
              address: tokenAddress as Address,
              abi: erc20Abi,
              functionName: "balanceOf",
              args: [evmAddress],
            });
            return {
              asset,
              balance: formatUnits(
                balance as bigint,
                Number(asset.split("/")[1].split(":")[5])
              )
            };
          }
        } catch (error) {
          console.error(`Error fetching balance for ${asset}:`, error);
          return {
            asset,
            balance: "0"
          };
        }
      });

      const results = await Promise.all(evmBalancePromises);
      if (isMounted) {
        setBalances(prev => [...prev, ...results]);
      }
    };

    // Handle Polkadot assets
    const fetchPolkadotBalances = async () => {
      const polkadotAssets = ALL_SUPPORTED_ASSETS_V2.filter(
        asset => asset.split("/")[0].split(":")[0] === "polkadot"
      );

      const newClients: DedotClient<PolkadotApi>[] = [];
      const newUnsubFunctions: (() => void)[] = [];

      for (const asset of polkadotAssets) {
        const provider = new WsProvider(selectPolkadotRpcFromChainId(asset.split("/")[0]));
        
        try {
          const polkadotClient = await DedotClient.new<PolkadotApi>({ 
            provider, 
            cacheMetadata: true 
          });
          newClients.push(polkadotClient);

          const unsub = await polkadotClient.query.system.account(
            polkadotAddress, 
            (balance) => {
              if (isMounted) {
                const freeBalance: bigint = balance.data.free;
                setBalances(prev => [
                  ...prev.filter(b => b.asset !== asset),
                  {
                    asset,
                    balance: formatUnits(
                      freeBalance, 
                      Number(asset.split("/")[1].split(":")[5])
                    )
                  }
                ]);
              }
            }
          );
          newUnsubFunctions.push(unsub);
        } catch (error) {
          console.error(`Error setting up Polkadot client for ${asset}:`, error);
          if (isMounted) {
            setBalances(prev => [...prev, { asset, balance: "0" }]);
          }
        }
      }

      if (isMounted) {
        setDedotClients(prev => [...prev, ...newClients]);
        setUnsubFunctions(prev => [...prev, ...newUnsubFunctions]);
      }
    };

    // Fetch all balances
    fetchEvmBalances();
    fetchPolkadotBalances();

    // Cleanup function
    return () => {
      isMounted = false;
      unsubFunctions.forEach(unsub => unsub());
      dedotClients.forEach(client => client.disconnect());
      setDedotClients([]);
      setUnsubFunctions([]);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDisconnectAndGoBack() {
    unsubFunctions.forEach(unsub => unsub());
    dedotClients.forEach(client => client.disconnect());
    setDedotClients([]);
    setUnsubFunctions([]);
    router.push("/");
  }

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Portfolio
      </h1>
      {/* <BackButton route="/" /> */}
      <Button variant="outline" className="w-fit" onClick={handleDisconnectAndGoBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Go back
      </Button>
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
