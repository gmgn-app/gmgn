"use client";

import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { OctagonX, CircleArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function DeletePage() {
  const { toast } = useToast();

  function deleteLocalWallet() {
    localStorage.removeItem("gmgn-wallet");
    toast({
      className:
        "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
      title: "Wallet deleted!",
      description: "Go back to home and refresh the page to create new wallet",
      action: (
        <ToastAction altText="Home">
          <Link href="/">Home</Link>
        </ToastAction>
      ),
    });
  }

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
        Delete wallet
      </h1>
      <BackButton route={null} />
      <h2 className="text-2xl font-semibold mt-6">
        This action is non-reversible, are you sure that you want to delete this
        wallet?
      </h2>
      <div className="flex flex-col gap-24">
        <Button onClick={deleteLocalWallet} variant="destructive">
          <OctagonX className="w-4 h-4 mr-2" />
          Yes! Delete the wallet now
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
