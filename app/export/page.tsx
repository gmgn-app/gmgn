"use client";

import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { ScanEye, CircleArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function DeletePage() {
  const { toast } = useToast();

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
        Export wallet
      </h1>
      <BackButton route={null} />
      <h2 className="text-2xl font-semibold mt-6">
        When you export wallet, you will see your private key. Make sure to only do this in a private place.
      </h2>
      <div className="flex flex-col gap-24">
        <Button variant="destructive">
          <ScanEye className="w-4 h-4 mr-2" />
          Yes! Show me my private key
        </Button>
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
