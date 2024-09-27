import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/back-button";
import NavBar from "@/components/navbar";

export default function CollectionsPage() {
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
        Collections
      </h1>
      <BackButton route="/" />
      <NavBar />
    </div>
  );
}
