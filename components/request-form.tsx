"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toHex } from "viem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode, CirclePlus, Link, WandSparkles, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CopyButton from "@/components/copy-button";
import { createId } from "@paralleldrive/cuid2";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";

export default function RequestForm() {
  const router = useRouter();
  // Get the search params from the URL.
  const searchParams = useSearchParams();

  // Toast notifications.
  const { toast } = useToast();

  const [sendingAmount, setSendingAmount] = useState("");
  const [receivingAddress, setReceivingAddress] = useState(
    searchParams.get("address") ?? ""
  );
  const [transactionMemo, setTransactionMemo] = useState("");
  const [network, setNetwork] = useState<string>(
    searchParams.get("network") ?? "kaia-kairos"
  );
  const [requestLink, setRequestLink] = useState("");
  const [shareLinkActive, setShareLinkActive] = useState(false);

  function constructLink() {
    if (!receivingAddress) {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You did not enter a receiving address.",
        description: "Please enter a receiving address to continue.",
      });
      return;
    }
    if (!sendingAmount) {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You did not enter a sending amount.",
        description: "Please enter a sending amount to continue.",
      });
      return;
    }
    if (!transactionMemo) {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You did not enter a transaction memo.",
        description: "Please enter a transaction memo to continue.",
      });
      return;
    }
    const link = `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/pay?network=${network}&sendingAmount=${sendingAmount}&receivingAddress=${receivingAddress}&transactionMemo=${toHex(
      transactionMemo
    )}`;
    setRequestLink(link);
    setShareLinkActive(true);
    toast({
      className:
        "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
      title: "Link generated!",
      description: "You can now share this link with others.",
    });
  }

  function autogenerateUid() {
    const uid = createId();
    setTransactionMemo(uid);
  }

  function handleInputNetworkChange(value: string) {
    setNetwork(value);
    router.push(`/request?network=${value}`);
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-8 mt-4 mb-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="receivingAddress">Network</Label>
          <Select
            value={network}
            onValueChange={handleInputNetworkChange}
            defaultValue="kaia-kairos"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a network" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select a network</SelectLabel>
                <SelectItem value="kaia-kairos">Kaia Kairos</SelectItem>
                <SelectItem value="arbitrum-sepolia">
                  Aribtrum Sepolia
                </SelectItem>
                <SelectItem value="base-sepolia">Base Sepolia</SelectItem>
                <SelectItem value="ethereum-sepolia">
                  Ethereum Sepolia
                </SelectItem>
                <SelectItem value="fraxtal-testnet">Fraxtal Testnet</SelectItem>
                <SelectItem value="abstract-testnet">
                  Abstract Testnet
                </SelectItem>
                <SelectItem value="bartio-testnet">bArtio Testnet</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="receivingAddress">Receiving address</Label>
          <Input
            id="receivingAddress"
            className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
            placeholder="0x..."
            value={receivingAddress}
            onChange={(e) => setReceivingAddress(e.target.value)}
            required
          />
          <p className="text-sm text-muted-foreground">
            Fill in the address you want to receive the payment.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sendingAmount">Amount</Label>
          <Input
            id="sendingAmount"
            className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
            type="text" 
            inputMode="decimal" 
            pattern="[0-9]*"
            placeholder="0"
            value={sendingAmount}
            onChange={(e) => setSendingAmount(e.target.value)}
            required
          />
          <p className="text-sm text-muted-foreground">
            Fill in the amount you want to receive.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="transactionMemo">Memo</Label>
          <Textarea
            id="transactionMemo"
            className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
            placeholder="gm and gn"
            value={transactionMemo}
            onChange={(e) => setTransactionMemo(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Enter a memo for the transaction or autogenerate a UID for
            reference.
          </p>
          <Button
            onClick={autogenerateUid}
            variant="secondary"
            className="w-fit"
          >
            <WandSparkles className="mr-2 h-4 w-4" />
            Autogenerate UID
          </Button>
        </div>
        <Button onClick={constructLink}>
          <CirclePlus className="mr-2 h-4 w-4" />
          Generate request
        </Button>
        <div className="flex flex-col w-full border-black border-2 rounded-md p-4">
          <h2 className="text-3xl font-semibold mb-4">Share</h2>
          <div className="flex flex-row gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button disabled={!shareLinkActive}>
                  <Link className="mr-2 h-4 w-4" />
                  Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>You can share this link</DialogTitle>
                  <DialogDescription>
                    <Input
                      className="rounded-none w-full border-black border-2 p-2.5 mt-2"
                      value={requestLink}
                      readOnly
                    />
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <CopyButton text={requestLink} />
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button disabled={!shareLinkActive}>
                  <QrCode className="mr-2 h-4 w-4" />
                  QR
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Payment link QR
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Payer can scan this QR code to pay you
                  </DialogDescription>
                  <div className="flex flex-col items-center">
                    <QRCode
                      className="mt-4"
                      size={256}
                      value={
                        requestLink
                          ? requestLink
                          : `https://gmgn.app/pay?network=${network}`
                      }
                      viewBox={`0 0 256 256`}
                    />
                    <p className="flex flex-row items-center text-center mt-8">
                      <Info className="mr-2 w-4 h-4" />
                      Only works with GM GN wallet Pay feature
                    </p>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
