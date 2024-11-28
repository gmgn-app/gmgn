"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { House, Repeat, Sprout, Blocks, List } from "lucide-react";


export default function NavBar() {
  const pathname = usePathname();

  function isActivePath(path: string) {
    if (path === pathname) {
      return "text-primary border-primary";
    } else {
      return "text-gray-400";
    }
  }

  return (
    <div className="grid grid-cols-5 fixed bottom-0 left-0 md:left-auto w-full md:w-[768px] h-[80px] bg-white">
      <Button
        className={`flex flex-col justify-start ${isActivePath(
          "/"
        )} rounded-none border-t-2 h-full`}
        variant="ghost"
        asChild
      >
        <Link href="/">
          <House className="w-6 h-6" />
        </Link>
      </Button>
      <Button
        className={`flex flex-col justify-start ${isActivePath(
          "/trade"
        )} rounded-none border-t-2 h-full`}
        variant="ghost"
        asChild
      >
        <Link href="/trade">
          <Repeat className="w-6 h-6" />
        </Link>
      </Button>
      <Button
        className={`flex flex-col justify-start ${isActivePath(
          "/earn"
        )} rounded-none border-t-2 h-full`}
        variant="ghost"
        asChild
      >
        <Link href="/earn">
          <Sprout className="w-6 h-6" />
        </Link>
      </Button>
      <Button
        className={`flex flex-col justify-start ${isActivePath(
          "/transactions"
        )} rounded-none border-t-2 h-full`}
        variant="ghost"
        asChild
      >
        <Link href="/transactions">
          <List className="w-6 h-6" />
        </Link>
      </Button>
      <Button
        className={`flex flex-col justify-start ${isActivePath(
          "/dapps"
        )} rounded-none border-t-2 h-full`}
        variant="ghost"
        asChild
      >
        <Link href="/dapps">
          <Blocks className="w-6 h-6" />
        </Link>
      </Button>
    </div>
  );
}
