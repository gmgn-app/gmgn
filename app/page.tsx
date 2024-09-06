import Link from "next/link";
import { Wallet, Signature, MessageSquareText } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 justify-center h-screen">
      <h1 className="text-3xl font-bold">Welcome and have fun!</h1>
      <a
        className="flex flex-row items-center border-2 border-primary rounded-none p-2.5 font-semibold"
        href="https://wallet.gmgn.app"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Wallet
      </a>
      <Link
        className="flex flex-row items-center border-2 border-primary rounded-none p-2.5 font-semibold"
        href="/sign"
      >
        <Signature className="mr-2 h-4 w-4" />
        Sign
      </Link>
      <Link
        className="flex flex-row items-center border-2 border-primary rounded-none p-2.5 font-semibold"
        href="/message"
      >
        <MessageSquareText className="mr-2 h-4 w-4" />
        Message
      </Link>
    </div>
  );
}
