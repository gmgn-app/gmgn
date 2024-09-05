"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { type BaseError, useSignMessage, useAccount } from "wagmi";
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
import { Address, Account } from "viem";
import {
  Clock,
  Loader2,
  Signature,
  UserPen,
  OctagonAlert,
  Hash,
} from "lucide-react";

// Define the form schema.
const formSchema = z.object({
  txMessage: z.string().min(1, {
    message: "Message must be at least 1 characters.",
  }),
});

type SignatureObject = {
  account: Account | undefined | `0x${string}`;
  timestamp: number;
  signature: `0x${string}` | undefined;
};

export default function SignMessageDialog() {
  const account = useAccount();

  // setup the sign message hook
  const {
    data: hash,
    variables,
    submittedAt,
    error,
    isPending,
    signMessage,
  } = useSignMessage();

  // Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      txMessage: "",
    },
  });

  // Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    signMessage({
      account: account?.address,
      message: values.txMessage,
    });
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
    return date.toLocaleString
      ? date.toLocaleString()
      : date.toUTCString();
  }

  function constructLinkAndCopyToClipboard(signatureObject: SignatureObject) {
    const baseUrl = "https://gmgn.app/signature";
    const signatureString = "?account=" + signatureObject.account + "&timestamp=" + signatureObject.timestamp + "&signature=" + signatureObject.signature;
    navigator.clipboard.writeText(baseUrl + signatureString);
  }

  return (
    <div className="flex flex-col gap-8">
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
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      className="rounded-none w-full h-36 border-black border-2 p-2.5"
                      placeholder="Enter your message"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public message.
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
                disabled={isPending}
                type="submit"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  <>
                    <Signature className="mr-2 h-4 w-4" /> Sign
                  </>
                )}
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
              value={variables?.account?.toString()}
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
              value={hash}
              readOnly
            />
          </div>
        </div>
        {error && (
          <p className="flex flex-row items-center text-red-500">
            <OctagonAlert className="mr-2 h-4 w-4" />
            Error: {(error as BaseError).shortMessage || error.message}
          </p>
        )}
      </div>
      <div className="flex flex-col w-full border-black border-2 rounded-md p-4">
        <h2 className="text-3xl font-semibold mb-4">Share</h2>
        <div className="flex flex-row gap-2">
          <Button
            className="w-36 rounded-md border-black border-2 p-2.5"
            onClick={() => constructLinkAndCopyToClipboard({ account: variables?.account, timestamp: submittedAt, signature: hash })}
          >
            Share link
          </Button>
          <Button
            className="w-36 rounded-md border-black border-2 p-2.5"
            onClick={() => {
              navigator.clipboard.writeText(hash || "");
            }}
          >
            Share signature
          </Button>
        </div>
      </div>
    </div>
  );
}
