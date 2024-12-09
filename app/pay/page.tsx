"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import BackButton from "@/components/back-button"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight, ClipboardPaste, Check, ScanLine, ThumbsUp, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Scanner } from "@yudiel/react-qr-scanner";
import Header from "@/components/header";
import { availableNetworksAtom, evmAddressAtom, polkadotAddressAtom } from "@/components/wallet-management";
import { useAtom, useAtomValue } from 'jotai';


export default function PayPage() {
  // Set the router object
  const router = useRouter();

  // Get the available networks, last selected network, and addresses from the wallet management atoms
  const evmAddress = useAtomValue(evmAddressAtom);
  const polkadotAddress = useAtomValue(polkadotAddressAtom);

  // Set the payment link state
  const [paymentLink, setPaymentLink] = useState("");

  // Set the QR scan success state
  const [qrScanSuccess, setQrScanSuccess] = useState(false);
  const [isQrScanOpen, setIsQrScanOpen] = useState(false);

  // Function to handle the QR scan
  function handleQrScan(data: string) {
    if (data) {
      setPaymentLink(data);
      setQrScanSuccess(true);
      // delay the success message for 2 seconds
      setTimeout(() => {
        setQrScanSuccess(false);
        setIsQrScanOpen(false);
      }, 500);
    }
  }

  // Set the paste state
  const [isPasted, setIsPasted] = useState(false);
 
  // Function to paste the payment link from the clipboard
  const paste = async () => {
    setPaymentLink(await navigator.clipboard.readText());
    setIsPasted(true);
 
    setTimeout(() => {
      setIsPasted(false);
    }, 1000);
  };
 
  // Toast notifications.
  const { toast } = useToast();

  // Function to handle the payment
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
    // check if the query params contain the token
    if (!queryObject.token) {
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
    router.push(`/paylink?${paymentConfig}`);
  }

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Pay
      </h1>
      <BackButton route="/" />
      <div className="flex flex-col gap-2 mt-12">
        <Label htmlFor="sendingAmount">Payment link</Label>
        <div className="flex flex-row gap-2 items-center">
          <Input
            id="paymentLink"
            placeholder="Enter payment link"
            type="text"
            required
            className="rounded-none w-full border-primary border-2 p-2.5 mt-2 text-lg"
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
          <Dialog open={isQrScanOpen} onOpenChange={setIsQrScanOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="icon">
                  <ScanLine className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>QR Scanner</DialogTitle>
                  <DialogDescription>
                    Scan QR code to autofill
                  </DialogDescription>
                </DialogHeader>
                <Scanner
                  onScan={(result) => handleQrScan(result[0].rawValue)}
                />
                <DialogFooter>
                  <div className="flex flex-col items-center justify-center">
                    {qrScanSuccess ? (
                      <p className="flex flex-row gap-2 text-blue-600">
                        <ThumbsUp className="h-6 w-6" />
                        Scan completed. Exit to continue.
                      </p>
                    ) : (
                      <p className="flex flex-row gap-2 text-yellow-600">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Scanning...
                      </p>
                    )}
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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