"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "./ui/button";

export default function WalletCopyButton({
  copyText,
  buttonTitle,
}: {
  copyText: string;
  buttonTitle: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(copyText);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <Button variant="ghost" disabled={isCopied} onClick={copy} className="pl-0">
      {isCopied ? (
        <div className="flex flex-row gap-1 items-center">
          {buttonTitle}
          <Check className="h-4 w-4" />
        </div>
      ) : (
        <div className="flex flex-row gap-1 items-center">
          {buttonTitle}
          <Copy className="h-4 w-4" />
        </div>
      )}
    </Button>
  );
}
