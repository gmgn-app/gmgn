"use client";

import Image from "next/image";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  type BaseError,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { toHex, fromHex } from "viem";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const {
    data: hash,
    error,
    isPending,
    sendTransaction,
  } = useSendTransaction();
  const [message, setMessage] = useState("");

  function submitAndSendMessage() {
    sendTransaction({
      to: "0x1B7a0b3E366CC0549A96ED4123E8058d59282f3f",
      data: toHex(message),
    });
  }

  function handleInputMessage(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
  useWaitForTransactionReceipt({ 
    hash, 
  }) 

  return (
    <div>
      <ConnectButton />
      <h1>GMGN</h1>
      <Textarea
        value={message}
        onChange={handleInputMessage}
        placeholder="Enter your message"
      />
      <Button onClick={submitAndSendMessage}>Send message</Button>
      {hash && <div>Transaction Hash: {hash}</div>} 
      {isConfirming && <div>Waiting for confirmation...</div>} 
      {isConfirmed && <div>Transaction confirmed.</div>} 
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
  );
}
