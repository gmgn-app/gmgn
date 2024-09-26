"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NavBar() {
  const pathname = usePathname();

  function isActivePath(path: string) {
    if (path === pathname) {
      return "text-blue-600 border-blue-600";
    }
  }

  return (
    <div className="grid grid-cols-4 fixed bottom-0 md:w-[768px] h-[80px]">
      <Button
        className={`${isActivePath(
          "/"
        )} rounded-none border-t-2 h-full items-start`}
        variant="ghost"
      >
        <Link href="/">Home</Link>
      </Button>
      <Button
        className={`${isActivePath(
          "/trade"
        )} rounded-none border-t-2 h-full items-start`}
        variant="ghost"
      >
        <Link href="/trade">Trade</Link>
      </Button>
      <Button
        className={`${isActivePath(
          "/collections"
        )} rounded-none border-t-2 h-full items-start`}
        variant="ghost"
      >
        <Link href="/collections">Collections</Link>
      </Button>
      <Button
        className={`${isActivePath(
          "/explore"
        )} rounded-none border-t-2 h-full items-start`}
        variant="ghost"
      >
        <Link href="/explore">Explore</Link>
      </Button>
    </div>
  );
}
