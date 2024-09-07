"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import {
  createWalletClient,
  createPublicClient,
  http,
  Address,
  Account,
  formatEther,
  parseEther,
  fromBytes,
} from "viem";
import { klaytnBaobab } from "viem/chains";
import Image from "next/image";
import WalletCopyButton from "./wallet-copy-button";
import {
  Send,
  RotateCcw,
  Download,
  LoaderPinwheel,
  CirclePlus,
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
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { WebAuthnStorage } from "@hazae41/webauthnstorage";
import { createIcon } from "@/lib/blockies";

export default function WalletManagement() {
  const { toast } = useToast();
  const [balance, setBalance] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletClient, setWalletClient] = useState<any>();
  const [createWalletButtonActive, setCreateWalletButtonActive] =
    useState(true);

  const [sendingAmount, setSendingAmount] = useState("");
  const [receivingAddress, setReceivingAddress] = useState("");
  const [walletName, setWalletName] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [walletIcon, setWalletIcon] = useState("/kaia.png");

  useEffect(() => {
    const GMGN_WALLET = localStorage.getItem("gmgn-wallet");
    if (GMGN_WALLET) {
      const GMGN_WALLET_STORAGE = JSON.parse(GMGN_WALLET);
      if (GMGN_WALLET_STORAGE.status === "created") {
        setCreateWalletButtonActive(false);
      }
      if (GMGN_WALLET_STORAGE.icon) {
        setWalletIcon(GMGN_WALLET_STORAGE.icon);
      }
      if (GMGN_WALLET_STORAGE.username) {
        setWalletName(GMGN_WALLET_STORAGE.username);
      }
    }
  }, []);

  const publicClient = createPublicClient({
    chain: klaytnBaobab,
    transport: http(),
  });

  async function fetchBalance() {
    const balance = await publicClient.getBalance({
      address: walletAddress as Address,
    });
    setBalance(formatEther(balance).toString());
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
    )}...${convertedAddress.slice(-numberOfChars)}`;
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
    const cache = await caches.open("my-storage");
    const request = new Request("my-private-key");
    const response = await cache.match(request);
    const handle = response
      ? new Uint8Array(await response.arrayBuffer())
      : new Uint8Array();
    // const handle = new Uint8Array([156, 237, 69, 251, 193, 186, 47, 79, 7, 235, 149, 213, 83, 235, 149, 107, 155, 176, 52, 240, 51, 62, 173, 205, 28, 234, 252, 16, 219, 138, 124, 143])
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

  async function createWallet() {
    // const privateKey = generatePrivateKey();
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    /**
     * Store the private key into authenticated storage
     */
    const handle = await WebAuthnStorage.createOrThrow("private-key", bytes);
    /**
     * Store the handle to the private key into some unauthenticated storage
     */
    const cache = await caches.open("my-storage");
    const request = new Request("my-private-key");
    const response = new Response(handle);
    await cache.put(request, response);
    const icon = createIcon({
      // All options are optional
      seed: "randstring", // seed used to generate icon data, default: random
      color: "#dfe", // to manually specify the icon color, default: random
      bgcolor: "#aaa", // choose a different background color, default: white
      size: 15, // width/height of the icon in blocks, default: 10
      scale: 3, // width/height of each block in pixels, default: 5
    });
    const GMGN_WALLET_STORAGE = {
      status: "created",
      icon: icon.toDataURL(),
      username: walletName,
    };
    localStorage.setItem("gmgn-wallet", GMGN_WALLET_STORAGE.toString());
    setCreateWalletButtonActive(false);
  }

  async function submitTransaction() {
    const hash = await walletClient.sendTransaction({
      to: receivingAddress as Address,
      value: parseEther(sendingAmount),
    });
    toast({
      title: "Transaction sent!",
      description: "Hash: " + truncateHash(hash, 6),
      action: <ToastAction altText="view">View</ToastAction>,
    });
    setTransactionHash(hash);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 border-black rounded-md border-2 p-4 w-[300px] md:w-[600px] lg:w-[900px]">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col md:flex-row gap-2 items-start">
            <Image
              src={walletIcon}
              alt="avatar"
              width={50}
              height={50}
              className="rounded-full border-2 border-primary"
            />
            <div className="flex flex-row gap-2 justify-center items-center">
              <p>{walletName ? walletName : "---"}</p>
              <p>{truncateAddress(walletAddress as Address, 6)}</p>
              <WalletCopyButton text={walletAddress as Address} />
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
      <div className="grid grid-cols-2 md:flex md:flex-row gap-2">
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
        <Button onClick={getWallet}>
          <LoaderPinwheel className="mr-2 h-4 w-4" />
          Load
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex flex-col items-center">
              <DialogTitle>Send</DialogTitle>
              <DialogDescription>Enter address and amount</DialogDescription>
            </DialogHeader>
            <div>
              <Input
                className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
                placeholder="0x..."
                value={receivingAddress}
                onChange={(e) => setReceivingAddress(e.target.value)}
              />
              <Input
                className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
                placeholder="0"
                value={sendingAmount}
                onChange={(e) => setSendingAmount(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button onClick={submitTransaction}>Send</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
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
            <DialogFooter className="flex flex-row gap-2 items-center">
              <Input
                className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
                value={walletAddress}
                readOnly
              />
              <WalletCopyButton text={walletAddress as Address} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
