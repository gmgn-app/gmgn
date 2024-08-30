"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSendTransaction } from "wagmi";
import { useSignMessage } from "wagmi";
import { toHex, fromHex } from "viem";

export default function Home() {
  const { sendTransaction } = useSendTransaction();
  const { signMessage } = useSignMessage();
  const message =
    "went to get a new email, then cross-sold myself into the pass manager, drive, and vpn since they give big discounts for bundling \n OSS + commodity, turned into -> good business with a sticky platform and brand";
  function submitAndSendMessage() {
    sendTransaction({
      to: "0x1B7a0b3E366CC0549A96ED4123E8058d59282f3f",
      data: toHex(message),
    });
    console.log(fromHex(toHex(message), "string"));
  }

  return (
    <div>
      <ConnectButton />
      <h1>GMGN</h1>
      <button onClick={submitAndSendMessage}>Send message</button>
    </div>
  );
}
