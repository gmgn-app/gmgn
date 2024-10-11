"use client";

import { useSearchParams } from "next/navigation";
import BackButton from "@/components/back-button"
import PayForm from "@/components/pay-form"
import { constructNavUrl } from "@/lib/utils"
import Header from "@/components/header";


export default function PayPage() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const network = searchParams.get("network");

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Pay
      </h1>
      <BackButton route={constructNavUrl("/", network, address)} />
      <PayForm />
    </div>
  )
}