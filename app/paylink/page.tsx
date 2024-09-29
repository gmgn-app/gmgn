"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link"
import Image from "next/image"
import BackButton from "@/components/back-button"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function PayPage() {
  const router = useRouter();
  // Get the search params from the URL.
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const [paymentLink, setPaymentLink] = useState("");

  function handlePay() {
    // with payment link, remove everythink left of the last slash
    const paymentConfig = paymentLink.split("?").pop();
    const newPaymentConfig = paymentConfig + `&address=${address}`;
    router.push(`/pay?${newPaymentConfig}`);
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
        Pay
      </h1>
      <BackButton route={null} />
      <div className="flex flex-col gap-2">
        <Input
          placeholder="Enter payment link"
          type="text"
          required
          value={paymentLink}
          onChange={(e) => setPaymentLink(e.target.value)}
          />
        <Button onClick={handlePay}>Proceed</Button>
      </div>
    </div>
  )
}