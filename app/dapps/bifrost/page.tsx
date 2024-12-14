"use client";

import { useMemo, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import BackButton from "@/components/back-button";
import NavBar from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { getOrThrow } from "@/lib/passkey-auth";
import {
  createPublicClient,
  http,
  Address,
  formatEther,
  fromBytes,
  createWalletClient,
  parseEther,
  toHex,
  isAddress,
  formatUnits,
  parseUnits,
  encodePacked
} from "viem";
import { mnemonicToAccount } from 'viem/accounts';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatBalance,
  truncateHash,
  truncateAddress,
  selectViemObjectFromChainId,
  selectAssetInfoFromAssetId,
  selectBlockExplorerFromChainId
} from "@/lib/utils";
import { Info, Plus, Trash2, Loader2, CornerDownRight, ArrowRight, RotateCcw, Check, ClipboardPaste } from "lucide-react";
import { mockStablecoinAbi } from "@/lib/abis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAtom, useAtomValue } from 'jotai';
import { evmAddressAtom, polkadotAddressAtom } from "@/components/wallet-management";
import { ALL_SUPPORTED_ASSETS } from "@/lib/assets";
import { MULTISEND_CONTRACTS } from "@/lib/contracts";
import { erc20Abi } from "@/lib/abis";
import { mantaSLPxAbi } from "./abis";
import { useMediaQuery } from "@/hooks/use-media-query";


type AirdropItem = {
  address: string;
  amount: string;
};

enum LoadingState {
  Loading,
  Idle
}

