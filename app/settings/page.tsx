import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { Trash2, ScanEye, CloudCog } from "lucide-react";


export default function SettingsPage() {

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
        Settings
      </h1>
      <BackButton route="/" />
      <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl border-b pb-2 font-semibold">Networks</h2>
        <p className="text-sm font-medium leading-none text-muted-foreground">
          You can add, remove or change default networks
        </p>
        <Button className="w-[200px] mt-6" asChild>
          <Link href="/networks">
            <CloudCog className="w-4 h-4 mr-2" />
            Proceed to change
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl border-b pb-2 font-semibold">Delete wallet</h2>
        <p className="text-sm font-medium leading-none text-muted-foreground">
          You can delete your wallet and create a new one
        </p>
        <Button className="w-[200px] mt-6" asChild variant="destructive">
          <Link href="/delete">
            <Trash2 className="w-4 h-4 mr-2" />
            Proceed to delete
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl border-b pb-2 font-semibold">Export wallet</h2>
        <p className="text-sm font-medium leading-none text-muted-foreground">
          You can export your private key
        </p>
        <Button className="w-[200px] mt-6" asChild>
          <Link href="/export">
            <ScanEye className="w-4 h-4 mr-2" />
            Proceed to export
          </Link>
        </Button>
      </div>
    </div>
    </div>
  );
}
