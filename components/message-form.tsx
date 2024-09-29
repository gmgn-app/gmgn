"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useSearchParams } from "next/navigation";
import {
  createPublicClient,
  http,
  Address,
  formatEther,
  fromBytes,
  createWalletClient,
  parseEther,
  toHex,
} from "viem";
import {
  klaytn,
  klaytnBaobab,
  arbitrumSepolia,
  baseSepolia,
  sepolia,
} from "viem/chains";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Wallet, JsonRpcProvider, TxType } from "@kaiachain/ethers-ext";
import { privateKeyToAccount } from "viem/accounts";
import { getOrThrow } from "@/lib/passkey-auth";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Mail, RotateCcw, ScanLine, ThumbsUp, Loader2 } from "lucide-react";
import { redirect } from 'next/navigation'
import { formatBalance } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { selectViemChainFromNetwork } from "@/lib/utils";
import { Scanner } from "@yudiel/react-qr-scanner";


export default function MessageForm() {
  // Get the search params from the URL.
  const searchParams = useSearchParams();
  const network = searchParams.get("network");
  const address = searchParams.get("address");

  if (!network || !address) {
    redirect("/")
  }

  const [currentBalance, setCurrentBalance] = useState("");
  const [sendingAmount, setSendingAmount] = useState("");
  const [receivingAddress, setReceivingAddress] = useState("");
  const [sendingMessage, setSendingMessage] = useState("");
  const [gasEstimate, setGasEstimate] = useState("");
  const [gasPrice, setGasPrice] = useState("");
  const [transactionCost, setTransactionCost] = useState("");
  const [readyToTransfer, setReadyToTransfer] = useState(false);
  const [delegateFeeActive, setDelegateFeeActive] = useState(false);
  const [qrScanSuccess, setQrScanSuccess] = useState(false);


  // Toast notifications.
  const { toast } = useToast();

  useEffect(() => {
    if (address) {
      const publicClient = createPublicClient({
        chain: selectViemChainConfig(network as string),
        transport: http(),
      });
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: address as Address,
        });
        setCurrentBalance(formatEther(balance).toString());
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }
  }, [address, network]);

  function handleQrScan(data: string) {
    if (data.includes(":")) {
      const splitData = data.split(":");
      setReceivingAddress(splitData[1]);
      setQrScanSuccess(true);
      // delay the success message for 2 seconds
      setTimeout(() => {
        setQrScanSuccess(false);
      }, 5000);
    } else {
      setReceivingAddress(data);
      setQrScanSuccess(true);
      // delay the success message for 2 seconds
      setTimeout(() => {
        setQrScanSuccess(false);
      }, 5000);
    }
  }

  // Truncate the hash for display
  function truncateHash(address: String | undefined, numberOfChars: number) {
    if (!address) return "No address";
    let convertedAddress = address.toString();
    return `${convertedAddress.slice(
      0,
      numberOfChars
    )}...${convertedAddress.slice(-numberOfChars)}`;
  }

  // Select the block explorer based on the network
  function selectBlockExplorer(network: string | undefined) {
    switch (network) {
      case "kaia":
        return "https://kaiascan.io";
      case "kaia-kairos":
        return "https://kairos.kaiascan.io";
      default:
        return "https://sepolia.etherscan.io";
    }
  }

  function selectJsonRpcProvider(network: string | undefined) {
    // https://rpc.ankr.com/arbitrum_sepolia
    // https://rpc.ankr.com/base_sepolia
    switch (network) {
      case "kaia":
        return new JsonRpcProvider("https://public-en-kaia.node.kaia.io");
      case "kaia-kairos":
        return new JsonRpcProvider("https://public-en-kairos.node.kaia.io");
      default:
        return new JsonRpcProvider("https://public-en-kairos.node.kaia.io");
    }
  }

  function selectViemChainConfig(network: string | undefined) {
    switch (network) {
      case "kaia":
        return klaytn;
      case "kaia-kairos":
        return klaytnBaobab;
      case "arbitrum-sepolia":
        return arbitrumSepolia;
      case "base-sepolia":
        return baseSepolia;
      case "ethereum-sepolia":
        return sepolia;
      default:
        return klaytnBaobab;
    }
  }

  function selectNativeAssetSymbol(network: string | undefined | null) {
    switch (network) {
      case "kaia":
        return "KLAY";
      case "kaia-kairos":
        return "KLAY";
      case "arbitrum-sepolia":
        return "ETH";
      case "base-sepolia":
        return "ETH";
      case "ethereum-sepolia":
        return "ETH";
      default:
        return "ETH";
    }
  }

  const publicClient = createPublicClient({
    chain: klaytnBaobab,
    transport: http(),
  });

  async function fetchBalance() {
    const balance = await publicClient.getBalance({
      address: address as Address,
    });
    setCurrentBalance(formatEther(balance).toString());
  }


  async function fetchTransactionCostEstimate() {
    const publicClient = createPublicClient({
      chain: klaytnBaobab,
      transport: http(),
    });
    const gas = await publicClient.estimateGas({
      account: address as Address,
      to: receivingAddress as Address,
      value: parseEther(sendingAmount),
    });
    const gasPrice = await publicClient.getGasPrice();
    setGasEstimate(formatEther(gas));
    setGasPrice(formatEther(gasPrice));
    setTransactionCost(formatEther(gas * gasPrice));
    setReadyToTransfer(true);
  }

  // 2. Define a submit handler.
  async function submitTransaction() {
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
    if (privateKey) {
      const account = privateKeyToAccount(privateKey as Address);
      const walletClient = createWalletClient({
        account: privateKeyToAccount(privateKey as Address),
        chain: selectViemChainFromNetwork(network),
        transport: http(),
      });
      const hash = await walletClient.sendTransaction({
        account,
        to: receivingAddress as Address,
        value: BigInt(0),
        data: toHex(sendingMessage),
      });
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        title: "Transaction sent!",
        description: "Hash: " + truncateHash(hash, 6),
        action: (
          <ToastAction altText="view">
            <a
              target="_blank"
              href={`${selectBlockExplorer(network!)}/tx/${hash}`}
            >
              View
            </a>
          </ToastAction>
        ),
      });
    } else {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Wallet load failed!",
        description: "Uh oh! Something went wrong. please try again.",
      });
    }
  }
  // =========== END OF FORM HANDLING ===========

  function handleDelegateFeeChange() {
    setDelegateFeeActive(!delegateFeeActive);
    setReadyToTransfer(!readyToTransfer);
  }

  async function submitDelegatedTransaction() {
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
      to: receivingAddress,
      from: address as Address,
      value: 0,
      input: toHex(sendingMessage),
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
              href={`${selectBlockExplorer(network!)}/tx/${
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
    setReadyToTransfer(true);
    setReceivingAddress("");
    setSendingMessage("");
  }

  return (
    <div className="flex flex-col">
      <div>
        <h2 className="text-xl">Balance</h2>
        <div className="flex flex-row items-center justify-between">
          <p className="text-2xl">
            {currentBalance ? formatBalance(currentBalance, 4) : "-/-"}{" "}
            <span className="text-lg">
              {selectNativeAssetSymbol(network)}
            </span>
          </p>
          <Button onClick={fetchBalance} size="icon">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-8 mt-4 mb-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="receivingAddress">Receiving address</Label>
          <div className="flex flex-row gap-2 items-center justify-center">
            <Input
              id="receivingAddress"
              className="rounded-none w-full border-primary border-2 p-2.5"
              placeholder="0x..."
              value={receivingAddress}
              onChange={(e) => setReceivingAddress(e.target.value)}
              required
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="icon">
                  <ScanLine className="w-6 h-6" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>QR Scanner</DialogTitle>
                  <DialogDescription>
                    Scan QR code to autofill
                  </DialogDescription>
                </DialogHeader>
                <Scanner
                  onScan={(result) => handleQrScan(result[0].rawValue)}
                />
                <DialogFooter>
                  <div className="flex flex-col items-center justify-center">
                    {qrScanSuccess ? (
                      <p className="flex flex-row gap-2 text-blue-600">
                        <ThumbsUp className="h-6 w-6" />
                        Scan completed. Exit to continue.
                      </p>
                    ) : (
                      <p className="flex flex-row gap-2 text-yellow-600">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Scanning...
                      </p>
                    )}
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sendingMessage">Message</Label>
          <Textarea
            id="sendingMessage"
            className="rounded-none w-full border-primary border-2 p-2.5"
            placeholder="gm gn to you"
            value={sendingMessage}
            onChange={(e) => setSendingMessage(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="delegate-fee"
            checked={delegateFeeActive}
            onCheckedChange={handleDelegateFeeChange}
          />
          <Label htmlFor="delegate-fee">Delegate fee</Label>
        </div>

        {!delegateFeeActive && (
          <div className="flex flex-col gap-2 border-2 border-primary p-2 text-right">
            <h2 className="border-b pb-2 text-xl font-semibold">Details</h2>
            <p>{gasEstimate} : Gas</p>
            <p>{gasPrice} : Gas price</p>
            <p>{transactionCost} : Cost</p>
            <Button
              disabled={readyToTransfer}
              className="w-fit self-end"
              onClick={fetchTransactionCostEstimate}
            >
              Continue
            </Button>
          </div>
        )}
      </div>
      <Button
        disabled={!readyToTransfer}
        onClick={
          delegateFeeActive ? submitDelegatedTransaction : submitTransaction
        }
      >
        <Mail className="mr-2 h-4 w-4" />
        Message
      </Button>
    </div>
  );
}
