"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/back-button";
import { Core } from "@walletconnect/core";
import { WalletKit, WalletKitTypes } from "@reown/walletkit";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { SignClientTypes } from "@walletconnect/types";
import { redirect, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { constructNavUrl } from "@/lib/utils";
import Header from "@/components/header";


export default function ConnectPage() {

  // Get the search params from the URL.
  const searchParams = useSearchParams();
  const network = searchParams.get("network");
  const address = searchParams.get("address");

  if (!network || !address) {
    redirect(constructNavUrl("/", network, address));
  }

  const router = useRouter();
  // Get the toast function from the useToast hook.
  const { toast } = useToast();

  const [isLoadingApprove, setIsLoadingApprove] = useState(false)
  const [isLoadingReject, setIsLoadingReject] = useState(false)
  const [wcWalletKit, setWcWalletKit] = useState<any>(null)
  const [wcSessionString, setWcSessionString] = useState<string>("")

  const core = new Core({
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
  })
  
  const metadata = {
    name: "GMGN-wallet",
    description: "Vox Populi",
    url: 'https://www.gmgn.app/connect', // origin must match your domain & subdomain
    icons: ["/gmgn-logo.svg"],
  }

  

  // async function onSessionProposal({ id, params }: WalletKitTypes.SessionProposal){
  //   try {
  //     // ------- namespaces builder util ------------ //
  //     const approvedNamespaces = buildApprovedNamespaces({
  //       proposal: params,
  //       supportedNamespaces: {
  //         eip155: {
  //           chains: ['eip155:1001'],
  //           methods: ['eth_sendTransaction', 'personal_sign'],
  //           events: ['accountsChanged', 'chainChanged'],
  //           accounts: [
  //             'eip155:1001:0xB12Bbc1a89a202C85F5Fc222D589412388262e90'
  //           ]
  //         }
  //       }
  //     })
  //     // ------- end namespaces builder util ------------ //
  
  //     const session = await walletKit.approveSession({
  //       id,
  //       namespaces: approvedNamespaces
  //     })
  //   } catch(error) {
  //     await walletKit.rejectSession({
  //       id: id,
  //       reason: getSdkError("USER_REJECTED")
  //     })
  //   }
  // }
  
  async function handlePairing() {
    const walletKit = await WalletKit.init({
      core, // <- pass the shared 'core' instance
      metadata
    })
    setWcWalletKit(walletKit)
    await walletKit.pair({ uri: wcSessionString })
  }

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Connect
      </h1>
      <BackButton route={constructNavUrl("/", network, address)} />
      <Input
        value={wcSessionString}
        onChange={(e) => setWcSessionString(e.target.value)}
      />
      <Button onClick={handlePairing}>Connect</Button>
    </div>
  )
}