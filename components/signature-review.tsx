"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation";
import { Clock, UserPen, Hash } from "lucide-react";


export default function SignatureReview() {
  const searchParams = useSearchParams();
  const address: string | null = searchParams.get("address");
  const timestamp: string | null = searchParams.get("timestamp");
  const signature: string | null = searchParams.get("signature");

  function unixTimestampToDateTime(unixTimestamp: number) {
    const date = new Date(unixTimestamp);
    return date.toLocaleString ? date.toLocaleString() : date.toUTCString();
  }

  return (
    <div className="flex flex-col border-black border-2 rounded-md p-4">
      <h2 className="text-3xl font-semibold mb-4">Signature</h2>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="flex flex-row items-center">
            <UserPen className="mr-2 h-4 w-4" />
            Signed by
          </p>
          <Input
            className="rounded-none w-full border-black border-2 p-2.5"
            placeholder="0x..."
            value={address ? address : ""}
            readOnly
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="flex flex-row items-center">
            <Clock className="mr-2 h-4 w-4" />
            At
          </p>
          <Input
            className="rounded-none w-full border-black border-2 p-2.5"
            placeholder="0x..."
            value={unixTimestampToDateTime(timestamp ? parseInt(timestamp) : 0)}
            readOnly
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="flex flex-row items-center">
            <Hash className="mr-2 h-4 w-4" />
            Hash
          </p>
          <Textarea
            className="rounded-none w-full h-36 border-black border-2 p-2.5"
            placeholder="Enter your message"
            value={signature ? signature : ""}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
