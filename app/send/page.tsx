"use client";

import { useSearchParams } from "next/navigation";
import SendTransactionForm from "@/components/send-transaction-form";
import Link from "next/link";
import BackButton from "@/components/back-button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import { constructNavUrl } from "@/lib/utils";


export default function SendPage() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const network = searchParams.get("network");

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Send
      </h1>
      <BackButton route={constructNavUrl("/", network, address)} />
      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send">Send</TabsTrigger>
          <TabsTrigger asChild value="message">
            <Link href={constructNavUrl("/message", network, address)}>
              Message
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <SendTransactionForm />
    </div>
  );
}
