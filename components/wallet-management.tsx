"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import {
  createWalletClient,
  createPublicClient,
  http,
  Address,
  Account,
  formatEther,
} from "viem";
import { klaytnBaobab } from "viem/chains";
import Image from "next/image";
import WalletCopyButton from "./wallet-copy-button";
import { RotateCcw } from "lucide-react";
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

export default function WalletManagement() {
  const [balance, setBalance] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [createWalletButtonActive, setCreateWalletButtonActive] =
    useState(true);

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
      setWalletAddress(account.address);
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

  function createWallet() {
    const privateKey = generatePrivateKey();
    console.log(privateKey);
    localStorage.setItem("privateKey", privateKey.toString());
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
          <Button variant="outline" size="icon">
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
        <Button className="w-fit">Send</Button>
        <Button className="w-fit">Receive</Button>
        <QRCode
          size={256}
          value={walletAddress}
          viewBox={`0 0 256 256`}
        />
      </div>
    </div>
  );
}
