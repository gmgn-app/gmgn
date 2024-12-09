"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  createPublicClient,
  http,
  Address,
  formatEther,
  fromBytes,
  createWalletClient,
  parseEther,
  toHex,
  fromHex,
  isAddress,
  formatUnits,
  parseUnits,
} from "viem";
import { mnemonicToAccount } from 'viem/accounts';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';
import { DedotClient, WsProvider } from 'dedot';
import type { PolkadotApi } from '@dedot/chaintypes';
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wallet, TxType } from "@kaiachain/ethers-ext";
import { getOrThrow } from "@/lib/passkey-auth";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  RotateCcw,
  Fuel,
  Loader2,
  Check,
  CircleX,
  Send,
  Ban,
  HandCoins,
  ClipboardPaste,
  ScanLine,
  ArrowRight,
  ThumbsUp,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatBalance,
  truncateHash,
  truncateAddress,
  selectJsonRpcProvider,
  selectViemObjectFromChainId,
  selectBlockExplorerFromChainId,
  selectAssetInfoFromAssetId
} from "@/lib/utils";
import { mockStablecoinAbi } from "@/lib/abis";
import { ALL_SUPPORTED_ASSETS } from "@/lib/assets";
import { availableNetworksAtom, evmAddressAtom, polkadotAddressAtom } from "@/components/wallet-management";
import { useAtom, useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils'



export default function PayForm() {

  // Get the search params from the URL.
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const sendingAmount = searchParams.get("sendingAmount");
  const receivingAddress = searchParams.get("receivingAddress");
  const transactionMemo = fromHex(searchParams.get("transactionMemo") as `0x${string}`, "string") || "";
  // params related state
  const network = token!.split("/")[0];
  const tokenAddress = token!.split("/")[1].split(":")[1];

  // get the addresses
  const evmAddress = useAtomValue(evmAddressAtom);
  const polkadotAddress = useAtomValue(polkadotAddressAtom);

  // state management
  const [currentBalance, setCurrentBalance] = useState("");
  const [currentNativeBalance, setCurrentNativeBalance] = useState("");
  const [transactionCost, setTransactionCost] = useState("");
  const [readyToTransfer, setReadyToTransfer] = useState(false);
  const [delegateFeeActive, setDelegateFeeActive] = useState(false);
  const [continueButtonLoading, setContinueButtonLoading] = useState(false);
  const [sendButtonLoading, setSendButtonLoading] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState<Boolean | undefined>(
    undefined
  );
  const [isValidAmount, setIsValidAmount] = useState<Boolean | undefined>(
    undefined
  );
  const [isValidTotal, setIsValidTotal] = useState<Boolean | undefined>(
    undefined
  );

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

    if (
      polkadotAddress &&
      network.split(":")[0] === "polkadot" &&
      tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    ) {
      // Construct the polkadot
      const wsProvider = new WsProvider('wss://paseo.rpc.amforc.com:443');

      const fetchBalance = async () => {
        // initialize the dedot polkadot client
        const polkadotClient = await DedotClient.new<PolkadotApi>(wsProvider);
        const balance = await polkadotClient.query.system.account(polkadotAddress);
        const freeBalance: bigint = balance.data.free;
        setCurrentBalance(formatUnits(freeBalance, 10));
        setCurrentNativeBalance(formatUnits(freeBalance, 10));
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }
  }, [evmAddress, polkadotAddress, network, token, tokenAddress]);

// public client for balance refresh
const publicClient = createPublicClient({
  chain: selectViemObjectFromChainId(network!),
  transport: http(),
});

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

  if (
    polkadotAddress &&
    network.split(":")[0] === "polkadot" &&
    tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
  ) {
    // Construct the polkadot
    const wsProvider = new WsProvider('wss://paseo.rpc.amforc.com:443');

    const fetchBalance = async () => {
      // initialize the dedot polkadot client
      const polkadotClient = await DedotClient.new<PolkadotApi>(wsProvider);
      const balance = await polkadotClient.query.system.account(polkadotAddress);
      const freeBalance: bigint = balance.data.free;
      setCurrentBalance(formatUnits(freeBalance, 10));
      setCurrentNativeBalance(formatUnits(freeBalance, 10));
    };
    // call the function
    fetchBalance()
      // make sure to catch any error
      .catch(console.error);
  }
}

  function handleDelegateFeeChange() {
    setDelegateFeeActive(!delegateFeeActive);
    setReadyToTransfer(true);
  }

