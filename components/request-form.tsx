"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Address, fromBytes, toHex } from "viem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Clock,
  Signature,
  UserPen,
  Hash,
  Link,
} from "lucide-react";
import CopyButton from "@/components/copy-button";
import { createId } from '@paralleldrive/cuid2';


export default function RequestForm() {
  const router = useRouter();
  const [sendingAmount, setSendingAmount] = useState("");
  const [receivingAddress, setReceivingAddress] = useState("");
  const [transactionMemo, setTransactionMemo] = useState("");
  const [network, setNetwork] = useState("");
  const [requestLink, setRequestLink] = useState("");

  function constructLink() {
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/request?sendingAmount=${sendingAmount}&receivingAddress=${receivingAddress}&transactionMemo=${transactionMemo}&network=${network}`;
    setRequestLink(link);
  }

  function autogenerateUid() {
    const uid = createId();
    setTransactionMemo(uid);
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-8 mt-4 mb-6">
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
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sendingAmount">Amount</Label>
          <Input
            id="sendingAmount"
            className="rounded-none w-full border-primary border-2 p-2.5 mt-2"
            type="number"
            placeholder="0"
            value={sendingAmount}
            onChange={(e) => setSendingAmount(e.target.value)}
            required
          />
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
            <Button onClick={autogenerateUid} className="w-fit">Autogenerate UID</Button>
        </div>
        <Button
          onClick={constructLink}
          className="w-fit"
        >
          Generate request
        </Button>
        <div className="flex flex-col w-full border-black border-2 rounded-md p-4">
        <h2 className="text-3xl font-semibold mb-4">Share</h2>
        <div className="flex flex-row gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
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
                <CopyButton
                  text={requestLink}
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Hash className="mr-2 h-4 w-4" />
                Hash
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>You can share this text</DialogTitle>
                <DialogDescription>
                  <Input
                    className="rounded-none w-full border-black border-2 p-2.5 mt-2"
                    value={requestLink}
                    readOnly
                  />
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <CopyButton text={requestLink ? requestLink : "none"} />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      </div>
    </div>
  );
}
