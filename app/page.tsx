"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import SendMessageDialog from "@/components/send-message-dialog";

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <ConnectButton />
      <SendMessageDialog />
    </div>
  );
}
