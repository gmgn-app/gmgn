import WalletManagement from "@/components/wallet-management";
import Faqs from "@/components/faqs";
import NavBar from "@/components/navbar";

export default function Page() {

  return (
    <div className="flex flex-col gap-12 p-4 items-center justify-center w-screen md:w-[768px]">
      <WalletManagement />
      <Faqs />
      <NavBar />
    </div>
  );
}