// Function to prepare transaction before sending
async function prepareTransaction() {
  if (receivingAddress === "") {
    toast({
      className:
        "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
      variant: "destructive",
      title: "Uh oh! You did not enter a receiving address.",
      description: "Please enter a receiving address to continue.",
    });
    return;
  }
  if (receivingAddress) {
    if (network.split(":")[0] === "eip155") {
      const isValidAddress = isAddress(receivingAddress, { strict: false });
      if (isValidAddress) {
        setIsValidAddress(true);
      } else {
        setIsValidAddress(false);
      }
    }

    if (network.split(":")[0] === "polkadot") {
      const isValidAddress = true
      if (isValidAddress) {
        setIsValidAddress(true);
      } else {
        setIsValidAddress(false);
      }
    }
  }
  if (sendingAmount === "") {
    toast({
      className:
        "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
      variant: "destructive",
      title: "Uh oh! You did not enter an amount to send.",
      description: "Please enter an amount to send to continue.",
    });
    return;
  }

  // Check if the network is EVM
  // Handle EVM prepare transaction
  if (
    network.split(":")[0] === "eip155" &&
    sendingAmount
  ) {
    const isValidAmount =
      parseEther(currentBalance) >= parseEther(sendingAmount);
    if (isValidAmount) {
        setIsValidAmount(true);
        setContinueButtonLoading(true);
        const publicClient = createPublicClient({
          chain: selectViemObjectFromChainId(network!),
          transport: http(),
        });

        let gas: bigint = BigInt(0);
        if (
          tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        ) {
          gas = await publicClient.estimateGas({
            account: evmAddress as Address,
            to: receivingAddress as Address,
            value: parseEther(sendingAmount),
            data: toHex(transactionMemo),
          });
        }
        
        if (
          tokenAddress !== "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        ) {
          const tokenDecimals = await publicClient.readContract({
            address: tokenAddress as Address,
            abi: mockStablecoinAbi,
            functionName: "decimals",
          });
          gas = await publicClient.estimateContractGas({
            address: tokenAddress as Address,
            abi: mockStablecoinAbi,
            functionName: "transfer",
            account: evmAddress as Address,
            args: [receivingAddress as Address, parseUnits(sendingAmount, tokenDecimals as number)],
          });
        }
        const gasPrice = await publicClient.getGasPrice();
        const gasCost = gas * gasPrice;
        setTransactionCost(formatEther(gasCost));
        let isValidTotal;
        if (tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
          isValidTotal =
            parseEther(currentBalance) >= parseEther(sendingAmount) + gasCost;
        } else {
          isValidTotal =
            parseEther(currentBalance) >= parseEther(sendingAmount) &&
            parseEther(currentNativeBalance) >= gasCost;
        }
        if (isValidTotal) {
          setIsValidTotal(true);
          setReadyToTransfer(true);
        } else {
          setIsValidTotal(false);
          setReadyToTransfer(false);
          return;
        }
        setContinueButtonLoading(false);
      } else {
        setIsValidAmount(false);
        return;
      }
    }

    // Check if the network is Polkadot
    // Handle Polkadot prepare transaction
    if (
      network.split(":")[0] === "polkadot" &&
      sendingAmount
    ) {
      const isValidAmount = true;
      if (isValidAmount) {
        setIsValidAmount(true);
        setContinueButtonLoading(true);
        setTransactionCost("0");
        const isValidTotal = true;
        if (isValidTotal) {
          setIsValidTotal(true);
          setReadyToTransfer(true);
        } else {
          setIsValidTotal(false);
          setReadyToTransfer(false);
          return;
        }
        setContinueButtonLoading(false);
      } else {
        setIsValidAmount(false);
        return;
      }
    }
  }

  // Function to submit transaction
  async function submitTransaction() {
    // Set the send button to loading state
    setSendButtonLoading(true);

    /**
     * Retrieve the handle to the private key from some unauthenticated storage
     */
    const cache = await caches.open("gmgn-storage");
    const request = new Request("gmgn-wallet");
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

      // Handle EVM submit transaction
      // Check if the network is EVM
      if (
        network.split(":")[0] === "eip155"
      ) {
        const account = mnemonicToAccount(mnemonicPhrase,
          {
            accountIndex: 0,
            addressIndex: 0,
          }
        );
        const walletClient = createWalletClient({
          account: account,
          chain: selectViemObjectFromChainId(network!),
          transport: http(),
        });
        const publicClient = createPublicClient({
          chain: selectViemObjectFromChainId(network!),
          transport: http(),
        });
        let transaction = null;
        let hash = null;
        if (tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
          hash = await walletClient.sendTransaction({
            account,
            to: receivingAddress as Address,
            value: parseEther(sendingAmount!),
            data: toHex(transactionMemo),
          });
          transaction = await publicClient.waitForTransactionReceipt({
            hash: hash,
          });
        } else {
          const tokenDecimals = await publicClient.readContract({
            address: tokenAddress as Address,
            abi: mockStablecoinAbi,
            functionName: "decimals",
          });
          const { request } = await publicClient.simulateContract({
            account: account,
            address: tokenAddress as Address,
            abi: mockStablecoinAbi,
            functionName: "transfer",
            args: [receivingAddress as Address, parseUnits(sendingAmount!, tokenDecimals as number)],
            dataSuffix: toHex(`-${transactionMemo}`),
          });
          hash = await walletClient.writeContract(request);
          transaction = await publicClient.waitForTransactionReceipt({
            hash: hash,
          });
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
      }
      
      if (
        network.split(":")[0] === "polkadot"
      ) {
        await cryptoWaitReady();
        const keyring = new Keyring();
        const polkadotKeyPair = keyring.addFromUri(mnemonicPhrase);
        const wsProvider = new WsProvider('wss://paseo.rpc.amforc.com:443');
        const polkadotClient = await DedotClient.new<PolkadotApi>(wsProvider);
        const unsub = await polkadotClient.tx.balances
        .transferKeepAlive(receivingAddress!, parseUnits(sendingAmount!, 10))
        .signAndSend(polkadotKeyPair, async ({ status }) => {
          if (status.type === 'BestChainBlockIncluded') { // or status.type === 'Finalized'
            // console.log(`Transaction completed at block hash ${status.value.blockHash}`);
            toast({
              className:
                "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
              title: "Transaction sent!",
              description: "Hash: " + truncateHash(status.value.blockHash.toString() ?? undefined, 6),
              action: (
                <ToastAction altText="view">
                  <a
                    target="_blank"
                    href={`${selectBlockExplorerFromChainId(network!)}/extrinsic/${status.value.blockHash}`}
                  >
                    View
                  </a>
                </ToastAction>
              ),
            });
            await unsub();
            fetchBalances();
          }
        });
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
    setSendButtonLoading(false);
    setReadyToTransfer(false);
    setTransactionCost("");
    setIsValidTotal(undefined);
    setIsValidAddress(undefined);
    setIsValidAmount(undefined);
  }


  // Function to prepare transaction before sending
  async function prepareDelegatedTransaction() {
    if (receivingAddress === "") {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You did not enter a receiving address.",
        description: "Please enter a receiving address to continue.",
      });
      return;
    }
    if (receivingAddress) {
      const isValidAddress = isAddress(receivingAddress, { strict: false });
      if (isValidAddress) {
        setIsValidAddress(true);
      } else {
        setIsValidAddress(false);
      }
    }
    if (sendingAmount === "") {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You did not enter an amount to send.",
        description: "Please enter an amount to send to continue.",
      });
      return;
    }
    if (sendingAmount) {
      const isValidAmount =
        parseEther(currentBalance) >= parseEther(sendingAmount);
      if (isValidAmount) {
        setIsValidAmount(true);
        setContinueButtonLoading(true);
        setTransactionCost("0");
        const isValidTotal =
          parseEther(currentBalance) >= parseEther(sendingAmount);
        if (isValidTotal) {
          setIsValidTotal(true);
          setReadyToTransfer(true);
        } else {
          setIsValidTotal(false);
          setReadyToTransfer(false);
          return;
        }
        setContinueButtonLoading(false);
      } else {
        setIsValidAmount(false);
        return;
      }
    }
  }


  // Function to submit delegated transaction
  async function submitDelegatedTransaction() {
    // Set the send button to loading state
    setSendButtonLoading(true);

    /**
     * Retrieve the handle to the private key from some unauthenticated storage
     */
    const cache = await caches.open("gmgn-storage");
    const request = new Request("gmgn-wallet");
    const response = await cache.match(request);
    const handle = response
      ? new Uint8Array(await response.arrayBuffer())
      : new Uint8Array();
    /**
     * Retrieve the private key from authenticated storage
     */
    const bytes = await getOrThrow(handle);
    const privateKey = fromBytes(bytes, "hex");
    const provider = selectJsonRpcProvider(network!);
    const kaiaSdkWalletClient = new Wallet(privateKey, provider);
    let tx = {
      type: TxType.FeeDelegatedValueTransferMemo,
      to: receivingAddress!,
      from: evmAddress as Address,
      value: parseEther(sendingAmount!),
      input: toHex(transactionMemo),
    };
    const preparedTx = await kaiaSdkWalletClient.populateTransaction(tx);
    const hash = await kaiaSdkWalletClient.signTransaction(preparedTx);
    const currentNetwork = network;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/delegate-fee`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signature: hash,
            network: currentNetwork,
          }),
        }
      );
      const result = await response.json();
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        title: "Transaction sent!",
        description: "Hash: " + truncateHash(result.receipt.transactionHash, 6),
        action: (
          <ToastAction altText="view">
            <a
              target="_blank"
              href={`${selectBlockExplorerFromChainId(network!)}/tx/${
                result.receipt.transactionHash
              }`}
            >
              View
            </a>
          </ToastAction>
        ),
      });
    } catch (error) {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Transaction failed!",
        description: "Uh oh! Something went wrong.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
    setSendButtonLoading(false);
    setReadyToTransfer(false);
  }

  // render the component
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        <Label htmlFor="sendingToken">Sending token</Label>
        <Select
          value={token!}
          defaultValue="eip155:1001/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        >
          <SelectTrigger className="w-full border-2 border-primary h-[56px]">
            <SelectValue placeholder="Select a token" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select a token</SelectLabel>
              {
                ALL_SUPPORTED_ASSETS.map((asset) => (
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
      <div className="flex flex-col mt-4 mb-2">
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
            {selectAssetInfoFromAssetId(token).split(":")[2]}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-8 mt-4 mb-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="receivingAddress">Receiving address</Label>
          <div className="flex flex-row gap-2 items-center justify-center">
            <Input
              id="receivingAddress"
              className="rounded-none w-full border-primary border-2 p-2.5 text-lg"
              placeholder="0x..."
              value={receivingAddress!}
              readOnly
              required
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Check the address of the recipient
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sendingAmount">Amount</Label>
          <Input
            id="sendingAmount"
            className="rounded-none w-full border-primary border-2 p-2.5 mt-2 text-lg"
            type="number"
            placeholder="0"
            value={sendingAmount!}
            readOnly
            required
          />
          <p className="text-sm text-muted-foreground">
            Double check the amount
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="transactionMemo">Memo</Label>
          <Textarea
            id="transactionMemo"
            className="rounded-none w-full border-primary border-2 p-2.5 text-lg"
            placeholder="gm and gn"
            value={transactionMemo}
          />
          <p className="text-sm text-muted-foreground">
            Memo set by the requester
          </p>
        </div>
        {(network === "eip155:1001" || network === "eip155:8217") && (token === "eip155:1001/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") ? (
          <div className="flex items-center space-x-2">
            <Switch
              id="delegate-fee"
              checked={delegateFeeActive}
              onCheckedChange={handleDelegateFeeChange}
            />
            <Label htmlFor="delegate-fee">Delegate gas fee</Label>
          </div>
        ) : null}
        <div className="flex flex-col gap-2 border-2 border-primary p-2">
          <h2 className="border-b pb-1 text-md font-semibold">Details</h2>
          <div className="flex flex-row gap-2">
            <h3 className="text-sm text-muted-foreground">Receiving address</h3>
            <p className="flex flex-row gap-2 items-center text-sm">
              {receivingAddress
                ? truncateAddress(receivingAddress as Address, 4)
                : "-----"}
              {isValidAddress === undefined ? null : isValidAddress === true ? (
                <Popover>
                  <PopoverTrigger>
                    <Check className="w-4 h-4 text-green-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-green-500">
                    Valid address
                  </PopoverContent>
                </Popover>
              ) : (
                <Popover>
                  <PopoverTrigger>
                    <CircleX className="w-4 h-4 text-red-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-red-500">
                    Invalid address
                  </PopoverContent>
                </Popover>
              )}
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <h3 className="text-sm text-muted-foreground">Sending amount</h3>
            <p className="flex flex-row gap-2 items-center text-sm">
              {`${
                sendingAmount ? formatBalance(sendingAmount, 18) : "-----"
              } ${selectAssetInfoFromAssetId(token).split(":")[2]}`}
              {isValidAmount === undefined ? null : isValidAmount === true ? (
                <Popover>
                  <PopoverTrigger>
                    <Check className="w-4 h-4 text-green-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-green-500">
                    Valid amount
                  </PopoverContent>
                </Popover>
              ) : (
                <Popover>
                  <PopoverTrigger>
                    <CircleX className="w-4 h-4 text-red-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-red-500">
                    Invalid amount
                  </PopoverContent>
                </Popover>
              )}
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <h3 className="text-sm text-muted-foreground">Estimated fees</h3>
            <p className="flex flex-row gap-2 items-center text-sm">
              <Fuel className="w-4 h-4" />
              {`${
                transactionCost ? transactionCost : "-----"
              } ${selectAssetInfoFromAssetId(token).split(":")[2]}`}
              {isValidTotal === undefined ? null : isValidTotal === true ? (
                <Popover>
                  <PopoverTrigger>
                    <Check className="w-4 h-4 text-green-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-green-500">
                    Valid total
                  </PopoverContent>
                </Popover>
              ) : (
                <Popover>
                  <PopoverTrigger>
                    <CircleX className="w-4 h-4 text-red-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-red-500">
                    Invalid total
                  </PopoverContent>
                </Popover>
              )}
            </p>
          </div>
          {continueButtonLoading ? (
            <Button disabled className="w-fit self-end">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : delegateFeeActive ? (
            <Button
              disabled={readyToTransfer}
              className="w-fit self-end"
              onClick={prepareDelegatedTransaction}
            >
              Continue
            </Button>
          ) : (
            <Button
              disabled={readyToTransfer}
              className="w-fit self-end"
              onClick={prepareTransaction}
            >
              Continue
            </Button>
          )}
        </div>
      </div>
      {sendButtonLoading ? (
        <div className="flex flex-row gap-2">
          <Button className="w-[150px] self-end" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        </div>
      ) : (
        <div className="flex flex-row gap-2">
          <Button
            disabled={!readyToTransfer}
            onClick={
              delegateFeeActive ? submitDelegatedTransaction : submitTransaction
            }
            className="w-[150px] self-end"
          >
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>
      )}
    </div>
  );
}
