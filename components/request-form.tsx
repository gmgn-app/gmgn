"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toHex, Address, isAddress, parseUnits, parseEther } from "viem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  QrCode,
  CirclePlus,
  WandSparkles,
  Info,
  CircleX,
  Check,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CopyButton from "@/components/copy-button";
import { createId } from "@paralleldrive/cuid2";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  formatBalance,
  truncateAddress,
  selectNativeAssetSymbol,
} from "@/lib/utils";
import QRCode from "react-qr-code";

export default function RequestForm() {
  const router = useRouter();
  // Get the search params from the URL.
  const searchParams = useSearchParams();
  const network = searchParams.get("network") ? searchParams.get("network") : "kaia-kairos";
  const paramAddress = searchParams.get("address");
  const paramToken = searchParams.get("token");
  // Check if the user is on a desktop or mobile device.
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Toast notifications.
  const { toast } = useToast();

  const [sendingAmount, setSendingAmount] = useState("");
  const [receivingAddress, setReceivingAddress] = useState(
    paramAddress ?? ""
  );
  const [transactionMemo, setTransactionMemo] = useState("");

  const [token, setToken] = useState<string | undefined>(paramToken && paramToken !== "null" ? paramToken : "0x0000000000000000000000000000000000000000");
  const [isValidAddress, setIsValidAddress] = useState<Boolean | undefined>(
    undefined
  );
  const [isValidAmount, setIsValidAmount] = useState<Boolean | undefined>(
    undefined
  );
  const [isValidTransactionMemo, setIsValidTransactionMemo] = useState<Boolean>(
    false
  );
  const [requestLink, setRequestLink] = useState("");
  const [shareLinkActive, setShareLinkActive] = useState(false);

  function handleInputTokenChange(value: string) {
    setToken(value);
    router.push(`?network=${network}&address=${receivingAddress}&token=${value}`);
  }


  function constructLink() {
    if (receivingAddress === "") {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You did not enter a receiving address.",
        description: "Please enter a receiving address to continue.",
      });
      return;
    }
    if (receivingAddress) {
      const isValidAddress = isAddress(receivingAddress, { strict: false });
      if (isValidAddress) {
        setIsValidAddress(true);
      } else {
        setIsValidAddress(false);
        toast({
          className:
            "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
          variant: "destructive",
          title: "Uh oh! You did not enter a valid address.",
          description: "Please enter a valid address to continue.",
        });
        return;
      }
    }
    if (sendingAmount === "") {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! You did not enter an amount to send.",
        description: "Please enter an amount to send to continue.",
      });
      return;
    }
    if (sendingAmount) {
      const isValidAmount = !isNaN(parseFloat(sendingAmount));
      if (isValidAmount) {
        setIsValidAmount(true);
      } else {
        setIsValidAmount(false);
        toast({
          className:
            "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
          variant: "destructive",
          title: "Uh oh! You did not enter a valid amount.",
          description: "Please enter a valid amount to continue.",
        });
        return;
      }
      if (!transactionMemo) {
        toast({
          className:
            "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
          variant: "destructive",
          title: "Uh oh! You did not enter a transaction memo.",
          description:
            "Please enter a transaction memo or autogenerate one to continue.",
        });
        return;
      }
      if (transactionMemo) {
        setIsValidTransactionMemo(true);
      }
      
      const link = `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/pay?network=${network}&token=${token}&receivingAddress=${receivingAddress}&sendingAmount=${token === "0x0000000000000000000000000000000000000000" ? parseEther(sendingAmount).toString() : parseUnits(sendingAmount, 6).toString()}&transactionMemo=${toHex(
        transactionMemo
      )}`;
      setRequestLink(link);
      setShareLinkActive(true);
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        title: "Request generated!",
        description: "You can now share the request with others.",
      });
    }
  }

  function autogenerateUid() {
    const uid = createId();
    setTransactionMemo(uid);
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-8 mt-4 mb-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="sendingToken">Sending token</Label>
          <Select
            value={token!}
            onValueChange={handleInputTokenChange}
            defaultValue="0x0000000000000000000000000000000000000000"
          >
            <SelectTrigger className="w-full border-2 border-primary rounded-none">
              <SelectValue placeholder="Select a token" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select a token</SelectLabel>
                <SelectItem value="0x0000000000000000000000000000000000000000">
                  <div className="flex flex-row gap-2">
                    <Image
                      src="/kaia.png"
                      alt="kaia logo"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <p>
                      {selectNativeAssetSymbol(
                        network,
                        "0x0000000000000000000000000000000000000000"
                      )}
                    </p>
                  </div>
                </SelectItem>
                <SelectItem value="0x8cfA6aC9c5ae72faec3A0aEefEd1bFB12c8cC746">
                  <div className="flex flex-row gap-2">
                    <Image
                      src="/usdc.svg"
                      alt="usdc logo"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    {selectNativeAssetSymbol(
                      network,
                      "0x8cfA6aC9c5ae72faec3A0aEefEd1bFB12c8cC746"
                    )}
                  </div>
                </SelectItem>
                <SelectItem value="0x0076e4cE0E5428d7fc05eBaFbd644Ee74BDE624d">
                <div className="flex flex-row gap-2">
                    <Image
                      src="/usdt.svg"
                      alt="usdt logo"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    {selectNativeAssetSymbol(
                      network,
                      "0x0076e4cE0E5428d7fc05eBaFbd644Ee74BDE624d"
                    )}
                  </div>
                </SelectItem>
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
          {
            isDesktop ? (
              <Input
                id="sendingAmount"
                className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
                type="number"
                placeholder="0"
                value={sendingAmount}
                onChange={(e) => setSendingAmount(e.target.value)}
                required
              />
            ) : (
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
            )
          }
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
        <div className="flex flex-col gap-2 border-2 border-primary p-2">
          <h2 className="border-b pb-1 text-md font-semibold">Details</h2>
          <div className="flex flex-row gap-2">
            <h3 className="text-sm text-muted-foreground">Receiving address</h3>
            <p className="flex flex-row gap-2 items-center text-sm">
              {receivingAddress
                ? truncateAddress(receivingAddress as Address, 4)
                : "-----"}
              {isValidAddress === undefined ? null : isValidAddress === true ? (
                <Popover>
                  <PopoverTrigger>
                    <Check className="w-4 h-4 text-green-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-green-500">
                    Valid address
                  </PopoverContent>
                </Popover>
              ) : (
                <Popover>
                  <PopoverTrigger>
                    <CircleX className="w-4 h-4 text-red-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-red-500">
                    Invalid address
                  </PopoverContent>
                </Popover>
              )}
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <h3 className="text-sm text-muted-foreground">Sending amount</h3>
            <p className="flex flex-row gap-2 items-center text-sm">
              {`${
                sendingAmount ? formatBalance(sendingAmount, 18) : "-----"
              } ${selectNativeAssetSymbol(network)}`}
              {isValidAmount === undefined ? null : isValidAmount === true ? (
                <Popover>
                  <PopoverTrigger>
                    <Check className="w-4 h-4 text-green-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-green-500">
                    Valid amount
                  </PopoverContent>
                </Popover>
              ) : (
                <Popover>
                  <PopoverTrigger>
                    <CircleX className="w-4 h-4 text-red-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-red-500">
                    Invalid amount
                  </PopoverContent>
                </Popover>
              )}
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <h3 className="text-sm text-muted-foreground">Memo</h3>
            <p className="flex flex-row gap-2 items-center text-sm">
              {isValidTransactionMemo === true ? (
                <Popover>
                  <PopoverTrigger>
                    <Check className="w-4 h-4 text-green-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-green-500">
                    Valid memo
                  </PopoverContent>
                </Popover>
              ) : (
                <Popover>
                  <PopoverTrigger>
                    <CircleX className="w-4 h-4 text-red-500" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-red-500">
                    Invalid memo
                  </PopoverContent>
                </Popover>
              )}
            </p>
          </div>
        </div>
        <Button onClick={constructLink}>
          <CirclePlus className="mr-2 h-4 w-4" />
          Generate request
        </Button>
        <div className="flex flex-col gap-4 w-full border-black border-2 rounded-md p-4">
          <h2 className="text-3xl font-semibold">Share</h2>
          <Input
            className="rounded-none w-full border-black border-2 p-2.5"
            value={requestLink}
            readOnly
          />
          <div className="flex flex-row gap-2">
            <CopyButton text={requestLink} />
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
