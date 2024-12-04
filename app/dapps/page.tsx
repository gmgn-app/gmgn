"use client";

import Link from "next/link";
import BackButton from "@/components/back-button";
import NavBar from "@/components/navbar";
import Header from "@/components/header";
import { appsData } from "./data";
import Image from "next/image";

export default function DappsPage() {

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Dapps
      </h1>
      <BackButton route="/" />
      <NavBar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {
          appsData.map((app) => (
            <DappItem key={app.id} dappProps={app} />
          ))
        }
      </div>
    </div>
  );
}

function DappItem({ dappProps }: { dappProps: any }) {
  return (
    <div className="flex flex-col gap-4 p-4 w-full rounded-md bg-muted">
      <Link href={dappProps.url}>
        <div className="flex flex-row gap-4 items-center">
          <Image
            src={`/dapps/${dappProps.icon}`}
            alt={dappProps.name}
            width={60}
            height={60}
            className="rounded-md"
          />
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold">{dappProps.name}</h2>
            <p className="text-muted-foreground text-sm">
              {dappProps.description}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}