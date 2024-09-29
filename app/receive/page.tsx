"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import QRCode from "react-qr-code";
import { truncateAddress, selectChainNameFromNetwork } from "@/lib/utils";
import WalletCopyButton from "@/components/wallet-copy-button";
import { Address } from "viem";
import BackButton from "@/components/back-button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReceivePage() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const network = searchParams.get("network");

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
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
      <BackButton route={"/"} />
      <Tabs defaultValue="receive" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="receive">
            Receive
          </TabsTrigger>
          <TabsTrigger asChild value="request">
            <Link href={`/request?network=${network}&address=${address}`}>
              Request
            </Link>
            </TabsTrigger>
        </TabsList>
      </Tabs>
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
      <div className="flex flex-col gap-4 items-center">
        <WalletCopyButton
          copyText={
            address ? address : "0x000000000000000000000000000000000000dEaD"
          }
          buttonTitle={truncateAddress(address as Address, 6)}
        />
        <p className="underline underline-offset-4">
          {selectChainNameFromNetwork(network)}
        </p>
      </div>
      <div className="flex flex-col gap-4 items-center text-center p-8 text-sm">
        <p>
          You can receive tokens & NFTs on Ethereum Sepolia, Arbitrum Sepolia,
          Base Sepolia, Kaia Kairos.
        </p>
        <Link className="text-blue-500" href="/learn">
          Learn more
        </Link>
      </div>
    </div>
  );
}
