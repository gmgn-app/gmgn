"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import SendMessageDialog from "@/components/send-message-dialog";

export default function Page() {
  return (
    <div className="flex flex-col gap-12 items-center">
      <ConnectButton />
      <SendMessageDialog />
    </div>
  );
}
