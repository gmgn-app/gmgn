"use client";

import { useSearchParams } from "next/navigation";
import BackButton from "@/components/back-button";
import Header from "@/components/header";
import { constructNavUrl } from "@/lib/utils";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const network = searchParams.get("network");
  
  // Create any shared layout or styles here
  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Learn
      </h1>
      <BackButton route={constructNavUrl("/", network, address)} />
      {children}
    </div>
  );
}
