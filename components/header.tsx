import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useAtomValue } from 'jotai';
import { evmAddressAtom, polkadotAddressAtom } from "@/components/wallet-management";

export default function Header() {
  const evmAddress = useAtomValue(evmAddressAtom);
  const polkadotAddress = useAtomValue(polkadotAddressAtom);

  return (
    <div className="flex flex-row justify-between items-center">
      <Link href="/">
        <Image
          src="/gmgn-logo.svg"
          alt="gmgn logo"
          width={40}
          height={40}
          className="rounded-md"
        />
      </Link>
      <div className="flex flex-row items-center gap-4">
        {evmAddress && polkadotAddress ? (
          <Button asChild size="icon">
            <Link href="/connect">
              <Image
                src="/walletconnect-logo.svg"
                alt="walletconnect logo"
                width={24}
                height={24}
              />
            </Link>
          </Button>
        ) : (
          <Button size="icon" disabled className="text-blue-400">
            <Image
              src="/walletconnect-logo.svg"
              alt="walletconnect logo"
              width={24}
              height={24}
            />
          </Button>
        )}
        <Button asChild size="icon" variant="outline">
          <Link href="/settings">
            <Settings className="w-6 h-6" />
          </Link>
        </Button>
      </div>  
    </div>
  );
}
