"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function MoreBlocks() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const network = searchParams.get("network");

  return (
    <div className="flex flex-col gap-4 w-full">
      <Link href={`/getting-started?network=${network}&address=${address}`}>
        <div className="flex flex-col gap-2 border-2 border-primary p-4 rounded-md">
          <h2>Getting started</h2>
          <p className="text-muted-foreground text-sm">Master GM GN wallet, unlock rewards and opportunities</p>
        </div>
      </Link>
      <Link href={`/learn?network=${network}&address=${address}`}>
        <div className="flex flex-col gap-2 border-2 border-primary p-4 rounded-md">
          <h2>Learn</h2>
          <p className="text-muted-foreground text-sm">Explore the world of blockchains and cryptocurrencies</p>
        </div>
      </Link>
    </div>

  )
}