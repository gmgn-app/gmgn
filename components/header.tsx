"use client";

import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { constructNavUrl } from "@/lib/utils";


export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const network = searchParams.get("network");
  const address = searchParams.get("address");

  function handleInputNetworkChange(value: string) {
    router.push(`?network=${value}&address=${address}`);
  }

  return (
    <div className="flex flex-row justify-between items-center">
      <Link href={constructNavUrl(network, address)}>
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
          value={network!}
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
        <Button asChild size="icon" variant="outline">
          <Link href={`/settings?network=${network}&address=${address}`}>
            <Settings className="w-6 h-6" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
