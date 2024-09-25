import SendTransactionForm from "@/components/send-transaction-form";
import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/back-button";

export default function SendPage() {
  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Link href="/">
        <Image
          src="/gmgn-logo.svg"
          alt="gmgn logo"
          width={40}
          height={40}
          className="rounded-md"
        />
      </Link>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Send
      </h1>
      <BackButton />
      <SendTransactionForm />
    </div>
  );
}
