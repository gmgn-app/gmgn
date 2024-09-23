"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings, RotateCcw, Pencil, KeyRound } from "lucide-react";
import WalletCopyButton from "@/components/wallet-copy-button";
import { truncateAddress } from "@/lib/utils";
import { Address } from "viem";

export default function TestHome() {
  // Get the search params from the URL.
  const searchParams = useSearchParams();
  const chainName = searchParams.get("chain");
  const [walletAddress, setWalletAddress] = useState("");

  const [network, setNetwork] = useState<string | undefined>(
    chainName ?? undefined
  );
  const [walletName, setWalletName] = useState("");
  const [walletIcon, setWalletIcon] = useState("");

  async function handleInputNetworkChange(value: string) {
    setNetwork(value);
  }
  return (
    <div className="flex flex-col gap-12 p-4 items-center justify-center w-screen md:w-[768px]">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-row justify-between items-center">
          <Link href="/">
            <Image
              src="/gmgn-logo.svg"
              alt="gmgn logo"
              width={40}
              height={40}
              className="rounded-md"
            />
          </Link>
          <div className="flex flex-row gap-2">
            <Select
              value={network}
              onValueChange={handleInputNetworkChange}
              defaultValue="kaia-kairos"
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select a network" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select a network</SelectLabel>
                  <SelectItem value="kaia-kairos">Kaia Kairos</SelectItem>
                  <SelectItem value="arbitrum-sepolia">
                    Aribtrum Sepolia
                  </SelectItem>
                  <SelectItem value="base-sepolia">Base Sepolia</SelectItem>
                  <SelectItem value="ethereum-sepolia">
                    Ethereum Sepolia
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button asChild size="icon" variant="outline">
              <Link href="/settings">
                <Settings className="w-6 h-6" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 bg-primary h-[350px] items-center justify-center rounded-md p-4">
          <Button variant="secondary">
            <KeyRound className="mr-2 h-4 w-4" />
            Create wallet with Passkey
          </Button>
        </div>
      </div>
    </div>
  );
}
