"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toHex, Address, isAddress, parseUnits, parseEther } from "viem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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
  selectAssetInfoFromAssetId
} from "@/lib/utils";
import QRCode from "react-qr-code";
import { ALL_SUPPORTED_ASSETS } from "@/lib/assets";
import { availableNetworksAtom, evmAddressAtom, polkadotAddressAtom } from "@/components/wallet-management";
import { useAtom, useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils'

export default function RequestForm() {

  // Get the search params from the URL.
  const searchParams = useSearchParams();

  // Get the addresses from the wallet management atoms
  const evmAddress = useAtomValue(evmAddressAtom)
  const polkadotAddress = useAtomValue(polkadotAddressAtom)
  // Check if the user is on a desktop or mobile device.
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Toast notifications.
  const { toast } = useToast();

  const [sendingAmount, setSendingAmount] = useState("");
  const [receivingAddress, setReceivingAddress] = useState(
    evmAddress ?? ""
  );
  const [transactionMemo, setTransactionMemo] = useState("");

  const [token, setToken] = useState<string>("eip155:1001/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE");
  const [isValidAddress, setIsValidAddress] = useState<Boolean>(
    false
  );
  const [isValidAmount, setIsValidAmount] = useState<Boolean>(
    false
  );
  const [isValidTransactionMemo, setIsValidTransactionMemo] = useState<Boolean>(
    false
  );
  const [requestLink, setRequestLink] = useState("");
  const [shareLinkActive, setShareLinkActive] = useState(false);

  function handleInputTokenChange(value: string) {
    setToken(value);
    if (value.split(":")[0] === "eip155") {
      setReceivingAddress(evmAddress ?? "");
    }

    if (value.split(":")[0] === "polkadot") {
      setReceivingAddress(polkadotAddress ?? "");
    }
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
      }/pay?token=${encodeURIComponent(token!)}&receivingAddress=${receivingAddress}&sendingAmount=${sendingAmount}&transactionMemo=${toHex(
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
            defaultValue="eip155:1001/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
          >
            <SelectTrigger className="w-full border-2 border-primary h-[56px]">
              <SelectValue placeholder="Select a token" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select a token</SelectLabel>
                {
                  ALL_SUPPORTED_ASSETS.map((asset) => (
                    <SelectItem key={asset} value={asset}>
                      <div className="flex flex-row gap-2 items-center">
                        <Image
                          src={selectAssetInfoFromAssetId(asset!).split(":")[3] || "/default-logo.png"}
                          alt={asset}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <div className="text-lg">{selectAssetInfoFromAssetId(asset!).split(":")[2]}</div>
                        <Badge variant="secondary">{selectAssetInfoFromAssetId(asset!).split(":")[0]}</Badge>
                      </div>
                    </SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="receivingAddress">Receiving address</Label>
          <Input
            id="receivingAddress"
            className="rounded-none w-full border-primary border-2 p-2.5 mt-2 text-lg"
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
                className="rounded-none w-full border-primary border-2 p-2.5 mt-2 text-lg"
                type="number"
                placeholder="0"
                value={sendingAmount}
                onChange={(e) => setSendingAmount(e.target.value)}
                required
              />
            ) : (
              <Input
                id="sendingAmount"
                className="rounded-none w-full border-primary border-2 p-2.5 mt-2 text-lg"
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
            className="rounded-none w-full border-primary border-2 p-2.5 mt-2 text-lg"
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
              } ${selectAssetInfoFromAssetId(token).split(":")[2]}`}
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
                          : `https://gmgn.app/pay?token=${token}`
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
