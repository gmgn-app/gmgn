"use client";

import { useState, useEffect } from "react";
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
import { constructNavUrl, selectChainNameFromNetwork } from "@/lib/utils";
import { GMGN_NETWORKS } from "@/lib/chains";


export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const network = searchParams.get("network") !== "null" ? searchParams.get("network") : "kaia-kairos";
  const address = searchParams.get("address") !== "null" ? searchParams.get("address") : null;
  const token = searchParams.get("token") !== "null" ? searchParams.get("token") : null;
  const [availableNetworks, setAvailableNetworks] = useState<string[]>([]);

  useEffect(() => {
    if (address === null || address === undefined || address === "null") {
      router.push(`?network=${network}`);
    } else if (token === null || token === undefined || token === "null") {
      router.push(`?network=${network}&address=${address}`);
    } else {
      router.push(`?network=${network}&address=${address}&token=${token}`);
    }
    // if the user has not set the GMGN_NETWORKS in the local storage, set it.
    if (!localStorage.getItem("gmgn-available-networks")) {
      localStorage.setItem(
        "gmgn-available-networks",
        JSON.stringify(GMGN_NETWORKS)
      );
      setAvailableNetworks(GMGN_NETWORKS);
    }

    // get the GMGN_NETWORKS from the local storage
    const GMGN_NETWORKS_FROM_LOCAL_STORAGE = localStorage.getItem(
      "gmgn-available-networks"
    );
    if (GMGN_NETWORKS_FROM_LOCAL_STORAGE) {
      const GMGN_AVAILABLE_NETWORKS = JSON.parse(
        GMGN_NETWORKS_FROM_LOCAL_STORAGE!
      );
      setAvailableNetworks(GMGN_AVAILABLE_NETWORKS);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleInputNetworkChange(value: string) {
    if (address === null || address === undefined || address === "null") {
      router.push(`?network=${value}`);
      return;
    } else {
      router.push(`?network=${value}&address=${address}`);
    }
  }

  return (
    <div className="flex flex-row justify-between items-center">
      <Link href={constructNavUrl("/", network, address)}>
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
              {availableNetworks.sort().map((network) => (
                <SelectItem key={network} value={network}>
                  {selectChainNameFromNetwork(network)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button asChild size="icon" variant="outline">
          <Link href={constructNavUrl("/settings", network, address)}>
            <Settings className="w-6 h-6" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
