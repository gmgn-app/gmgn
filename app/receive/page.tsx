"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import QRCode from "react-qr-code";
import { truncateAddress } from "@/lib/utils";
import WalletCopyButton from "@/components/wallet-copy-button";
import { Address } from "viem";

export default function ReceivePage() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const network = searchParams.get("network");

  return (
    <div className="flex flex-col gap-12 p-4 w-screen md:w-[768px]">
      <Link href="/">
        <Image
          src="/gmgn-logo.svg"
          alt="gmgn logo"
          width={40}
          height={40}
          className="rounded-md"
        />
      </Link>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Receive
      </h1>
      <div className="flex flex-col items-center">
        <QRCode
          className="mt-4"
          size={256}
          value={
            address ? address : "0x000000000000000000000000000000000000dEaD"
          }
          viewBox={`0 0 256 256`}
        />
      </div>
      <WalletCopyButton
        copyText={address ? address : "0x000000000000000000000000000000000000dEaD"}
        buttonTitle={truncateAddress(address as Address, 6)}
      />
    </div>
  );
}
