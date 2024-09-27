"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  getAddress,
  isAddress,
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
  Ban
} from "lucide-react";
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
import { redirect } from "next/navigation";
import {
  formatBalance,
  truncateHash,
  truncateAddress,
  selectBlockExplorer,
  selectViemChainFromNetwork,
  selectNativeAssetSymbol,
  selectJsonRpcProvider,
} from "@/lib/utils";
import { set } from "react-hook-form";

export default function SendTransactionForm() {
  // Get the search params from the URL.
  const searchParams = useSearchParams();
  const network = searchParams.get("network");
  const address = searchParams.get("address");

  if (!network || !address) {
    redirect("/");
  }

  const [currentBalance, setCurrentBalance] = useState("");
  const [sendingAmount, setSendingAmount] = useState("");
  const [receivingAddress, setReceivingAddress] = useState("");
  const [transactionMemo, setTransactionMemo] = useState("");
  const [transactionCost, setTransactionCost] = useState("");
  const [readyToTransfer, setReadyToTransfer] = useState(false);
  const [delegateFeeActive, setDelegateFeeActive] = useState(false);
  const [inputReadOnly, setInputReadOnly] = useState(false);
  const [continueButtonLoading, setContinueButtonLoading] = useState(false);
  const [sendButtonLoading, setSendButtonLoading] = useState(false);
  const [qrScanSuccess, setQrScanSuccess] = useState(false);
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

  useEffect(() => {
    if (address) {
      const publicClient = createPublicClient({
        chain: selectViemChainFromNetwork(network as string),
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

  const publicClient = createPublicClient({
    chain: selectViemChainFromNetwork(network!),
    transport: http(),
  });

  async function fetchBalance() {
    const balance = await publicClient.getBalance({
      address: address as Address,
    });
    setCurrentBalance(formatEther(balance).toString());
  }

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

  function handleDelegateFeeChange() {
    setDelegateFeeActive(!delegateFeeActive);
    setReadyToTransfer(true);
  }

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
        const gas = await publicClient.estimateGas({
          account: address as Address,
          to: receivingAddress as Address,
          value: parseEther(sendingAmount),
        });
        const gasPrice = await publicClient.getGasPrice();
        const gasCost = gas * gasPrice;
        setTransactionCost(formatEther(gasCost));
        const isValidTotal =
          parseEther(currentBalance) >= parseEther(sendingAmount) + gasCost;
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

  // 2. Define a submit handler.
  async function submitTransaction() {
    /**
     * Retrieve the handle to the private key from some unauthenticated storage
     */
    setSendButtonLoading(true);
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
      const hash = await walletClient.sendTransaction({
        account,
        to: receivingAddress as Address,
        value: parseEther(sendingAmount),
        data: toHex(transactionMemo),
      });
      const publicClient = createPublicClient({
        chain: selectViemChainFromNetwork(network!),
        transport: http(),
      });
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      if (transaction) {
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
    setReadyToTransfer(true);
    setReceivingAddress("");
    setTransactionMemo("");
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <h2 className="text-xl">Balance</h2>
        <div className="flex flex-row items-center justify-between">
          <p className="text-2xl">
            {currentBalance ? formatBalance(currentBalance, 4) : "-/-"}{" "}
            <span className="text-lg">{selectNativeAssetSymbol(network)}</span>
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
              className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
              placeholder="0x..."
              value={receivingAddress}
              onChange={(e) => setReceivingAddress(e.target.value)}
              readOnly={inputReadOnly}
              required
            />
            <Dialog>
              <DialogTrigger>
                <ScanLine className="w-6 h-6" />
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
                        Scan completed
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
          <Label htmlFor="sendingAmount">Amount</Label>
          <Input
            id="sendingAmount"
            className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
            type="number"
            placeholder="0"
            value={sendingAmount}
            onChange={(e) => setSendingAmount(e.target.value)}
            readOnly={inputReadOnly}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="transactionMemo">Memo</Label>
          <Textarea
            id="transactionMemo"
            className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
            placeholder="gm and gn"
            value={transactionMemo}
            onChange={(e) => setTransactionMemo(e.target.value)}
          />
        </div>
        {network === "kaia" || network === "kaia-kairos" ? (
          <div className="flex items-center space-x-2">
            <Switch
              id="delegate-fee"
              checked={delegateFeeActive}
              onCheckedChange={handleDelegateFeeChange}
            />
            <Label htmlFor="delegate-fee">Delegate gas fee</Label>
          </div>
        ) : null}
        {!delegateFeeActive && (
          <div className="flex flex-col gap-2 border-2 border-primary p-2">
            <h2 className="border-b pb-1 text-md font-semibold">Details</h2>
            <div className="flex flex-row gap-2">
              <h3 className="text-sm text-muted-foreground">
                Receiving address
              </h3>
              <p className="flex flex-row gap-2 items-center text-sm">
                {receivingAddress
                  ? truncateAddress(receivingAddress as Address, 4)
                  : "-----"}
                {isValidAddress === undefined ? null : isValidAddress ===
                  true ? (
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
                } ${selectNativeAssetSymbol(network)}`}
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
        )}
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
          <Button variant="outline">
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
