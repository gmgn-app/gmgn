"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link"
import Image from "next/image"
import BackButton from "@/components/back-button"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight, ClipboardPaste, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";


export default function PayPage() {
  const router = useRouter();
  // Get the search params from the URL.

  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const [paymentLink, setPaymentLink] = useState("");

  const [isPasted, setIsPasted] = useState(false);
 
  const paste = async () => {
    setPaymentLink(await navigator.clipboard.readText());
    setIsPasted(true);
 
    setTimeout(() => {
      setIsPasted(false);
    }, 1000);
  };
 
  // Toast notifications.
  const { toast } = useToast();

  function handlePay() {
    // split the payment link into multiple parts
    const paymentLinkParts = paymentLink.split("/");
    // Check the https: of the link
    if (paymentLinkParts[0] !== "http:" && paymentLinkParts[0] !== "https:") {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You entered an invalid payment link.",
        description: "Please enter a correct payment link to continue.",
      });
      return;
    }
    // check the domain of the link
    if (paymentLinkParts[2] !== `${process.env.NEXT_PUBLIC_BASE_URL}`.split("/").pop()) {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You entered an invalid payment link.",
        description: "Please enter a correct payment link to continue.",
      });
      return;
    }
    // check the path of the link
    if (paymentLinkParts[3] === "") {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You entered an invalid payment link.",
        description: "Please enter a correct payment link to continue.",
      });
      return;
    }
    // check the query params of the link
    // get the route of the paymentLinkParts[3]
    const route = paymentLinkParts[3].split("?").shift();
    // get the query params of the paymentLinkParts[3]
    const queryParams = paymentLinkParts[3].split("?").pop();
    // check if the route is pay
    if (route !== "pay") {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You entered an invalid payment link.",
        description: "Please enter a correct payment link to continue.",
      });
      return;
    }
    // check if the query params are empty
    if (queryParams === "") {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You entered an invalid payment link.",
        description: "Please enter a correct payment link to continue.",
      });
      return;
    }
    // convert the query params to an object
    const queryObject = JSON.parse(
      `{"${queryParams!.replace(/&/g, '","').replace(/=/g,'":"')}"}`
    );
    console.log(queryObject);
    // check if the query params contain the network
    if (!queryObject.network) {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You entered an invalid payment link.",
        description: "Please enter a correct payment link to continue.",
      });
      return;
    }
    // check if the query params contain the sendingAmount
    if (!queryObject.sendingAmount) {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You entered an invalid payment link.",
        description: "Please enter a correct payment link to continue.",
      });
      return;
    }
    // check if the query params contain the receivingAddress
    if (!queryObject.receivingAddress) {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You entered an invalid payment link.",
        description: "Please enter a correct payment link to continue.",
      });
      return;
    }
    // check if the query params contain the transactionMemo
    if (!queryObject.transactionMemo) {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You entered an invalid payment link.",
        description: "Please enter a correct payment link to continue.",
      });
      return;
    }
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
      <BackButton route={"/"} />
      <div className="flex flex-col gap-2 mt-12">
        <Label htmlFor="sendingAmount">Payment Link</Label>
        <div className="flex flex-row gap-2 items-center">
          <Input
            id="paymentLink"
            placeholder="Enter payment link"
            type="text"
            required
            value={paymentLink}
            onChange={(e) => setPaymentLink(e.target.value)}
            />
          <Button variant="secondary" size="icon" disabled={isPasted} onClick={paste}>
            {isPasted ?
              <Check className="h-4 w-4" />
              : 
              <ClipboardPaste className="h-4 w-4" />
            }
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Fill in the payment link that you have received.
        </p>
        <Button className="mt-6" onClick={handlePay}>
          Proceed
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}