export default function BifrostApp() {
  // Get the search params from the URL.
  // const searchParams = useSearchParams();
  // Get the address and network from the search params.
  // const address = searchParams.get("address");
  // const network = searchParams.get("network");

  const evmAddress = useAtomValue(evmAddressAtom)
  const polkadotAddress = useAtomValue(polkadotAddressAtom)
  // const evmAddress = "0x44079d2d27BC71d4D0c2a7C473d43085B390D36f";
  // const polkadotAddress = "5H1ctU6bPpkBioPxbiPqkCFFg8EN35QwZAQGevpzR5BSRa1S";
  const [address, setAddress] = useState<string>(evmAddress!);
  const [token, setToken] = useState<string>("eip155:169/slip44:0x95CeF13441Be50d20cA4558CC0a27B601aC544E5");
  const nativeToken = "eip155:169/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  const network = token.split("/")[0];
  const tokenAddress = token.split("/")[1].split(":")[1];
  
  // check each element in the ALL_SUPPORTED_ASSETS array with MULTISEND_CONTRACTS array
  // return the element that has the same eip155:chainId 
  // for example, if the asset is "eip155:1001/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
  // and the MULTISEND_CONTRACTS array has "eip155:1001/contract:0x61684fc62b6a0f1273f69d9fca0e264001a61db6"
  // then the function will return all elements that match the "eip155:1001"
  const BIFROST_LST_SUPPORTED_ASSETS = [
    "eip155:169/slip44:0x95CeF13441Be50d20cA4558CC0a27B601aC544E5",
  ]
  const BIFROST_MANTASLPX_CONTRACT = "0x95A4D4b345c551A9182289F9dD7A018b7Fd0f940";


  // Check if the user is on a desktop or mobile device.
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // State for current balance
  const [currentBalance, setCurrentBalance] = useState("");
  const [currentNativeBalance, setCurrentNativeBalance] = useState("");
  const [currentTokenDecimals, setCurrentTokenDecimals] = useState<number>(18);

  // Main state for the mint form
  const [mintingAmount, setMintingAmount] = useState("");
  
  // state for current MULTISEND_CONTRACT
  const [multisendContractAddress, setMultisendContractAddress] = useState<string>("eip155:1001/contract:0x61684fc62b6a0f1273f69d9fca0e264001a61db6");

  // state for sending status
  const [mintButtonLoading, setMintButtonLoading] = useState(false);

  // Toast notifications.
  const { toast } = useToast();

  // Fetch the current balance upon page load
  useEffect(() => {
    if (
      evmAddress &&
      network.split(":")[0] === "eip155" &&
      tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      const publicClient = createPublicClient({
        chain: selectViemObjectFromChainId(network as string),
        transport: http(),
      });
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: evmAddress as Address,
        });
        setCurrentBalance(formatEther(balance).toString());
        setCurrentNativeBalance(formatEther(balance).toString());
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }
    if (
      evmAddress &&
      network.split(":")[0] === "eip155" &&
      tokenAddress !== "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      const publicClient = createPublicClient({
        chain: selectViemObjectFromChainId(network as string),
        transport: http(),
      });
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: evmAddress as Address,
        });
        const tokenBalance = await publicClient.readContract({
          address: tokenAddress as Address,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [evmAddress as Address],
        });
        const tokenDecimals = await publicClient.readContract({
          address: tokenAddress as Address,
          abi: erc20Abi,
          functionName: "decimals",
        });
        setCurrentBalance(formatUnits(tokenBalance as bigint, tokenDecimals as number).toString());
        setCurrentNativeBalance(formatEther(balance as bigint).toString());
        setCurrentTokenDecimals(tokenDecimals as number);
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }

  }, [evmAddress, network, token, tokenAddress]);

  // public client for balance refresh
  const publicClient = createPublicClient({
    chain: selectViemObjectFromChainId(network!),
    transport: http(),
  });

  async function getMinMintAmount() {
    const minMintAmount = await publicClient.readContract({
      address: BIFROST_MANTASLPX_CONTRACT,
      abi: mantaSLPxAbi,
      functionName: "minAmount",
    });
    console.log("minMintAmount", minMintAmount);
  }

  // Function to fetch balance
  async function fetchBalances() {
    if (
      evmAddress &&
      network.split(":")[0] === "eip155" &&
      tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: evmAddress as Address,
        });
        setCurrentBalance(formatEther(balance).toString());
        setCurrentNativeBalance(formatEther(balance).toString());
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }
    if (
      evmAddress &&
      network.split(":")[0] === "eip155" &&
      tokenAddress !== "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: evmAddress as Address,
        });
        const tokenBalance = await publicClient.readContract({
          address: tokenAddress as Address,
          abi: mockStablecoinAbi,
          functionName: "balanceOf",
          args: [evmAddress as Address],
        });
        setCurrentBalance(formatUnits(tokenBalance as bigint, 6).toString());
        setCurrentNativeBalance(formatEther(balance as bigint).toString());
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }
  }


  function handleInputTokenChange(value: string) {
    setToken(value);
    setMultisendContractAddress(MULTISEND_CONTRACTS.find((contract) => contract.split("/")[0] === value.split("/")[0])!);
    setCurrentBalance("");
    setCurrentNativeBalance("");
  }

  // function to mint transaction
  async function submitMintOrder() {
      // Set the send button to loading state
      setMintButtonLoading(true);

    /**
     * Retrieve the handle to the private key from some unauthenticated storage
     */
    const cache = await caches.open("gmgn-storage");
    const request = new Request("/gmgn-wallet");
    const response = await cache.match(request);
    const handle = response
      ? new Uint8Array(await response.arrayBuffer())
      : new Uint8Array();
    /**
     * Retrieve the private key from authenticated storage
     */
    const bytes = await getOrThrow(handle);
    const mnemonicPhrase = bip39.entropyToMnemonic(bytes, wordlist);
    if (mnemonicPhrase) {
      // create an EVM account from the mnemonic phrase
      const account = mnemonicToAccount(mnemonicPhrase,
        {
          accountIndex: 0,
          addressIndex: 0,
        }
      );
      // create a wallet client
      const walletClient = createWalletClient({
        account: account,
        chain: selectViemObjectFromChainId(network!),
        transport: http(),
      });
      // create a public client
      const publicClient = createPublicClient({
        chain: selectViemObjectFromChainId(network!),
        transport: http(),
      });
      let transaction = null;
      let hash = null;
      const sendAndCallFee = await publicClient.readContract({
        address: BIFROST_MANTASLPX_CONTRACT,
        abi: mantaSLPxAbi,
        functionName: "estimateSendAndCallFee",
        args: [
          tokenAddress as Address,
          parseUnits(mintingAmount, 18),
          0,
          4000000,
          encodePacked(["uint16", "uint256"], [1, BigInt(4200000)]),
        ],
      });
      console.log("sendAndCallFee", sendAndCallFee);

      const { request: approvalRequest } = await publicClient.simulateContract({
        account: account,
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "approve",
        args: [
          BIFROST_MANTASLPX_CONTRACT as Address,
          parseUnits(mintingAmount, 18),
        ],
      });
      let approvalHash = await walletClient.writeContract(approvalRequest);
      let approvalTransaction = await publicClient.waitForTransactionReceipt({
        hash: approvalHash,
      });
      console.log("approvalHash", approvalHash);

      if (approvalTransaction) {
        const { request } = await publicClient.simulateContract({
          account: account,
          address: BIFROST_MANTASLPX_CONTRACT,
          abi: mantaSLPxAbi,
          functionName: "create_order",
          args: [
            tokenAddress, // MANTA token address
            parseUnits(mintingAmount, 18), // amount
            0, // channel_id
            4000000, // dstGasForCall
            encodePacked(["uint16", "uint256"], [1, BigInt(4200000)]), // adapterParams
          ],
          value: sendAndCallFee as bigint,
        });

        hash = await walletClient.writeContract(request);
        transaction = await publicClient.waitForTransactionReceipt({
          hash: hash,
        });
        console.log("hash", hash);
      }
      if (transaction) {
        toast({
          className:
            "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
          title: "Transaction sent!",
          description: "Hash: " + truncateHash(hash ?? undefined, 6),
          action: (
            <ToastAction altText="view">
              <a
                target="_blank"
                href={`${selectBlockExplorerFromChainId(network!)}/tx/${hash}`}
              >
                View
              </a>
            </ToastAction>
          ),
        });
        fetchBalances();
      }
    } else {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Wallet load failed!",
        description: "Uh oh! Something went wrong. please try again.",
      });
    }
    setMintButtonLoading(false);
  }

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Bifrost LST
      </h1>
      <BackButton route="/dapps" />
      <NavBar />
        <div className="flex flex-col mt-4 gap-2">
          <Label htmlFor="sendingToken">Token to interact</Label>
          <Select
            value={token!}
            onValueChange={handleInputTokenChange}
          >
            <SelectTrigger className="w-full border-2 border-primary h-[56px]">
              <SelectValue placeholder="Select a token" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select a token</SelectLabel>
                {
                    BIFROST_LST_SUPPORTED_ASSETS.map((asset) => (
                    <SelectItem key={asset} value={asset}>
                      <div className="flex flex-row gap-2 items-center">
                        <Image
                          src={selectAssetInfoFromAssetId(asset!).split(":")[3] || "/default-logo.png"}
                          alt={asset}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <div className="text-lg">{selectAssetInfoFromAssetId(asset!).split(":")[2]}</div>
                        <Badge variant="secondary">{selectAssetInfoFromAssetId(asset!).split(":")[0]}</Badge>
                      </div>
                    </SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col mb-2">
          <h2 className="text-lg">Balance</h2>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-1 items-end text-2xl font-semibold">
              {currentBalance ? formatBalance(currentBalance, 4) : <Skeleton className="w-8 h-6" />}
              <p className="text-lg">
                {selectAssetInfoFromAssetId(token).split(":")[2]}
              </p>
            </div>
            <Button onClick={fetchBalances} size="icon">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-row gap-1 items-end text-sm text-muted-foreground">
            {currentNativeBalance
              ? formatBalance(currentNativeBalance, 4)
              : <Skeleton className="w-4 h-4" />}
            <p className="text-sm text-muted-foreground">
              {selectAssetInfoFromAssetId(nativeToken).split(":")[2]}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="border-b pb-2 text-lg font-semibold">Mint</h2>
          <div className="flex flex-row gap-2 items-center">
            <CornerDownRight className="h-4 w-4" />
            <p>Convert to liquid staking version</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sendingAmount">Minting amount</Label>
            {isDesktop ? (
              <Input
                id="mintingAmount"
                className="rounded-none w-full border-primary border-2 p-2.5 mt-2 text-lg"
                type="number"
                placeholder="0"
                value={mintingAmount}
                onChange={(e) => setMintingAmount(e.target.value)}
                required
              />
            ) : (
              <Input
                id="mintingAmount"
                className="rounded-none w-full border-primary border-2 p-2.5 mt-2 text-lg"
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                placeholder="0"
                value={mintingAmount}
                onChange={(e) => setMintingAmount(e.target.value)}
                required
              />
            )}
            <p className="text-sm text-muted-foreground">
              Fill in the amount that you want to send
            </p>
            <Button 
              onClick={getMinMintAmount}
            >
              Min
            </Button>
          </div>
        </div>
        {mintButtonLoading ? (
          <Button className="w-full md:w-[400px]" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button className="w-full md:w-[400px]" onClick={submitMintOrder}>
            Mint
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
    </div>
  );
}