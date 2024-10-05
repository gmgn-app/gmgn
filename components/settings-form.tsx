"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, ScanEye, CloudCog } from "lucide-react";
import { constructNavUrl } from "@/lib/utils";

export default function SettingsForm() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const network = searchParams.get("network");

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl border-b pb-2 font-semibold">Networks</h2>
        <p className="text-sm font-medium leading-none text-muted-foreground">
          You can add, remove or change default networks
        </p>
        <Button className="w-[200px] mt-6" asChild>
          <Link href={`/networks?network=${network}&address=${address}`}>
            <CloudCog className="w-4 h-4 mr-2" />
            Proceed to change
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl border-b pb-2 font-semibold">Delete wallet</h2>
        <p className="text-sm font-medium leading-none text-muted-foreground">
          You can delete your wallet and create a new one
        </p>
        <Button className="w-[200px] mt-6" asChild variant="destructive">
          <Link href="/delete">
            <Trash2 className="w-4 h-4 mr-2" />
            Proceed to delete
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl border-b pb-2 font-semibold">Export wallet</h2>
        <p className="text-sm font-medium leading-none text-muted-foreground">
          You can export your private key
        </p>
        <Button className="w-[200px] mt-6" asChild>
          <Link href="/export">
            <ScanEye className="w-4 h-4 mr-2" />
            Proceed to export
          </Link>
        </Button>
      </div>
    </div>
  );
}
