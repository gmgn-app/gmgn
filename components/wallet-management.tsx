"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { privateKeyToAccount } from "viem/accounts";
import {
  createWalletClient,
  createPublicClient,
  Address,
  Account,
  formatEther,
  http,
  parseEther,
  fromBytes,
  toHex,
} from "viem";
import { klaytn, klaytnBaobab } from "viem/chains";
import Image from "next/image";
import WalletCopyButton from "./wallet-copy-button";
import {
  Send,
  RotateCcw,
  Download,
  LoaderPinwheel,
  CirclePlus,
  CircleUser,
  Mail,
  Signature,
  CreditCard,
  Settings,
} from "lucide-react";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { WebAuthnStorage } from "@hazae41/webauthnstorage";
import { createIcon } from "@/lib/blockies";
import { createId } from "@paralleldrive/cuid2";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wallet, JsonRpcProvider, TxType } from "@kaiachain/ethers-ext";
import { Switch } from "@/components/ui/switch";

export default function WalletManagement() {
  const { toast } = useToast();
  const [balance, setBalance] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletClient, setWalletClient] = useState<any>();
  const [createWalletButtonActive, setCreateWalletButtonActive] =
    useState(true);
  const [network, setNetwork] = useState<string | undefined>(undefined);
  const [selectKey, setSelectKey] = useState(createId());
  const [sendingAmount, setSendingAmount] = useState("");
  const [receivingAddress, setReceivingAddress] = useState("");
  const [walletName, setWalletName] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [walletIcon, setWalletIcon] = useState("");
  const [gasEstimate, setGasEstimate] = useState("");
  const [gasPrice, setGasPrice] = useState("");
  const [transactionCost, setTransactionCost] = useState("");
  const [readyToTransfer, setReadyToTransfer] = useState(false);
  const [sendingMessage, setSendingMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [messageToSign, setMessageToSign] = useState("");
  const [kaiaSdkWalletClient, setKaiaSdkWalletClient] = useState<any>();
  const [delegateFeeActive, setDelegateFeeActive] = useState(false);
  const [utilitiesText, setUtilitiesText] = useState("");

  useEffect(() => {
    const GMGN_WALLET = localStorage.getItem("gmgn-wallet");
    if (GMGN_WALLET) {
      const wallet = JSON.parse(GMGN_WALLET);
      setWalletName(wallet.username);
      setWalletIcon(wallet.icon);
      if (wallet.status === "created") {
        setCreateWalletButtonActive(false);
      }
    } else {
      setWalletIcon(
        createIcon({
          // All options are optional
          seed: createId(), // seed used to generate icon data, default: random
          size: 15, // width/height of the icon in blocks, default: 10
          scale: 3, // width/height of each block in pixels, default: 5
        }).toDataURL()
      );
    }
  }, []);

  function selectViemChain(text: string) {
    switch (text) {
      case "kaia":
        return klaytn;
      case "kaia-kairos":
        return klaytnBaobab;
      default:
        return klaytnBaobab;
    }
  }

  function selectJsonRpcProvider(network: string | undefined) {
    switch (network) {
      case "kaia":
        return new JsonRpcProvider("https://public-en-kaia.node.kaia.io");
      case "kaia-kairos":
        return new JsonRpcProvider("https://public-en-kairos.node.kaia.io");
      default:
        return new JsonRpcProvider("https://public-en-kairos.node.kaia.io");
    }
  }

  function selectBlockExplorer(network: string | undefined) {
    switch (network) {
      case "kaia":
        return "https://kaiascan.io";
      case "kaia-kairos":
        return "https://kairos.kaiascan.io";
      default:
        return "https://kairos.kaiascan.io";
    }
  }

  const publicClient = createPublicClient({
    chain: selectViemChain(network as string),
    transport: http(),
  });

  async function fetchBalance() {
    const balance = await publicClient.getBalance({
      address: walletAddress as Address,
    });
    setBalance(formatEther(balance).toString());
  }

  async function fetchTransactionCostEstimate() {
    const gas = await publicClient.estimateGas({
      account: walletAddress as Address,
      to: receivingAddress as Address,
      value: parseEther(sendingAmount),
    });
    const gasPrice = await publicClient.getGasPrice();
    setGasEstimate(formatEther(gas));
    setGasPrice(formatEther(gasPrice));
    setTransactionCost(formatEther(gas * gasPrice));
    setReadyToTransfer(true);
  }

  // Truncate the address for display.
  function truncateAddress(
    address: Address | undefined,
    numberOfChars: number
  ) {
    if (!address) return "No address";
    let convertedAddress = address.toString();
    return `${convertedAddress.slice(
      0,
      numberOfChars
    )}...${convertedAddress.slice(-4)}`;
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

  async function getWallet() {
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
    const bytes = await WebAuthnStorage.getOrThrow(handle);
    const privateKey = fromBytes(bytes, "hex");
    if (privateKey) {
      setCreateWalletButtonActive(false);
      const account = privateKeyToAccount(privateKey as Address);
      const walletClient = createWalletClient({
        account: privateKeyToAccount(privateKey as Address),
        chain: klaytnBaobab,
        transport: http(),
      });
      setWalletClient(walletClient);
      setWalletAddress(account.address);
      const provider = selectJsonRpcProvider(network);
      const wallet = new Wallet(privateKey, provider);
      setKaiaSdkWalletClient(wallet);
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: account.address,
        });
        setBalance(formatEther(balance).toString());
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }
  }

  async function showPrivateKey() {
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
    const bytes = await WebAuthnStorage.getOrThrow(handle);
    const privateKey = fromBytes(bytes, "hex");
    if (privateKey) {
      setUtilitiesText(privateKey);
    }
  }

  async function createWallet() {
    // const privateKey = generatePrivateKey();
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    /**
     * Store the private key into authenticated storage
     */
    const handle = await WebAuthnStorage.createOrThrow("gmgn-wallet", bytes);
    /**
     * Store the handle to the private key into some unauthenticated storage
     */
    const cache = await caches.open("gmgn-storage");
    const request = new Request("gmgn-wallet");
    const response = new Response(handle);
    await cache.put(request, response);
    const icon = createIcon({
      // All options are optional
      seed: createId, // seed used to generate icon data, default: random
      size: 15, // width/height of the icon in blocks, default: 10
      scale: 3, // width/height of each block in pixels, default: 5
    });
    const GMGN_WALLET_STORAGE = {
      status: "created",
      icon: icon.toDataURL(),
      username: walletName,
    };
    localStorage.setItem("gmgn-wallet", JSON.stringify(GMGN_WALLET_STORAGE));
    setCreateWalletButtonActive(false);
  }

  async function submitTransaction() {
    const hash = await walletClient.sendTransaction({
      to: receivingAddress as Address,
      value: parseEther(sendingAmount),
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
            href={`${selectBlockExplorer(network)}/tx/${hash}`}
          >
            View
          </a>
        </ToastAction>
      ),
    });
    setReadyToTransfer(false);
    setGasEstimate("");
    setGasPrice("");
    setTransactionCost("");
    setTransactionHash(hash);
    setSendingAmount("");
    setReceivingAddress("");
  }

  async function submitMessage() {
    const hash = await walletClient.sendTransaction({
      to: receivingAddress as Address,
      value: 0,
      data: toHex(sendingMessage),
    });
    toast({
      className:
        "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
      title: "Message sent!",
      description: "Hash: " + truncateHash(hash, 6),
      action: (
        <ToastAction altText="view">
          <a
            target="_blank"
            href={`${selectBlockExplorer(network)}/tx/${hash}`}
          >
            View
          </a>
        </ToastAction>
      ),
    });
    setReadyToTransfer(false);
    setGasEstimate("");
    setGasPrice("");
    setTransactionCost("");
    setTransactionHash(hash);
    setSendingMessage("");
    setReceivingAddress("");
  }

  async function signMessage() {
    const signature = await walletClient.signMessage({
      message: messageToSign,
    });
    setSignature(signature);
  }

  function handleInputNetworkChange(value: string) {
    setNetwork(value);
  }

  async function submitDelegatedTransaction() {
    let tx = {
      type: TxType.FeeDelegatedValueTransfer,
      to: receivingAddress,
      value: parseEther(sendingAmount),
      from: walletAddress,
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
              href={`${selectBlockExplorer(network)}/tx/${
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
    setTransactionHash(hash);
    setSendingAmount("");
    setReceivingAddress("");
  }

  async function submitDelegatedMessage() {
    let tx = {
      type: TxType.FeeDelegatedValueTransferMemo,
      to: receivingAddress,
      from: walletAddress,
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
              href={`${selectBlockExplorer(network)}/tx/${
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
    setTransactionHash(hash);
    setReceivingAddress("");
    setSendingMessage("");
  }

  function handleDelegateFeeChange() {
    setDelegateFeeActive(!delegateFeeActive);
    setReadyToTransfer(!readyToTransfer);
  }

  function resetWallet() {
    localStorage.removeItem("gmgn-wallet");
    setWalletAddress("");
    setWalletClient(undefined);
    setCreateWalletButtonActive(true);
    setWalletName("");
    toast({
      className:
        "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
      title: "Wallet has been reset!",
      description: "Please go to your device settings to clear the passkey.",
    });
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <Select
        key={selectKey}
        value={network}
        onValueChange={handleInputNetworkChange}
        defaultValue="kaia-kairos"
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a network" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Network</SelectLabel>
            <SelectItem value="kaia">Kaia</SelectItem>
            <SelectItem value="kaia-kairos">Kaia Kairos</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="flex flex-col gap-2 border-black rounded-md border-2 p-4">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <Image
              src={walletIcon ? walletIcon : "/kaia.png"}
              alt="avatar"
              width={50}
              height={50}
              className="rounded-full border-2 border-primary"
            />
            <div className="flex flex-col text-sm">
              <div className="flex flex-row gap-2 items-center">
                <CircleUser className="w-4 h-4" />
                <p>{walletName ? walletName : "---"}</p>
              </div>
              <WalletCopyButton
                copyText={walletAddress}
                buttonTitle={truncateAddress(walletAddress as Address, 6)}
              />
            </div>
          </div>
          <Button onClick={fetchBalance} variant="outline" size="icon">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        <p className="self-end text-3xl font-semibold">
          {balance ? balance : "-/-"}{" "}
          <span className="text-lg text-gray-400">KLAY</span>
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {createWalletButtonActive && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <CirclePlus className="mr-2 h-4 w-4" />
                Create
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="flex flex-col items-center">
                <DialogTitle>Create</DialogTitle>
                <DialogDescription>Enter note and create</DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
                  placeholder="johnsmith"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button onClick={createWallet}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        <Button disabled={createWalletButtonActive} onClick={getWallet}>
          <LoaderPinwheel className="mr-2 h-4 w-4" />
          Load
        </Button>
        {!createWalletButtonActive && (
          <Button disabled>
            <CreditCard className="mr-2 h-4 w-4" />
            Topup
          </Button>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={
                createWalletButtonActive ? true : walletAddress ? false : true
              }
            >
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex flex-col items-center">
              <DialogTitle>Send</DialogTitle>
              <DialogDescription>Enter address and amount</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-8 mt-4 mb-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="receivingAddress">Receiving address</Label>
                <Input
                  id="receivingAddress"
                  className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
                  placeholder="0x..."
                  value={receivingAddress}
                  onChange={(e) => setReceivingAddress(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="sendingAmount">Amount</Label>
                <Input
                  id="sendingAmount"
                  className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
                  placeholder="0"
                  value={sendingAmount}
                  onChange={(e) => setSendingAmount(e.target.value)}
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
                  <h2 className="border-b pb-2 text-xl font-semibold">
                    Details
                  </h2>
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
            <DialogFooter>
              <DialogTrigger asChild>
                <Button
                  disabled={!readyToTransfer}
                  onClick={
                    delegateFeeActive
                      ? submitDelegatedTransaction
                      : submitTransaction
                  }
                >
                  Send
                </Button>
              </DialogTrigger>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={
                createWalletButtonActive ? true : walletAddress ? false : true
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Receive
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex flex-col items-center">
              <DialogTitle>Receive</DialogTitle>
              <DialogDescription>
                Scan QR code or copy address
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center">
              <QRCode
                className="mt-4"
                size={256}
                value={walletAddress}
                viewBox={`0 0 256 256`}
              />
            </div>
            <DialogFooter className="md:flex md:flex-row md:gap-2 md:items-center md:justify-center">
              <WalletCopyButton
                copyText={walletAddress}
                buttonTitle={truncateAddress(walletAddress as Address, 6)}
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={
                createWalletButtonActive ? true : walletAddress ? false : true
              }
            >
              <Mail className="mr-2 h-4 w-4" />
              Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex flex-col items-center">
              <DialogTitle>Message</DialogTitle>
              <DialogDescription>Enter receiver and message</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-8 mt-4 mb-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="receivingAddress">Receiving address</Label>
                <Input
                  id="receivingAddress"
                  className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
                  placeholder="0x..."
                  value={receivingAddress}
                  onChange={(e) => setReceivingAddress(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
                  placeholder="gm or gn"
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
                  <h2 className="border-b pb-2 text-xl font-semibold">
                    Details
                  </h2>
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
            <DialogFooter>
            <DialogTrigger asChild>
                <Button
                  disabled={!readyToTransfer}
                  onClick={
                    delegateFeeActive
                      ? submitDelegatedMessage
                      : submitMessage
                  }
                >
                  Send message
                </Button>
              </DialogTrigger>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={
                createWalletButtonActive ? true : walletAddress ? false : true
              }
            >
              <Signature className="mr-2 h-4 w-4" />
              Sign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex flex-col items-center">
              <DialogTitle>Sign</DialogTitle>
              <DialogDescription>Sign a message</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-8 mt-4 mb-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
                  placeholder="gm or gn"
                  value={messageToSign}
                  onChange={(e) => setMessageToSign(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={signMessage}>Sign</Button>
            <DialogFooter>
              <div>
                <h2>Signature</h2>
                <Textarea
                  className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
                  value={signature}
                  readOnly
                />
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={
                createWalletButtonActive ? true : walletAddress ? false : true
              }
            >
              <Settings className="mr-2 h-4 w-4" />
              Utilities
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex flex-col items-center">
              <DialogTitle>Utilities</DialogTitle>
              <DialogDescription>
                Various toolings to manage the wallet
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-row gap-4">
              <Button
                disabled={
                  createWalletButtonActive ? true : walletAddress ? false : true
                }
                onClick={resetWallet}
                variant="destructive"
              >
                Reset wallet
              </Button>
              <Button
                disabled={
                  createWalletButtonActive ? true : walletAddress ? false : true
                }
                variant="destructive"
                onClick={showPrivateKey}
              >
                Show private key
              </Button>
            </div>
            <div className="w-full">
              <h2 className="border-b pb-2 text-xl font-semibold">Result</h2>
              <Textarea
                className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
                value={utilitiesText}
                readOnly
              />
            </div>
            <DialogFooter className="flex flex-row gap-2 items-center justify-center">
              <DialogClose asChild>
                <Button onClick={() => setUtilitiesText("")}>
                  Close and clear
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog></Dialog>
      </div>
    </div>
  );
}
