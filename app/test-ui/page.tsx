import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Skeleton className="w-[40px] h-[40px] rounded-md" />
      <Skeleton className="w-[200px] h-[40px] rounded-md" />
      <Skeleton className="w-[100px] h-[40px] rounded-md" />
      <Skeleton className="w-full h-[600px] rounded-md" />
    </div>
  );
}
