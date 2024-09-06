"use client";
 
import { useState } from "react";
import { Copy, Check } from 'lucide-react';
import { Button } from "./ui/button";
 
export default function WalletCopyButton({text}: {text: string}) {
  const [isCopied, setIsCopied] = useState(false);
 
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
 
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
 
  return (
    <Button variant="ghost" size="icon" disabled={isCopied} onClick={copy}>
      {isCopied ?
        <div className="flex flex-row gap-2 items-center">
          <Check className="h-4 w-4" />
        </div> 
        
        : 
        <div className="flex flex-row gap-2 items-center">
          <Copy className="h-4 w-4" />
        </div>
      }
    </Button>
  );
};