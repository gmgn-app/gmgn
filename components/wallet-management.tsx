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
  parseEther
} from "viem";
import { klaytnBaobab } from "viem/chains";
import Image from "next/image";
import WalletCopyButton from "./wallet-copy-button";
import { Send, RotateCcw, ArrowDownToLine } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function WalletManagement() {
  const { toast } = useToast()

  const [balance, setBalance] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletClient, setWalletClient] = useState<any>();
  const [createWalletButtonActive, setCreateWalletButtonActive] =
    useState(true);

  const [sendingAmount, setSendingAmount] = useState("");
  const [receivingAddress, setReceivingAddress] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

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

  useEffect(() => {
    const privateKey = localStorage.getItem("privateKey");
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
  }, []);

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

  function createWallet() {
    const privateKey = generatePrivateKey();
    console.log(privateKey);
    localStorage.setItem("privateKey", privateKey.toString());
  }

  async function submitTransaction() {
    const hash = await walletClient.sendTransaction({ 
      to: receivingAddress as Address,
      value: parseEther(sendingAmount)
    })
    toast({
      title: "Transaction sent!",
      description: "Hash: " + truncateHash(hash, 6),
      action: <ToastAction altText="view">View</ToastAction>,
    })
    setTransactionHash(hash)
  } 

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 border-black rounded-md border-2 p-4 w-[300px] md:w-[600px] lg:w-[900px]">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col md:flex-row gap-2 items-start">
            <Image
              src="/avatar.svg"
              alt="avatar"
              width={50}
              height={50}
              className="rounded-full border-2 border-primary"
            />
            <div className="flex flex-row gap-2 justify-center items-center">
              <p>{truncateAddress(walletAddress as Address, 6)}</p>
              <WalletCopyButton text={walletAddress as Address} />
            </div>
          </div>
          <Button onClick={fetchBalance} variant="outline" size="icon">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <p className="self-end text-3xl font-semibold">
          {balance} <span className="text-lg text-gray-400">KLAY</span>
        </p>
      </div>
      <div className="flex flex-row gap-2">
        {createWalletButtonActive && (
          <Button className="w-fit" onClick={createWallet}>
            Create
          </Button>
        )}
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
              <DialogDescription>
                Enter address and amount
              </DialogDescription>
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
              <ArrowDownToLine className="mr-2 h-4 w-4" />
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
