"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import BackButton from "@/components/back-button";
import RequestForm from "@/components/request-form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function RequestPage() {
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
        Request
      </h1>
      <BackButton route={"/"} />
      <Tabs defaultValue="request" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger asChild value="receive">
            <Link href={`/receive?network=${network}&address=${address}`}>
              Receive
            </Link>
          </TabsTrigger>
          <TabsTrigger value="request">
            Request
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <RequestForm />
    </div>
  );
}
