import SendTransactionForm from "@/components/send-transaction-form";

export default function SendPage() {
  return (
    <div className="flex flex-col gap-12 p-4 w-screen md:w-[768px]">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Send
      </h1>
      <SendTransactionForm />
    </div>
  )
}