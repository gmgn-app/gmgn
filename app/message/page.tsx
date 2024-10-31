"use client";

import Link from "next/link"
import { useSearchParams } from "next/navigation";
import Image from "next/image"
import BackButton from "@/components/back-button"
import MessageForm from "@/components/message-form"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";
import { constructNavUrl } from "@/lib/utils";


export default function MessagePage() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const network = searchParams.get("network");
  const token = searchParams.get("token");

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Message
      </h1>
      <BackButton route={constructNavUrl("/", network, address)} />
      <Tabs defaultValue="message" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger asChild value="send">
            <Link href={constructNavUrl("/send", network, address, token)}>
              Send
            </Link>
          </TabsTrigger>
          <TabsTrigger value="message">
            Message
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <MessageForm />
    </div>
  )
}