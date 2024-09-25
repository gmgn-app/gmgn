import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Clock, UserPen, Hash } from "lucide-react";

type SignatureObject = {
  account: string | null;
  timestamp: string | null;
  signature: string | null;
};

export default function SignatureReview({ signatureObject }: { signatureObject: SignatureObject }) {
  function unixTimestampToDateTime(unixTimestamp: number) {
    const date = new Date(unixTimestamp);
    return date.toLocaleString ? date.toLocaleString() : date.toUTCString();
  }

  return (
    <div className="flex flex-col border-black border-2 rounded-md p-4 w-[300px] md:w-[600px] lg:w-[900px]">
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
            value={signatureObject.account ? signatureObject.account : ""}
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
            value={unixTimestampToDateTime(signatureObject.timestamp ? parseInt(signatureObject.timestamp) : 0)}
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
            value={signatureObject.signature ? signatureObject.signature : ""}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
