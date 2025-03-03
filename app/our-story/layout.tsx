import BackButton from "@/components/back-button";
import Header from "@/components/header";

export default function MdxLayout({ children }: { children: React.ReactNode }) {

  // Create any shared layout or styles here
  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Our story
      </h1>
      <BackButton route="/" />
      {children}
    </div>
  );
}
