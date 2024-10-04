"use client";

import Link from "next/link"
import Image from "next/image"
import BackButton from "@/components/back-button"
import { Core } from '@walletconnect/core'
import { WalletKit, WalletKitTypes } from '@reown/walletkit'
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils'


export default async function ConnectPage() {

  const core = new Core({
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
  })
  
  const metadata = {
    name: "GMGN-wallet",
    description: "Vox Populi",
    url: 'https://www.gmgn.app/connect', // origin must match your domain & subdomain
    icons: ["/gmgn-logo.svg"],
  }

  const walletKit = await WalletKit.init({
    core, // <- pass the shared 'core' instance
    metadata
  })
  

  async function onSessionProposal({ id, params }: WalletKitTypes.SessionProposal){
    try {
      // ------- namespaces builder util ------------ //
      const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces: {
          eip155: {
            chains: ['eip155:1', 'eip155:137'],
            methods: ['eth_sendTransaction', 'personal_sign'],
            events: ['accountsChanged', 'chainChanged'],
            accounts: [
              'eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb',
              'eip155:137:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb'
            ]
          }
        }
      })
      // ------- end namespaces builder util ------------ //
  
      const session = await walletKit.approveSession({
        id,
        namespaces: approvedNamespaces
      })
    } catch(error) {
      await walletKit.rejectSession({
        id: id,
        reason: getSdkError("USER_REJECTED")
      })
    }
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
        Connect
      </h1>
      <BackButton route={"/"} />
    </div>
  )
}