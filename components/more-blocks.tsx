"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { constructNavUrl } from "@/lib/utils";

export default function MoreBlocks() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const network = searchParams.get("network");

  return (
    <div className="flex flex-col gap-4 w-full">
      <Link href={constructNavUrl("/on-off-ramp", network, address)}>
        <div className="flex flex-col gap-2 border-2 border-primary p-4 rounded-md">
          <h2>On/Off Ramp</h2>
          <p className="text-muted-foreground text-sm">
            Fund your wallet from your bank account or cash out
          </p>
        </div>
      </Link>
      <Link href={constructNavUrl("/getting-started", network, address)}>
        <div className="flex flex-col gap-2 border-2 border-primary p-4 rounded-md">
          <h2>Getting started</h2>
          <p className="text-muted-foreground text-sm">
            Master GM GN wallet, unlock rewards and opportunities
          </p>
        </div>
      </Link>
      <Link href={constructNavUrl("/learn", network, address)}>
        <div className="flex flex-col gap-2 border-2 border-primary p-4 rounded-md">
          <h2>Learn</h2>
          <p className="text-muted-foreground text-sm">
            Explore the world of blockchains and cryptocurrencies
          </p>
        </div>
      </Link>
    </div>
  );
}
