"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Address, fromBytes, toHex } from "viem";
import {
  Clock,
  Loader2,
  Signature,
  UserPen,
  OctagonAlert,
  Hash,
  Link,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CopyButton from "./copy-button";
import { useSearchParams } from "next/navigation";
import { getOrThrow } from "@/lib/passkey-auth";
import { privateKeyToAccount } from "viem/accounts";


// Define the form schema.
const formSchema = z.object({
  txMessage: z.string().min(1, {
    message: "Message must be at least 1 characters.",
  }),
});

type SignatureObject = {
  address: Address | undefined;
  timestamp: number;
  signature: `0x${string}` | undefined;
};

export default function SignForm() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const network = searchParams.get("network");
  const [signature, setSignature] = useState("");
  const [submittedAt, setSubmittedAt] = useState(0);


  // Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      txMessage: "",
    },
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    /**
     * Retrieve the handle to the private key from some unauthenticated storage
     */
    const cache = await caches.open("gmgn-storage");
    const request = new Request("gmgn-wallet");
    const response = await cache.match(request);
    const handle = response
      ? new Uint8Array(await response.arrayBuffer())
      : new Uint8Array();
    /**
     * Retrieve the private key from authenticated storage
     */
    const bytes = await getOrThrow(handle);
    const privateKey = fromBytes(bytes, "hex");
    if (privateKey) {
      const account = privateKeyToAccount(privateKey as Address);
      const signature = await account.signMessage({
        // Hex data representation of message.
        message: { 
          raw: toHex(values.txMessage), 
        },
      })
      const submittedAt = Date.now();
      setSignature(signature);
      setSubmittedAt(submittedAt);
    }
  }

  function onReset() {
    form.reset();
  }

  // Truncate the address for display.
  function truncateAddress(
    address: Address | undefined,
    numberOfChars: number
  ) {
    if (!address) return "No address";
    let convertedAddress = address.toString();
    return `${convertedAddress.slice(
      0,
      numberOfChars
    )}...${convertedAddress.slice(-numberOfChars)}`;
  }

  // Truncate the hash for display
  function truncateHash(address: String | undefined, numberOfChars: number) {
    if (!address) return "No address";
    let convertedAddress = address.toString();
    return `${convertedAddress.slice(
      0,
      numberOfChars
    )}...${convertedAddress.slice(-numberOfChars)}`;
  }

  function unixTimestampToDateTime(unixTimestamp: number) {
    const date = new Date(unixTimestamp);
    return date.toLocaleString ? date.toLocaleString() : date.toUTCString();
  }

  function constructLink(signatureObject: SignatureObject) {
    const baseUrl = "https://gmgn.app/signature";
    const signatureString =
      baseUrl +
      "?account=" +
      signatureObject.address +
      "&timestamp=" +
      signatureObject.timestamp +
      "&signature=" +
      signatureObject.signature;
    return signatureString;
  }

  return (
    <div className="flex flex-col gap-8 w-[300px] md:w-[600px] lg:w-[900px]">
      <div className="flex flex-col w-full h-full border-black border-2 rounded-md bg-white p-4">
        <h2 className="text-3xl font-semibold mb-8">Message</h2>
        <Form {...form}>
          <form
            onReset={form.handleSubmit(onReset)}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="txMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <Textarea
                      className="rounded-none w-full h-36 border-black border-2 p-2.5"
                      placeholder="Enter your text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the text you want to sign.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row justify-between items-center">
              <Button
                variant="outline"
                className="w-18 rounded-md border-black border-2 p-2.5"
                type="reset"
              >
                Clear
              </Button>
              <Button
                className="w-36 rounded-md border-black border-2 p-2.5"
                type="submit"
              >
                <Signature className="mr-2 h-4 w-4" />
                Sign
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="flex flex-col w-full border-black border-2 rounded-md p-4">
        <h2 className="text-3xl font-semibold mb-4">Signature</h2>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="flex flex-row items-center">
              <UserPen className="mr-2 h-4 w-4" />
              Signed by
            </p>
            <Input
              className="rounded-none w-full border-black border-2 p-2.5"
              placeholder="0x..."
              value={address ? truncateAddress(address as Address, 6) : "No address"}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="flex flex-row items-center">
              <Clock className="mr-2 h-4 w-4" />
              At
            </p>
            <Input
              className="rounded-none w-full border-black border-2 p-2.5"
              placeholder="0x..."
              value={unixTimestampToDateTime(submittedAt)}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="flex flex-row items-center">
              <Hash className="mr-2 h-4 w-4" />
              Hash
            </p>
            <Textarea
              className="rounded-none w-full h-36 border-black border-2 p-2.5"
              placeholder="Enter your message"
              value={signature ? truncateHash(signature, 6) : "No signature"}
              readOnly
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full border-black border-2 rounded-md p-4">
        <h2 className="text-3xl font-semibold mb-4">Share</h2>
        <div className="flex flex-row gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Link className="mr-2 h-4 w-4" />
                Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>You can share this link</DialogTitle>
                <DialogDescription>
                  <Input
                    className="rounded-none w-full border-black border-2 p-2.5 mt-2"
                    value={constructLink({
                      address: address as Address,
                      timestamp: submittedAt,
                      signature: signature as `0x${string}`,
                    })}
                    readOnly
                  />
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <CopyButton
                  text={constructLink({
                    address: address as Address,
                    timestamp: submittedAt,
                    signature: signature as `0x${string}`,
                  })}
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Hash className="mr-2 h-4 w-4" />
                Hash
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>You can share this text</DialogTitle>
                <DialogDescription>
                  <Input
                    className="rounded-none w-full border-black border-2 p-2.5 mt-2"
                    value={signature}
                    readOnly
                  />
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <CopyButton text={signature ? signature : "none"} />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
