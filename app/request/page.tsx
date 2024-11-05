"use client";

import Link from "next/link";
import BackButton from "@/components/back-button";
import RequestForm from "@/components/request-form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/header";


export default function RequestPage() {

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Request
      </h1>
      <BackButton route="/" />
      <Tabs defaultValue="request" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger asChild value="receive">
            <Link href="/receive">
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
