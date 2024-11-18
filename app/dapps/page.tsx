"use client";

import Link from "next/link";
import BackButton from "@/components/back-button";
import NavBar from "@/components/navbar";
import Header from "@/components/header";
import { appsData } from "./data";

export default function AppsPage() {

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Apps
      </h1>
      <BackButton route="/" />
      <NavBar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {
          appsData.map((app) => (
            <div key={app.id} className="flex flex-col gap-4 w-full">
              <Link href={app.url}>
                <div className="flex flex-col gap-2 border-2 border-primary p-4 rounded-md">
                  <h2>{app.name}</h2>
                  <p className="text-muted-foreground text-sm">
                    {app.description}
                  </p>
                </div>
              </Link>
            </div>
          ))
        }
      </div>
    </div>
  );
}
