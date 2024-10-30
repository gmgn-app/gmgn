"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { constructNavUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CreditCard } from 'lucide-react';


export default function MoreBlocks() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const network = searchParams.get("network");

  return (
    <div className="flex flex-col gap-4 w-full">
      <Link href={constructNavUrl("/on-off-ramp", network, address)}>
        <div className="flex flex-col gap-2 border-2 border-primary p-4 rounded-md">
          <div className="flex flex-row gap-2 items-center">
            <CreditCard className="w-4 h-4" />
            <h2>On/Off Ramp</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Fund your wallet from your bank account or cash out
          </p>
        </div>
      </Link>
      <a href="https://docs.gmgn.app/getting-started" target="_blank">
        <div className="flex flex-col gap-2 border-2 border-primary p-4 rounded-md">
          <div className="flex flex-row gap-2 items-center">
            <h2>Getting started</h2>
            <ExternalLink className="w-4 h-4" />
          </div>
          <p className="text-muted-foreground text-sm">
            Master GM GN wallet, unlock rewards and opportunities
          </p>
        </div>
      </a>
      <div className="flex flex-col gap-2 border-2 border-primary p-4 rounded-md">
        <div className="flex flex-row gap-2">
          <h2>Intern</h2>
          <Badge>coming soon</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Learn about the world of blockchains and cryptocurrencies
        </p>
      </div>
    </div>
  );
}
