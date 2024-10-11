"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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

import { Skeleton } from "@/components/ui/skeleton";
import { selectViemChainFromNetwork } from "@/lib/utils";
import { mockStablecoinAbi } from "@/lib/abis";
import Header from "@/components/header";

export default function PortfolioPage() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const network = searchParams.get("network");
  const [currentBalance, setCurrentBalance] = useState<string | null>(null);
  const [stablecoinBalances, setStablecoinBalances] = useState<string[] | null>(
    null
  );

  // Fetch the current balance upon page load
  useEffect(() => {
    if (address) {
      const publicClient = createPublicClient({
        chain: selectViemChainFromNetwork(network as string),
        transport: http(),
      });
      const fetchNativeTokenBalance = async () => {
        const balance = await publicClient.getBalance({
          address: address as Address,
        });
        setCurrentBalance(formatEther(balance).toString());
      };

      const fetchStablecoinBalances = async () => {
        const stablecoinContracts = [
          {
            id: 1,
            name: "tUSDC",
            address: "0x8cfA6aC9c5ae72faec3A0aEefEd1bFB12c8cC746",
            abi: mockStablecoinAbi,
          },
          {
            id: 2,
            name: "tUSDT",
            address: "0x0076e4cE0E5428d7fc05eBaFbd644Ee74BDE624d",
            abi: mockStablecoinAbi,
          },
        ] as const;
        const stablecoinBalances = await publicClient.multicall({
          contracts: [
            {
              abi: stablecoinContracts[0].abi,
              address: stablecoinContracts[0].address,
              functionName: "balanceOf",
              args: [address as Address],
            },
            {
              abi: stablecoinContracts[1].abi,
              address: stablecoinContracts[1].address,
              functionName: "balanceOf",
              args: [address as Address],
            },
          ],
        });
        const fetchedStablecoinBalances: string[] = [];
        stablecoinBalances.map((response) => {
          if (response?.status === "failure") {
            console.error(
              "Failed to fetch stablecoin balances",
              response.error
            );
          } else if (response?.status === "success") {
            return fetchedStablecoinBalances.push(
              formatUnits(response?.result as bigint, 6).toString()
            );
          }
        });
        setStablecoinBalances(fetchedStablecoinBalances);
      };
      // fetch the balances with promise all
      Promise.all([fetchNativeTokenBalance(), fetchStablecoinBalances()]);
    }
  }, [address, network]);

  // public client for balance refresh
  const publicClient = createPublicClient({
    chain: selectViemChainFromNetwork(network!),
    transport: http(),
  });

  // Function to fetch balances
  async function fetchBalances() {
    const balance = await publicClient.getBalance({
      address: address as Address,
    });
    setCurrentBalance(formatEther(balance).toString());
    const stablecoinContracts = [
      {
        id: 1,
        name: "tUSDC",
        address: "0x8cfA6aC9c5ae72faec3A0aEefEd1bFB12c8cC746",
        abi: mockStablecoinAbi,
      },
      {
        id: 2,
        name: "tUSDT",
        address: "0x0076e4cE0E5428d7fc05eBaFbd644Ee74BDE624d",
        abi: mockStablecoinAbi,
      },
    ] as const;
    const stablecoinBalances = await publicClient.multicall({
      contracts: [
        {
          abi: stablecoinContracts[0].abi,
          address: stablecoinContracts[0].address,
          functionName: "balanceOf",
          args: [address as Address],
        },
        {
          abi: stablecoinContracts[1].abi,
          address: stablecoinContracts[1].address,
          functionName: "balanceOf",
          args: [address as Address],
        },
      ],
    });
    setStablecoinBalances(
      stablecoinBalances.map((response) =>
        formatUnits(response?.result as bigint, 6).toString()
      )
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Portfolio
      </h1>
      <BackButton route={`/?network=${network}&address=${address}`} />
      <Tabs defaultValue="crypto" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
        </TabsList>
        <TabsContent value="crypto">
          {network === "kaia-kairos" && address ? (
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row gap-2 items-center">
                  <Image
                    src="/kaia.png"
                    alt="kaia logo"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <h3 className="font-semibold">Kaia</h3>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  {currentBalance ? (
                    currentBalance
                  ) : (
                    <Skeleton className="w-16 h-4" />
                  )}
                  <span className="text-muted-foreground">KLAY</span>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row gap-2 items-center">
                  <Image
                    src="/usdc.svg"
                    alt="usdc logo"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <h3 className="font-semibold">Test USDC</h3>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  {stablecoinBalances ? (
                    stablecoinBalances[0]
                  ) : (
                    <Skeleton className="w-16 h-4" />
                  )}
                  <span className="text-muted-foreground">tUSDC</span>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row gap-2 items-center">
                  <Image
                    src="/usdt.svg"
                    alt="usdt logo"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <h3 className="font-semibold">Test USDT</h3>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  {stablecoinBalances ? (
                    stablecoinBalances[1]
                  ) : (
                    <Skeleton className="w-16 h-4" />
                  )}
                  <span className="text-muted-foreground">tUSDT</span>
                </div>
              </div>
            </div>
          ) : null}
        </TabsContent>
        <TabsContent value="nfts">
          <div className="flex flex-col gap-2 mt-4">We are building this now 😁</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
