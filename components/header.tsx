import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";


export default function Header() {

  return (
    <div className="flex flex-row justify-between items-center">
      <Link href="/">
        <Image
          src="/gmgn-logo.svg"
          alt="gmgn logo"
          width={40}
          height={40}
          className="rounded-md"
        />
      </Link>
      <Button asChild size="icon" variant="outline">
        <Link href="/settings">
          <Settings className="w-6 h-6" />
        </Link>
      </Button>
    </div>
  );
}
