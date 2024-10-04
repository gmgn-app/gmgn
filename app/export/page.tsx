"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/back-button";
import { useState } from "react";
import { fromBytes } from "viem";
import { WebAuthnStorage } from "@/lib/webauthnstorage";
import { Button } from "@/components/ui/button";
import { ScanEye, CircleArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import CopyButton from "@/components/copy-button";

export default function DeletePage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const network = searchParams.get("network");

  const [privateKey, setPrivateKey] = useState("");

  async function exportPrivateKey() {
    /**
     * Retrieve the handle to the private key from some unauthenticated storage
     */
    const cache = await caches.open("gmgn-storage");
    const request = new Request("gmgn-wallet");
    const response = await cache.match(request);
    const handle = response
      ? new Uint8Array(await response.arrayBuffer())
      : new Uint8Array();
    /**
     * Retrieve the private key from authenticated storage
     */
    const bytes = await WebAuthnStorage.getOrThrow(handle);
    const privateKey = fromBytes(bytes, "hex");
    if (privateKey) {
      let formattedPrivateKey = privateKey.slice(2);
      setPrivateKey(formattedPrivateKey);
      toast({
        title: "Private key exported!",
        description: "Make sure to store or view it in a safe place",
      });
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Link href={`/?network=${network}&address=${address}`}>
        <Image
          src="/gmgn-logo.svg"
          alt="gmgn logo"
          width={40}
          height={40}
          className="rounded-md"
        />
      </Link>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Export wallet
      </h1>
      <BackButton route={`/?network=${network}&address=${address}`} />
      <h2 className="text-2xl font-semibold mt-6">
        When you export wallet, you will see your private key. Make sure to only
        do this in a private place.
      </h2>
      <div className="flex flex-col gap-24">
        <div className="flex flex-col gap-4">
          <Button onClick={exportPrivateKey} variant="destructive">
            <ScanEye className="w-4 h-4 mr-2" />
            Yes! Show me my private key
          </Button>
          <Textarea
            placeholder="Your private key will appear here"
            rows={3}
            value={privateKey}
            readOnly
          />
          <CopyButton text={privateKey} />
        </div>

        <Button asChild>
          <Link href="/">
            <CircleArrowLeft className="w-4 h-4 mr-2" />
            No! Take me back
          </Link>
        </Button>
      </div>
    </div>
  );
}
