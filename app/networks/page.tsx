"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/back-button";
import { useRouter } from "next/navigation";
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
import { Save } from "lucide-react";

export default function NetworksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const network = searchParams.get("network");

  useEffect(() => {
    // Get the default network from the user local storage.
    const GMGN_DEFAULT_NETWORK = localStorage.getItem("gmgn-default-network");
    if (GMGN_DEFAULT_NETWORK) {
      router.push(`?network=${GMGN_DEFAULT_NETWORK}&address=${address}`);
    } else {
      router.push(`?network=kaia-kairos&address=${address}`);
    }
  }, []);

  function handleInputNetworkChange(value: string) {
    router.push(`?network=${value}&address=${address}`);
  }

  function handleSaveDefaultNetwork() {
    // Save the default network to the user local storage.
    const GMGN_DEFAULT_NETWORK = network;
    localStorage.setItem("gmgn-default-network", GMGN_DEFAULT_NETWORK!);
  }

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Link href={`/?network=${network}&address=${address}`}>
        <Image
          src="/gmgn-logo.svg"
          alt="gmgn logo"
          width={40}
          height={40}
          className="rounded-md"
        />
      </Link>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Networks
      </h1>
      <BackButton route={`/?network=${network}&address=${address}`} />
      <div className="flex flex-col gap-2">
        <h2>Default network</h2>
        <Select
          value={network!}
          onValueChange={handleInputNetworkChange}
          defaultValue="kaia-kairos"
        >
          <SelectTrigger className="w-full md:w-[400px]">
            <SelectValue placeholder="Select a network" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select a network</SelectLabel>
              <SelectItem value="kaia-kairos">Kaia Kairos</SelectItem>
              <SelectItem value="kaia">Kaia</SelectItem>
              <SelectItem value="arbitrum-sepolia">Aribtrum Sepolia</SelectItem>
              <SelectItem value="base-sepolia">Base Sepolia</SelectItem>
              <SelectItem value="ethereum-sepolia">Ethereum Sepolia</SelectItem>
              <SelectItem value="fraxtal-testnet">Fraxtal Testnet</SelectItem>
              <SelectItem value="abstract-testnet">Abstract Testnet</SelectItem>
              <SelectItem value="bartio-testnet">bArtio Testnet</SelectItem>
              <SelectItem value="lukso-testnet">Lukso Testnet</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={handleSaveDefaultNetwork} className="w-fit self-end">
          <Save className="mr-2 w-4 h-4" />
          Save default network
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <h2>Available networks</h2>

        <Button className="w-fit self-end">
          <Save className="mr-2 w-4 h-4" />
          Save
        </Button>
      </div>
    </div>
  );
}
