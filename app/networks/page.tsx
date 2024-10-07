"use client";

import { useState, useEffect } from "react";
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
import { GMGN_NETWORKS, selectChainNameFromNetwork, constructNavUrl } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function NetworksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const network = searchParams.get("network");
  const [availableNetworks, setAvailableNetworks] = useState(GMGN_NETWORKS);

  useEffect(() => {
    // Get the available networks from the user local storage.
    const GMGN_AVAILABLE_NETWORKS = JSON.parse(localStorage.getItem("gmgn-available-networks")!);
    setAvailableNetworks(GMGN_AVAILABLE_NETWORKS);
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

  function handleChangeActiveNetwork(network: string) {
    let newAvailableNetworks = [...availableNetworks];
    if (newAvailableNetworks.includes(network)) {
      newAvailableNetworks = newAvailableNetworks.filter(n => n !== network);
    } else {
      newAvailableNetworks.push(network);
    }
    setAvailableNetworks(newAvailableNetworks);
    console.log(newAvailableNetworks);
  }

  function handleSaveAvailableNetworks() {
    console.log(availableNetworks);
    // Save the available networks to the user local storage.
    localStorage.setItem("gmgn-available-networks", JSON.stringify(availableNetworks.sort()));
  }

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Link href={constructNavUrl(network, address)}>
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
      <BackButton route={constructNavUrl(network, address)} />
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
              {availableNetworks.sort().map((network) => (
                <SelectItem key={network} value={network}>
                  {selectChainNameFromNetwork(network)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={handleSaveDefaultNetwork} className="w-fit self-end">
          <Save className="mr-2 w-4 h-4" />
          Save default network
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <h2>Available networks</h2>
        <div className="flex flex-col gap-2">
          {GMGN_NETWORKS.map((network) => (
            <div key={network} className="flex flex-row items-center justify-between">
              <h3>{selectChainNameFromNetwork(network)}</h3>
              <div className="flex flex-row gap-2 items-center">
                <Switch
                  checked={availableNetworks.includes(network)}
                  onCheckedChange={() => handleChangeActiveNetwork(network)}
                />
                <Label htmlFor="active-network">Active</Label>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={handleSaveAvailableNetworks} className="w-fit self-end">
          <Save className="mr-2 w-4 h-4" />
          Save available networks
        </Button>
      </div>
    </div>
  );
}
