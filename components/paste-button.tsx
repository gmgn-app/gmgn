"use client";
 
import { useState } from "react";
import { ClipboardPaste, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
 
export default function PasteButton() {
  const [isPasted, setIsPasted] = useState(false);
 
  const paste = async () => {
    await navigator.clipboard.readText();
    setIsPasted(true);
 
    setTimeout(() => {
      setIsPasted(false);
    }, 1000);
  };
 
  return (
    <Button className="w-fit" disabled={isPasted} onClick={paste}>
      {isPasted ?
        <div className="flex flex-row gap-2 items-center">
          <Check className="h-4 w-4" />
        </div> 
        
        : 
        <div className="flex flex-row gap-2 items-center">
          <ClipboardPaste className="h-4 w-4" />
        </div>
      }
    </Button>
  );
};