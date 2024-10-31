"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  isAddress,
  formatUnits,
  parseUnits,
} from "viem";
import { Wallet, TxType } from "@kaiachain/ethers-ext";
import { privateKeyToAccount } from "viem/accounts";
import { getOrThrow } from "@/lib/passkey-auth";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  Send,
  RotateCcw,
  Fuel,
  Loader2,
  ScanLine,
  ThumbsUp,
  Check,
  CircleX,
  Ban,
  ClipboardPaste,
  WandSparkles,
  SearchCode,
  Code,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scanner } from "@yudiel/react-qr-scanner";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import {
  formatBalance,
  truncateHash,
  truncateAddress,
  selectBlockExplorer,
  selectViemChainFromNetwork,
  selectNativeAssetSymbol,
  selectJsonRpcProvider,
} from "@/lib/utils";
import { normalize } from "viem/ens";
import { mainnet } from "viem/chains";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CHAINS_INFO } from "@/lib/chains";
import { mockStablecoinAbi } from "@/lib/abis";
import { useRouter } from "next/navigation";

export default function SendTransactionForm() {
  // Get the search params from the URL.
  const searchParams = useSearchParams();
  const router = useRouter();
  const network = searchParams.get("network");
  const address = searchParams.get("address");
  const token = searchParams.get("token");

  // Redirect to the home page if the network or address is not provided.
  if (!network || !address) {
    redirect("/");
  }

  // Check if the user is on a desktop or mobile device.
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // State for current balance
  const [currentBalance, setCurrentBalance] = useState("");
  const [currentNativeBalance, setCurrentNativeBalance] = useState("");

  // Main state for the send form
  const [sendingAmount, setSendingAmount] = useState("");
  const [receivingAddress, setReceivingAddress] = useState("");
  const [transactionMemo, setTransactionMemo] = useState("");

  // optional state for ENS lookup
  const [ensName, setEnsName] = useState("");

  // State for transaction cost
  const [transactionCost, setTransactionCost] = useState("");

  // State for delegate fee on Kaia
  const [delegateFeeActive, setDelegateFeeActive] = useState(false);

  // Handle UX states
  const [readyToTransfer, setReadyToTransfer] = useState(false);
  const [inputReadOnly, setInputReadOnly] = useState(false);
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
  const [isPasted, setIsPasted] = useState(false);
  const [isEnsResolved, setIsEnsResolved] = useState(false);
  const [ensLookUpLoading, setEnsLookUpLoading] = useState(false);

  // QR Scan for input
  const [qrScanSuccess, setQrScanSuccess] = useState(false);

  // QR Scan open/close state
  const [isQrScanOpen, setIsQrScanOpen] = useState(false);

  // publicClient for ENS lookup
  const mainnetPublicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  // Function to resolve ENS
  const resolveEns = async () => {
    if (receivingAddress.includes(".")) {
      setEnsLookUpLoading(true);
      const ensAddress = await mainnetPublicClient.getEnsAddress({
        name: normalize(receivingAddress),
      });
      if (ensAddress) {
        setReceivingAddress(ensAddress);
        setIsEnsResolved(true);
        setEnsName(receivingAddress);
        setEnsLookUpLoading(false);
        setTimeout(() => {
          setIsEnsResolved(false);
        }, 1000);
      } else {
        toast({
          className:
            "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
          variant: "destructive",
          title: "Uh oh! ENS lookup failed.",
          description: "Please try again.",
        });
        setEnsName("");
        setIsEnsResolved(false);
        setEnsLookUpLoading(false);
      }
    }
  };

  // Function to paste from clipboard
  const paste = async () => {
    setReceivingAddress(await navigator.clipboard.readText());
    setIsPasted(true);

    setTimeout(() => {
      setIsPasted(false);
    }, 1000);
  };

  // Toast notifications.
  const { toast } = useToast();

  // Fetch the current balance upon page load
  useEffect(() => {
    if (
      address &&
      network &&
      token === "0x0000000000000000000000000000000000000000"
    ) {
      const publicClient = createPublicClient({
        chain: selectViemChainFromNetwork(network as string),
        transport: http(),
      });
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: address as Address,
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
      address &&
      network &&
      token !== "0x0000000000000000000000000000000000000000"
    ) {
      const publicClient = createPublicClient({
        chain: selectViemChainFromNetwork(network as string),
        transport: http(),
      });
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: address as Address,
        });
        const tokenBalance = await publicClient.readContract({
          address: token as Address,
          abi: mockStablecoinAbi,
          functionName: "balanceOf",
          args: [address as Address],
        });
        setCurrentBalance(formatUnits(tokenBalance as bigint, 6).toString());
        setCurrentNativeBalance(formatEther(balance as bigint).toString());
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }
  }, [address, network, token]);

  // public client for balance refresh
  const publicClient = createPublicClient({
    chain: selectViemChainFromNetwork(network!),
    transport: http(),
  });

  // Function to fetch balance
  async function fetchBalances() {
    if (
      address &&
      network &&
      token === "0x0000000000000000000000000000000000000000"
    ) {
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: address as Address,
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
      address &&
      network &&
      token !== "0x0000000000000000000000000000000000000000"
    ) {
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: address as Address,
        });
        const tokenBalance = await publicClient.readContract({
          address: token as Address,
          abi: mockStablecoinAbi,
          functionName: "balanceOf",
          args: [address as Address],
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
    router.push(`?network=${network}&address=${address}&token=${value}`);
  }

  // Function to handle QR scan
  function handleQrScan(data: string) {
    if (data.includes(":")) {
      const splitData = data.split(":");
      setReceivingAddress(splitData[1]);
      setQrScanSuccess(true);
      // delay the success message for 2 seconds
      setTimeout(() => {
        setQrScanSuccess(false);
      }, 500);
    } else {
      setReceivingAddress(data);
      setQrScanSuccess(true);
      // delay the success message for 2 seconds
      setTimeout(() => {
        setQrScanSuccess(false);
        setIsQrScanOpen(false);
      }, 500);
    }
  }

  // Function to autogenerate UID
  function autogenerateUid() {
    const uid = createId();
    setTransactionMemo(uid);
  }

  // Function to handle delegate fee
  function handleDelegateFeeChange() {
    setDelegateFeeActive(!delegateFeeActive);
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
        setInputReadOnly(true);
        setContinueButtonLoading(true);
        const publicClient = createPublicClient({
          chain: selectViemChainFromNetwork(network!),
          transport: http(),
        });

        let gas;
        if (token === "0x0000000000000000000000000000000000000000") {
          gas = await publicClient.estimateGas({
            account: address as Address,
            to: receivingAddress as Address,
            value: parseEther(sendingAmount),
            data: toHex(transactionMemo),
          });
        } else {
          gas = await publicClient.estimateContractGas({
            address: token as Address,
            abi: mockStablecoinAbi,
            functionName: "transfer",
            account: address as Address,
            args: [receivingAddress as Address, parseUnits(sendingAmount, 6)],
          });
        }
        const gasPrice = await publicClient.getGasPrice();
        const gasCost = gas * gasPrice;
        setTransactionCost(formatEther(gasCost));
        let isValidTotal;
        if (token === "0x0000000000000000000000000000000000000000") {
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
    const privateKey = fromBytes(bytes, "hex");
    if (privateKey) {
      const account = privateKeyToAccount(privateKey as Address);
      const walletClient = createWalletClient({
        account: privateKeyToAccount(privateKey as Address),
        chain: selectViemChainFromNetwork(network!),
        transport: http(),
      });
      const publicClient = createPublicClient({
        chain: selectViemChainFromNetwork(network!),
        transport: http(),
      });
      let transaction = null;
      let hash = null;

      if (token === "0x0000000000000000000000000000000000000000") {
        hash = await walletClient.sendTransaction({
          account,
          to: receivingAddress as Address,
          value: parseEther(sendingAmount),
          data: toHex(transactionMemo),
        });
        transaction = await publicClient.waitForTransactionReceipt({
          hash: hash,
        });
      } else {
        const { request } = await publicClient.simulateContract({
          account: privateKeyToAccount(privateKey as Address),
          address: token as Address,
          abi: mockStablecoinAbi,
          functionName: "transfer",
          args: [receivingAddress as Address, parseUnits(sendingAmount, 6)],
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
                href={`${selectBlockExplorer(network!)}/tx/${hash}`}
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
    setSendButtonLoading(false);
    setReadyToTransfer(false);
    setInputReadOnly(false);
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
        setInputReadOnly(true);
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
      to: receivingAddress,
      from: address as Address,
      value: parseEther(sendingAmount),
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
    setSendButtonLoading(false);
    setReadyToTransfer(false);
    setInputReadOnly(false);
  }

  // Function to clear all fields
  function clearAllFields() {
    setReceivingAddress("");
    setSendingAmount("");
    setTransactionMemo("");
    setTransactionCost("");
    setReadyToTransfer(false);
    setInputReadOnly(false);
    setIsValidAddress(undefined);
    setIsValidAmount(undefined);
    setIsValidTotal(undefined);
    setEnsName("");
    setIsEnsResolved(false);
    setEnsLookUpLoading(false);
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <h2 className="text-xl">Balance</h2>
        <div className="flex flex-row items-center justify-between">
          <p className="text-2xl font-semibold">
            {currentBalance ? formatBalance(currentBalance, 4) : "-/-"}{" "}
            <span className="text-lg">
              {selectNativeAssetSymbol(network, token)}
            </span>
          </p>
          <Button onClick={fetchBalances} size="icon">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {currentNativeBalance
            ? formatBalance(currentNativeBalance, 4)
            : "-/-"}{" "}
          <span className="text-sm text-muted-foreground">
            {selectNativeAssetSymbol(network)}
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-8 mt-4 mb-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="sendingToken">Sending token</Label>
          <Select
            value={token!}
            onValueChange={handleInputTokenChange}
            defaultValue="0x0000000000000000000000000000000000000000"
          >
            <SelectTrigger className="w-full border-2 border-primary">
              <SelectValue placeholder="Select a token" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select a token</SelectLabel>
                <SelectItem value="0x0000000000000000000000000000000000000000">
                  <div className="flex flex-row gap-2">
                    <Image
                      src="/kaia.png"
                      alt="kaia logo"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <p>
                      {selectNativeAssetSymbol(
                        network,
                        "0x0000000000000000000000000000000000000000"
                      )}
                    </p>
                  </div>
                </SelectItem>
                <SelectItem value="0x8cfA6aC9c5ae72faec3A0aEefEd1bFB12c8cC746">
                  <div className="flex flex-row gap-2">
                    <Image
                      src="/usdc.svg"
                      alt="usdc logo"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    {selectNativeAssetSymbol(
                      network,
                      "0x8cfA6aC9c5ae72faec3A0aEefEd1bFB12c8cC746"
                    )}
                  </div>
                </SelectItem>
                <SelectItem value="0x0076e4cE0E5428d7fc05eBaFbd644Ee74BDE624d">
                <div className="flex flex-row gap-2">
                    <Image
                      src="/usdt.svg"
                      alt="usdt logo"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    {selectNativeAssetSymbol(
                      network,
                      "0x0076e4cE0E5428d7fc05eBaFbd644Ee74BDE624d"
                    )}
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="receivingAddress">Receiving address</Label>
          <div className="flex flex-row gap-2 items-center justify-center">
            <Input
              id="receivingAddress"
              className="rounded-none w-full border-primary border-2 p-2.5 text-lg"
              placeholder="0x..."
              value={receivingAddress}
              onChange={(e) => setReceivingAddress(e.target.value)}
              readOnly={inputReadOnly}
              required
            />
            <Button
              variant="secondary"
              size="icon"
              disabled={isEnsResolved}
              onClick={resolveEns}
            >
              {isEnsResolved ? (
                <Check className="h-4 w-4" />
              ) : ensLookUpLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SearchCode className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              disabled={isPasted}
              onClick={paste}
            >
              {isPasted ? (
                <Check className="h-4 w-4" />
              ) : (
                <ClipboardPaste className="h-4 w-4" />
              )}
            </Button>
            <Dialog open={isQrScanOpen} onOpenChange={setIsQrScanOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="icon">
                  <ScanLine className="w-4 h-4" />
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
          {ensName ? (
            <Badge className="w-fit" variant="secondary">
              <Code className="mr-2 w-4 h-4" />
              {ensName}
            </Badge>
          ) : (
            <Badge className="w-fit" variant="secondary">
              <Code className="mr-2 w-4 h-4" />
              ------
            </Badge>
          )}
          <p className="text-sm text-muted-foreground">
            Fill in the address of the recipient
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sendingAmount">Amount</Label>
          {isDesktop ? (
            <Input
              id="sendingAmount"
              className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
              type="number"
              placeholder="0"
              value={sendingAmount}
              onChange={(e) => setSendingAmount(e.target.value)}
              required
            />
          ) : (
            <Input
              id="sendingAmount"
              className="rounded-none w-full border-primary border-2 p-2.5 mt-2 text-lg"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              placeholder="0"
              value={sendingAmount}
              onChange={(e) => setSendingAmount(e.target.value)}
              required
            />
          )}
          <p className="text-sm text-muted-foreground">
            Fill in the amount that you want to send
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="transactionMemo">Memo</Label>
          <Textarea
            id="transactionMemo"
            className="rounded-none w-full border-primary border-2 p-2.5 text-lg"
            placeholder="gm and gn"
            value={transactionMemo}
            onChange={(e) => setTransactionMemo(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Optional memo for the transaction or autogenerate an UID
          </p>
          <Button
            onClick={autogenerateUid}
            variant="secondary"
            className="w-fit"
          >
            <WandSparkles className="mr-2 h-4 w-4" />
            Autogenerate UID
          </Button>
        </div>
        {(network === "kaia" || network === "kaia-kairos") && (token === "0x0000000000000000000000000000000000000000") ? (
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
              } ${selectNativeAssetSymbol(network, token)}`}
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
              } ${selectNativeAssetSymbol(network)}`}
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
        <div className="flex flex-row gap-2 justify-between">
          <Button disabled variant="outline">
            <Ban className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button className="w-[150px]" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        </div>
      ) : (
        <div className="flex flex-row gap-2 justify-between">
          <Button variant="outline" onClick={clearAllFields}>
            <Ban className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            disabled={!readyToTransfer}
            onClick={
              delegateFeeActive ? submitDelegatedTransaction : submitTransaction
            }
            className="w-[150px]"
          >
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>
      )}
    </div>
  );
}
