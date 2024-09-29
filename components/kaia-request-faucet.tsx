"use client";

import { Button } from "@/components/ui/button";
import { Droplets } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Address } from "viem";
import { useToast } from "@/hooks/use-toast";

export default function KaiaRequestFaucet({ address }: { address: Address | null | undefined }) {
  const { toast } = useToast();
  function requestFaucet() {
    fetch(
      "https://api-baobab.wallet.klaytn.com/faucet/run?address=" +
        address,
      { method: "POST" }
    )
      .then((res: any) => res.json())
      .then((data: any) => {
        if (data.result === "SUCCESS") {
          toast({
            className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
            description: "Request faucet success",
          });
        } else {
          toast({
            className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
            variant: "destructive",
            description: "Already requested faucet",
          });
        }
      })
      .catch((error) =>
        toast({
          className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
          variant: "destructive",
          description: `There was a problem with your request. Log: ${error}`,
        })
      );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Droplets className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request faucet</DialogTitle>
          <DialogDescription>
            You will request KLAY from the faucet to your address
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={requestFaucet}>
            Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}