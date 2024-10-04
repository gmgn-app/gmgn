"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { House, Repeat, Sprout, Telescope } from "lucide-react";

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
    <div className="grid grid-cols-4 fixed bottom-0 w-full md:w-[768px] h-[80px] bg-white">
      <Button
        className={`${isActivePath(
          "/"
        )} rounded-none border-t-2 h-full items-start`}
        variant="ghost"
      >
        <Link className="flex flex-col items-center" href="/">
          <House className="w-4 h-4 mr-2" />
          Home
        </Link>
      </Button>
      <Button
        className={`${isActivePath(
          "/trade"
        )} rounded-none border-t-2 h-full items-start`}
        variant="ghost"
      >
        <Link className="flex flex-col items-center" href="/trade">
          <Repeat className="w-4 h-4 mr-2" />
          Trade
        </Link>
      </Button>
      <Button
        className={`${isActivePath(
          "/earn"
        )} rounded-none border-t-2 h-full items-start`}
        variant="ghost"
      >
        <Link className="flex flex-col items-center" href="/earn">
          

          <Sprout className="w-4 h-4 mr-2" />
          Earn
        </Link>
      </Button>
      <Button
        className={`${isActivePath(
          "/explore"
        )} rounded-none border-t-2 h-full items-start`}
        variant="ghost"
      >
        <Link className="flex flex-col items-center" href="/explore">
          <Telescope className="w-4 h-4 mr-2" />
          Explore
        </Link>
      </Button>
    </div>
  );
}
