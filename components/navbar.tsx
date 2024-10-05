"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { House, Repeat, Sprout, Telescope } from "lucide-react";
import { constructNavUrl } from "@/lib/utils";

export default function NavBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const network = searchParams.get("network");

  function isActivePath(path: string) {
    if (path === pathname) {
      return "text-primary border-primary";
    } else {
      return "text-gray-400";
    }
  }

  return (
    <div className="grid grid-cols-4 fixed bottom-0 w-full md:w-[768px] h-[80px] bg-white">
      <Button
        className={`flex flex-col justify-start ${isActivePath(
          "/"
        )} rounded-none border-t-2 h-full`}
        variant="ghost"
        asChild
      >
        <Link href={constructNavUrl(network, address)}>
          <House className="w-4 h-4 mr-2" />
          Home
        </Link>
      </Button>
      <Button
        className={`flex flex-col justify-start ${isActivePath(
          "/trade"
        )} rounded-none border-t-2 h-full`}
        variant="ghost"
        asChild
        disabled
      >
        <Link href={`/trade?network=${network}&address=${address}`}>
          <Repeat className="w-4 h-4 mr-2" />
          Trade
        </Link>
      </Button>
      <Button
        className={`flex flex-col justify-start ${isActivePath(
          "/earn"
        )} rounded-none border-t-2 h-full`}
        variant="ghost"
        asChild
      >
        <Link href={`/earn?network=${network}&address=${address}`}>
          <Sprout className="w-4 h-4 mr-2" />
          Earn
        </Link>
      </Button>
      <Button
        className={`flex flex-col justify-start ${isActivePath(
          "/explore"
        )} rounded-none border-t-2 h-full`}
        variant="ghost"
        asChild
        disabled
      >
        <Link href={`/explore?network=${network}&address=${address}`}>
          <Telescope className="w-4 h-4 mr-2" />
          Explore
        </Link>
      </Button>
    </div>
  );
}
