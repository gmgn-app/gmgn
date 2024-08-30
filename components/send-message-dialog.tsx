"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  type BaseError,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useChainId
} from "wagmi";
import { toHex } from "viem";
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
import { isAddress, Address } from "viem";
import { Send, Loader2, Hash, CircleCheck, OctagonAlert } from 'lucide-react';

// Define the form schema.
const formSchema = z.object({
  address: z.string().refine((value) => isAddress(value), {
    message: "Provided address is invalid.",
  }),
  txMessage: z.string().min(1, {
    message: "Message must be at least 1 characters.",
  }),
});

export default function SendMessageDialog() {

  // setup the send transaction hook
  const {
    data: hash,
    error,
    isPending,
    sendTransaction,
  } = useSendTransaction();

  // setup the chainId hook
  const chainId = useChainId();

  // Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: undefined,
      txMessage: "",
    },
  });

  // Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    sendTransaction({
      to: values.address,
      data: toHex(values.txMessage),
    });
  }

  function onReset() {
    form.reset();
  }

  // 3. Use the `useWaitForTransactionReceipt` hook to wait for the transaction to be confirmed.
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Truncate the address for display.
  function truncateAddress(address: Address | undefined, numberOfChars: number) {
    if (!address) return "No address";
    let convertedAddress = address.toString();
    return `${convertedAddress.slice(0, numberOfChars)}...${convertedAddress.slice(-numberOfChars)}`;
  }

  // Truncate the hash for display
  function truncateHash(address: String | undefined, numberOfChars: number) {
    if (!address) return "No address";
    let convertedAddress = address.toString();
    return `${convertedAddress.slice(0, numberOfChars)}...${convertedAddress.slice(-numberOfChars)}`;
  }

  // Select the explorer link based on the chainId
  function selectExplorerLink(chainId: number) {
    switch (chainId) {
      case 8217:
        return "https://kaiascan.io/tx/";
      case 1001:
        return "https://kairos.kaiascan.io/tx/";
      default:
        return "https://etherscan.io/tx/";
    }
  }


  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col w-full h-full border-black border-2 rounded-md bg-white p-4">
        <h2 className="text-3xl font-semibold mb-8">Message</h2>
        <Form {...form}>
          <form onReset={form.handleSubmit(onReset)} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-none w-full border-black border-2 p-2.5"
                      placeholder="0x..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the address you want to send message to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              <Button variant="outline" className="w-18 rounded-md border-black border-2 p-2.5" type="reset">Clear</Button>
              <Button className="w-36 rounded-md border-black border-2 p-2.5" disabled={isPending} type="submit">
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</> : <><Send className="mr-2 h-4 w-4" /> Send</>}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="flex flex-col w-full h-48 border-black border-2 rounded-md p-4">
        <h2 className="text-3xl font-semibold mb-4">Status</h2>
        <p className="flex flex-row items-center mb-2"><Hash className="mr-2 h-4 w-4" />Tx Hash: {hash ? <a className="ml-2 underline underline-offset-2 text-blue-500" href={`${selectExplorerLink(chainId)}${hash}`}>{truncateHash(hash, 6)}</a> : "No transaction yet."}</p>
        {isConfirming && <p className="flex flex-row items-center text-yellow-500"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Waiting for confirmation...</p>}
        {isConfirmed && <p className="flex flex-row items-center text-green-500"><CircleCheck className="mr-2 h-4 w-4" />Transaction confirmed!</p>}
        {error && (
          <p className="flex flex-row items-center text-red-500"><OctagonAlert className="mr-2 h-4 w-4" />Error: {(error as BaseError).shortMessage || error.message}</p>
        )}
      </div>
    </div>
  );
}
