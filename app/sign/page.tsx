"use client";

import SignMessageDialog from '@/components/sign-message-dialog';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Page() {
  return (
    <div className="flex flex-col gap-12">
      <ConnectButton />
      <SignMessageDialog />
    </div>
  );
}
